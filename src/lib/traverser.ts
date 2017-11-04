import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Resolver} from './resolver';
import {Marker} from './marker';
import {Normalizer} from './normalizer';
import {Target} from './interfaces';
import 'rxjs/add/observable/of';

@Injectable()
export class Traverser {

  public target: BehaviorSubject<Target>;
  private views: {[key: string]: any} = {};

  constructor(private location: Location,
              private resolver: Resolver,
              private marker: Marker,
              private normalizer: Normalizer) {
    this.target = new BehaviorSubject({
      component: null,
      context: {},
      contextPath: '',
      path: '',
      query: new URLSearchParams(''),
      view: 'view',
    });
  }

  traverse(path: string, navigate: boolean = true) {
    path = this.normalizer.normalize(path);
    let contextPath: string = path;
    let queryString = '';
    let view = 'view';
    if (path.indexOf('?') > -1) {
      queryString = contextPath.split('?')[1];
      contextPath = contextPath.split('?')[0];
    }
    if (path.indexOf('@@') > -1) {
      view = contextPath.split('@@')[1];
      contextPath = contextPath.split('@@')[0];
      if (contextPath.slice(-1) === '/') {
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
      this.location.go(navigateTo);
    }
    const viewComponents: {[key: string]: any} = this.views[view];
    if (viewComponents) {
      let resolver;
      if (!contextPath && Object.keys(this.target.value.context).length) {
        // if no context path, we keep the current context if exists
        resolver = Observable.of(this.target.value.context);
        contextPath = this.target.value.contextPath;
      } else {
        resolver = this.resolver.resolve(contextPath, view, queryString);
      }
      if (resolver) {
        resolver.subscribe(context => {
          const marker = this.marker.mark(context);
          let component;
          if (marker instanceof Array) {
            const matches = marker.filter(m => viewComponents[m]);
            if (matches.length > 0) {
              component = viewComponents[matches[0]];
            }
          } else {
            component = viewComponents[marker];
          }
          if (!component) {
            component = viewComponents['*'];
          }
          if (component) {
            this.target.next(<Target>{
              context: context,
              path: path,
              contextPath: contextPath,
              view: view,
              component: component,
              query: new URLSearchParams(queryString || '')
            });
          }
        });
      }
    }
  }

  addView(name: string, target: string, component: any) {
    if (!this.views[name]) {
      this.views[name] = {};
    }
    this.views[name][target] = component;
  }
}
