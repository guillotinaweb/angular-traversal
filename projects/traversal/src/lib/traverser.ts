import {
    Injectable,
    ComponentFactoryResolver,
    ComponentFactory,
    Inject,
    InjectionToken,
    Optional,
    Type,
    Compiler,
    Injector,
} from '@angular/core';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, of, Observable, Subject, combineLatest } from 'rxjs';
import { take, withLatestFrom, map } from 'rxjs/operators';
import { Resolver } from './resolver';
import { Marker } from './marker';
import { Normalizer } from './normalizer';
import { Target, HttpParamsOptions, ModuleWithViews, ViewMapping } from './interfaces';

export type LazyView = () => Promise<Type<any>>;

export const NAVIGATION_PREFIX = new InjectionToken<string>('traversal.prefix');

@Injectable({
    providedIn: 'root'
})
export class Traverser {

    target: BehaviorSubject<Target>;
    beforeTraverse: Subject<[Subject<boolean>, string]> = new Subject();
    traverseTo: Subject<{path: string, navigate: boolean}> = new Subject();
    echo: Subject<boolean> = new Subject();
    canTraverse: Subject<boolean> = new Subject();
    tilesContexts: {[name: string]: BehaviorSubject<Target>} = {};
    tileUpdates: Subject<{tile: string, target: Target}> = new Subject();
    private views: { [name: string]: ViewMapping | {[target: string]: string }} = {};
    private lazy: { [id: string]: LazyView} = {};
    private tiles: { [name: string]: {[target: string]: any} } = {};
    private prefix: string;

    constructor(
        private location: Location,
        private resolver: Resolver,
        private marker: Marker,
        private normalizer: Normalizer,
        private ngResolver: ComponentFactoryResolver,
        private compiler: Compiler,
        private injector: Injector,
        @Optional() @Inject(NAVIGATION_PREFIX) prefix: string,
    ) {
        this.prefix = prefix || '';
        this.target = new BehaviorSubject(this.getEmptyTarget());
        let answers: boolean[] = [];
        this.echo.subscribe(ok => {
            answers.push(ok);
            if (answers.length === this.beforeTraverse.observers.length) {
                this.canTraverse.next(answers.every(yes => yes));
            }
        });
        this.traverseTo.pipe(
            withLatestFrom(this.canTraverse)
        ).subscribe(([traverse, ok]) => {
            if (ok) {
                this._traverse(traverse.path, traverse.navigate);
            } else {
                this.location.replaceState(this.target.getValue().path);
            }
            answers = [];
        });
    }

    traverse(path: string, navigate: boolean = true) {
        path = this.normalizer.normalize(this.getFullPath(path));
        const obsCount = this.beforeTraverse.observers.length;
        if (obsCount > 0) {
            this.beforeTraverse.next([this.echo, path]);
        } else {
            this.canTraverse.next(true);
        }
        this.traverseTo.next({path, navigate});
    }

    _traverse(path: string, navigate: boolean) {
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
            if (this.location.path() !== this.prefix + navigateTo) {
                this.location.go(this.prefix + navigateTo);
            }
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
        (this.views[name] as {[target: string]: string})[target] = component;
    }

    addLazyView(name: string, target: string, loader: LazyView) {
        if (!this.views[name]) {
            this.views[name] = {};
        }
        const id = name + ';' + target;
        (this.views[name] as {[target: string]: string})[target] = id;
        this.lazy[id] = loader;
    }

    loadLazyView(id: string, isTile = false): Promise<Type<any>> {
        return this.lazy[id]().then(module => {
            this.compiler.compileModuleAsync(module).then(factory => {
                factory.create(this.injector);
            });
            const moduleViews = (module as ModuleWithViews).traverserViews || [];
            moduleViews.forEach(view => {
                this.views[view.name] = !!this.views[view.name] ?
                    {...this.views[view.name], ...view.components} :
                    view.components;
            });
            const moduleTiles = (module as ModuleWithViews).traverserTiles || [];
            moduleTiles.forEach(tile => {
                this.tiles[tile.name] = !!this.tiles[tile.name] ?
                    {...this.tiles[tile.name], ...tile.components} :
                    tile.components;
            });
            const [viewName, target] = id.split(';');
            return (isTile ? this.tiles : this.views)[viewName][target] as Type<any>;
        });
    }

    addTile(name: string, target: string, component: any) {
        if (!this.tiles[name]) {
            this.tiles[name] = {};
        }
        this.tiles[name][target] = component;
        this.tilesContexts[name] = new BehaviorSubject(this.getEmptyTarget());
    }

    loadTile(name: string, path: string) {
        path = this.normalizer.normalize(this.getFullPath(path));
        let contextPath: string = path;
        let queryString = '';
        if (path.includes('?')) {
            [contextPath, queryString] = contextPath.split('?');
        }
        this.emitTarget(path, contextPath, queryString, name, this.tilesContexts[name], this.tiles[name], true);
    }

    emptyTile(name: string) {
        if (!!this.tilesContexts[name]) {
            this._emit(this.tilesContexts[name], this.getEmptyTarget(), name, true);
        }
    }

    addLazyTile(name: string, target: string, loader: LazyView) {
        if (!this.tiles[name]) {
            this.tiles[name] = {};
        }
        const id = name + ';' + target;
        this.tiles[name][target] = id;
        this.tilesContexts[name] = new BehaviorSubject(this.getEmptyTarget());
        this.lazy[id] = loader;
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
            let resolver: Observable<any>;
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
                resolver.pipe(take(1)).subscribe((context: any) => {
                    const marker = this.marker.mark(context);
                    let component: Type<any> | string = '';
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
                    if (!!component) {
                        const promise = typeof(component) === 'string' ? this.loadLazyView(component, isTile) : Promise.resolve(component);
                        promise.then(comp => {
                            const target = !!component ? {
                                context,
                                path,
                                prefixedPath: this.prefix + path,
                                contextPath,
                                prefixedContextPath: this.prefix + contextPath,
                                view: viewOrTile,
                                component: comp,
                                query: new HttpParams({ fromString: queryString || '' } as HttpParamsOptions)
                            } as Target : this.getEmptyTarget();
                            this._emit(targetObs, target, viewOrTile, isTile);
                        });
                    } else {
                        this._emit(targetObs, this.getEmptyTarget(), viewOrTile, isTile);
                    }
                });
            }
        }
    }

    _emit(targetObs: BehaviorSubject<Target>, target: Target, viewOrTile: string, isTile: boolean) {
        targetObs.next(target);
        if (isTile) {
            this.tileUpdates.next({
                tile: viewOrTile,
                target,
            });
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
        } else if (path.startsWith('../') || path === '..') {
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

    getEmptyTarget(): Target {
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

    getQueryParams(): Observable<{[key: string]: string}> {
        return this.target.pipe(
            take(1),
            map(target => {
                const queryParams = target.query;
                if (!queryParams) {
                    return {};
                } else {
                    return queryParams.keys().reduce((all: {[key: string]: string}, key) => {
                        const value = queryParams.get(key);
                        if (!!value) {
                            all[key] = value;
                        }
                        return all;
                    }, {});
                }
            })
        );
    }
}
