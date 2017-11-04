import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  OnInit,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { Location } from '@angular/common';
import { Traverser } from './traverser';
import { Target } from './interfaces';

@Directive({
  selector: 'traverser-outlet',
})
export class TraverserOutlet implements OnInit, OnDestroy {
  private viewInstance: any;

  constructor(
    private traverser: Traverser,
    private location: Location,
    private container: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
    this.traverser.target.subscribe((target: Target) => this.render(target));
    this.traverser.traverse(this.location.path());
    this.location.subscribe(location => {
      this.traverser.traverse(String(location.url), false);
    });
  }

  ngOnDestroy() {
    if (this.viewInstance) {
      this.viewInstance.destroy();
    }
  }

  render(target: Target) {
    if (this.viewInstance) {
      this.viewInstance.destroy();
    }
    if (target.component) {
      const componentFactory = this.resolver.resolveComponentFactory(
        target.component);
      this.viewInstance = this.container.createComponent(componentFactory);
    }
  }
}
