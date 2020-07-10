import {
    Directive,
    OnInit,
    OnDestroy,
    ViewContainerRef,
    Inject,
    Optional,
    Input,
    ChangeDetectorRef,
    ViewRef,
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
    private viewInstance: any;
    private prefix: string;
    private terminator: Subject<void> = new Subject();

    constructor(
        private traverser: Traverser,
        private location: Location,
        private container: ViewContainerRef,
        @Optional() @Inject(NAVIGATION_PREFIX) prefix: string,
        private cdr: ChangeDetectorRef
    ) {
        this.prefix = prefix || '';
    }

    ngOnInit() {
        this.traverser.target.pipe(takeUntil(this.terminator)).subscribe((target: Target) => this.render(target));
        this.traverser.traverse(this.location.path().slice(this.prefix.length), false);
        this.location.subscribe((loc) => {
            const path = (loc.url || '').slice(this.prefix.length);
            this.traverser.traverse(path || '/', false); // when empty string traverse to root
        });
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
        if (!(this.cdr as ViewRef).destroyed) {
            this.cdr.detectChanges();
        }
    }
}
