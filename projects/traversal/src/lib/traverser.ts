import { Injectable, ComponentFactoryResolver, ComponentFactory, Inject, InjectionToken, Optional } from '@angular/core';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, of, Observable, Subject } from 'rxjs';
import { Resolver } from './resolver';
import { Marker } from './marker';
import { Normalizer } from './normalizer';
import { Target, HttpParamsOptions } from './interfaces';

export const NAVIGATION_PREFIX = new InjectionToken<string>('traversal.prefix');

@Injectable({
    providedIn: 'root'
})
export class Traverser {

    public target: BehaviorSubject<Target>;
    private views: { [view: string]: {[target: string]: any} } = {};
    public tilesContexts: {[name: string]: BehaviorSubject<Target>} = {};
    private tiles: { [name: string]: {[target: string]: any} } = {};
    public tileUpdates: Subject<{tile: string, target: Target}> = new Subject();
    private prefix: string;

    constructor(
        private location: Location,
        private resolver: Resolver,
        private marker: Marker,
        private normalizer: Normalizer,
        private ngResolver: ComponentFactoryResolver,
        @Optional() @Inject(NAVIGATION_PREFIX) prefix: string,
    ) {
        this.prefix = prefix || '';
        this.target = new BehaviorSubject(this.emptyTarget());
    }

    traverse(path: string, navigate: boolean = true) {
        path = this.normalizer.normalize(this.getFullPath(path));
        let contextPath: string = path;
        let queryString = '';
        let view = 'view';
        if (path.indexOf('?') > -1) {
            [contextPath, queryString] = contextPath.split('?');
        } else if (path.indexOf(';') > -1) {
            [contextPath, queryString] = contextPath.split(';');
        }
        if (path.indexOf('@@') > -1) {
            view = contextPath.split('@@')[1];
            contextPath = contextPath.split('@@')[0];
            if (contextPath.length > 1 && contextPath.slice(-1) === '/') {
                contextPath = contextPath.slice(0, -1);
            }
        }
        if (navigate) {
            let navigateTo = path;
            if (!contextPath) {
                // if no contextPath, preserve the previous one
                if (navigateTo[0] !== '/') {
                    navigateTo = '/' + navigateTo;
                }
                navigateTo = this.target.value.contextPath + navigateTo;
            }
            this.location.go(this.prefix + navigateTo);
        }
        this.emitTarget(path, contextPath, queryString, view, this.target, this.views[view]);
    }

    traverseHere() {
        this.traverse(this.location.path().slice(this.prefix.length));
    }

    addView(name: string, target: string, component: any) {
        if (!this.views[name]) {
            this.views[name] = {};
        }
        this.views[name][target] = component;
    }

    addTile(name: string, target: string, component: any) {
        if (!this.tiles[name]) {
            this.tiles[name] = {};
        }
        this.tiles[name][target] = component;
        this.tilesContexts[name] = new BehaviorSubject(this.emptyTarget());
    }

    loadTile(name: string, path: string) {
        path = this.normalizer.normalize(this.getFullPath(path));
        let contextPath: string = path;
        let queryString = '';
        if (path.indexOf('?') > -1) {
            [contextPath, queryString] = contextPath.split('?');
        }
        this.emitTarget(path, contextPath, queryString, name, this.tilesContexts[name], this.tiles[name], true);
    }

    applyTargetToTile(name: string, target: Target) {
        this.emitTarget(
            target.path,
            target.contextPath,
            !!target.query ? target.query.toString() : '',
            name,
            this.tilesContexts[name],
            this.tiles[name],
            true,
            target.context,
        );
    }

    emitTarget(
        path: string,
        contextPath: string,
        queryString: string,
        viewOrTile: string,
        targetObs: BehaviorSubject<Target>,
        components: { [target: string]: any },
        isTile = false,
        currentContext?: any,
    ) {
        if (!!targetObs && !!components) {
            let resolver: any;
            if (!!currentContext) {
                resolver = of(currentContext);
            } else if (!contextPath  // if we have no context path
                && Object.keys(targetObs.value.context).length > 0  // and we have context
                // and query string did not change
                && !!targetObs.value.query && queryString === Object.assign(new HttpParams(), targetObs.value.query).toString()) {
                // then we keep the current context
                resolver = of(targetObs.value.context);
                contextPath = targetObs.value.contextPath;
            } else {
                resolver = this._resolve(contextPath, viewOrTile, queryString);
            }
            if (resolver) {
                resolver.subscribe((context: any) => {
                    const marker = this.marker.mark(context);
                    let component;
                    if (marker instanceof Array) {
                        const matches = marker.filter(m => components[m]);
                        if (matches.length > 0) {
                            component = components[matches[0]];
                        }
                    } else {
                        component = components[marker];
                    }
                    if (!component) {
                        component = components['*'];
                    }
                    const target = !!component ? {
                        context,
                        path,
                        prefixedPath: this.prefix + path,
                        contextPath,
                        prefixedContextPath: this.prefix + contextPath,
                        view: viewOrTile,
                        component,
                        query: new HttpParams({ fromString: queryString || '' } as HttpParamsOptions)
                    } as Target : this.emptyTarget();
                    targetObs.next(target);
                    if (isTile) {
                        this.tileUpdates.next({
                            tile: viewOrTile,
                            target,
                        });
                    }
                });
            }
        }
    }

    _resolve(path: string, view?: any, queryString?: string): Observable<any> {
        return this.resolver.resolve(path, view, queryString);
    }

    resolve(path: string, view?: any, queryString?: string): Observable<any> {
        return this._resolve(this.normalizer.normalize(this.getFullPath(path)), view, queryString);
    }

    getFullPath(path: string): string {
        if (path === '.') {
            path = this.target.value.contextPath;
        } else if (path.startsWith('./')) {
            path = this.target.value.contextPath === '/' ? path.slice(1) : this.target.value.contextPath + path.slice(1);
        } else if (path.startsWith('../')) {
            const current = this.target.value.contextPath.split('/');
            path = path.split('/').reduce((all, chunk) => {
                if (chunk === '..') {
                    all.pop();
                } else {
                    all.push(chunk);
                }
                return all;
            }, current).join('/');
        }
        return path;
    }

    getComponent(component: any): ComponentFactory<unknown> {
        return this.ngResolver.resolveComponentFactory(component);
    }

    emptyTarget(): Target {
        return {
            component: null,
            context: {},
            contextPath: '',
            prefixedContextPath: this.prefix,
            path: '',
            prefixedPath: this.prefix,
            query: new HttpParams(),
            view: 'view',
        };
    }
}
