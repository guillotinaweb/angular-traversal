import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { BehaviorSubject } from "rxjs/Rx";
import { Resolver } from './resolver';
import { Marker } from './marker';
import { Normalizer } from './normalizer';

@Injectable()
export class Traverser {

  public target: BehaviorSubject<any>;
  private views = {};

  constructor(
    private location: Location,
    private resolver: Resolver,
    private marker: Marker,
    private normalizer: Normalizer,
  ) {
    this.target = new BehaviorSubject({
      context: {},
      path: '',
      view: 'view',
      component: null,
    });
  }

  traverse(path: string, navigate: boolean = true) {
    path = this.normalizer.normalize(path);
    let contextPath:string = path;
    let view:string = 'view';
    if(path.indexOf('@@') > -1) {
      contextPath = path.split('/@@')[0];
      view = path.split('/@@')[1];
    }
    if(navigate) {
      this.location.go(path);
    }
    let viewComponents = this.views[view];
    if(viewComponents) {
      this.resolver.resolve(contextPath, view).subscribe(context => {
        let marker = this.marker.mark(context);
        let component;
        if(marker instanceof Array) {
          let matches = marker.filter(m => viewComponents[m]);
          if(matches.length > 0){
            component = viewComponents[matches[0]];
          }
        } else {
          component = viewComponents[marker];
        }
        if(!component) {
          component = viewComponents['*'];
        }
        if(component) {
          this.target.next({
            context: context,
            path: path,
            contextPath: contextPath,
            view: view,
            component: component,
          });
        }
      });
    }
  }

  addView(name: string, target: string, component: any) {
    if(!this.views[name]) {
      this.views[name] = {};
    }
    this.views[name][target] = component;
  }
}