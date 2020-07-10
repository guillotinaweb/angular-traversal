import { Directive, OnInit, OnDestroy, ViewContainerRef, Input, ChangeDetectorRef, ViewRef } from '@angular/core';
import { Traverser } from './traverser';
import { Target } from './interfaces';
import { Subject } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';

@Directive({
    selector: 'traverser-tile',
})
export class TraverserTile implements OnInit, OnDestroy {
    @Input() name?: string;
    @Input() noUpdateOnTraverse = false;
    private viewInstance: any;
    private terminator: Subject<void> = new Subject();

    constructor(private traverser: Traverser, private container: ViewContainerRef, private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        if (!!this.name) {
            if (!this.noUpdateOnTraverse) {
                this.traverser.target
                    .pipe(takeUntil(this.terminator), skip(1))
                    .subscribe((target: Target) => this.traverser.loadTile(this.name as string, target.contextPath));
            }
            const tileContext = this.traverser.tilesContexts[this.name];
            if (!!tileContext) {
                tileContext.pipe(takeUntil(this.terminator)).subscribe((target) => this.render(target));
            }
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
        if (!(this.cdr as ViewRef).destroyed) {
            this.cdr.detectChanges();
        }
    }
}
