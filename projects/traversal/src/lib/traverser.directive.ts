import {
    Directive,
    OnInit,
    OnDestroy,
    ViewContainerRef,
    Inject,
    Optional,
    Input,
} from '@angular/core';
import { Location } from '@angular/common';
import { Traverser, NAVIGATION_PREFIX } from './traverser';
import { Target } from './interfaces';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({
    selector: 'traverser-outlet',
})
export class TraverserOutlet implements OnInit, OnDestroy {
    @Input() noAutoTraverse = false;
    private viewInstance: any;
    private prefix: string;
    private terminator: Subject<void> = new Subject();

    constructor(
        private traverser: Traverser,
        private location: Location,
        private container: ViewContainerRef,
        @Optional() @Inject(NAVIGATION_PREFIX) prefix: string,
    ) {
        this.prefix = prefix || '';
    }

    ngOnInit() {
        this.traverser.target.pipe(takeUntil(this.terminator)).subscribe((target: Target) => this.render(target));
        this.traverser.traverse(this.location.path().slice(this.prefix.length));
        if (!this.noAutoTraverse) {
            this.location.subscribe(loc => {
                this.traverser.traverse(loc.url || '', false);
            });
        }
    }

    ngOnDestroy() {
        if (this.viewInstance) {
            this.viewInstance.destroy();
        }
        this.terminator.next();
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
