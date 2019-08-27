import {
    Directive,
    OnInit,
    OnDestroy,
    ViewContainerRef,
    Inject,
    Optional,
} from '@angular/core';
import { Location } from '@angular/common';
import { Traverser, NAVIGATION_PREFIX } from './traverser';
import { Target } from './interfaces';

@Directive({
    selector: 'traverser-outlet',
})
export class TraverserOutlet implements OnInit, OnDestroy {
    private viewInstance: any;
    private prefix: string;

    constructor(
        private traverser: Traverser,
        private location: Location,
        private container: ViewContainerRef,
        @Optional() @Inject(NAVIGATION_PREFIX) prefix: string,
    ) {
        this.prefix = prefix || '';
    }

    ngOnInit() {
        this.traverser.target.subscribe((target: Target) => this.render(target));
        this.traverser.traverse(this.location.path().slice(this.prefix.length));
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
            const componentFactory = this.traverser.getComponent(target.component);
            this.viewInstance = this.container.createComponent(componentFactory);
        }
    }
}
