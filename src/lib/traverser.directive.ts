import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  OnInit,
  ReflectiveInjector,
  ViewContainerRef,
} from '@angular/core';
import { Location } from '@angular/common';
import { Traverser } from './traverser';

@Directive({
  selector: 'traverser-outlet',
})
export class TraverserOutlet implements OnInit {
  private ref: ComponentRef<any>;
  private viewInstance:any;

  constructor(
    private traverser: Traverser,
    private location: Location,
    private container: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
    this.traverser.target.subscribe(target => this.render(target));
    this.traverser.traverse(this.location.path());
  }

  ngOnDestroy() {
    if(this.viewInstance) {
      this.viewInstance.destroy();
    }
  }

  render(target) {
    if(this.viewInstance) {
      this.viewInstance.destroy();
    }
    if(target.component) {
      let componentFactory = this.resolver.resolveComponentFactory(
        target.component);
      this.viewInstance = this.container.createComponent(componentFactory);
    }
  }
}
