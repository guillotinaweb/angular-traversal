import { Component, OnInit, OnDestroy } from '@angular/core';
import { Traverser } from '../../../projects/traversal/src/public-api';
import { Subject, throwError } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
    selector: 'app-file-info-lazy',
    templateUrl: './file-info.component.html',
    styleUrls: ['./file-info.component.css']
})
export class FileInfoLazyComponent implements OnInit, OnDestroy {

    context: any;
    lock = false;
    terminator: Subject<void> = new Subject();

    constructor(private traverser: Traverser) { }

    ngOnInit() {
        this.traverser.target.subscribe(target => {
            this.context = target.context;
        });
        this.traverser.beforeTraverse.pipe(takeUntil(this.terminator)).subscribe(([ok, path]) => {
            if (this.lock) {
                console.log('Sorry, navigation is locked');
            }
            ok.next(!this.lock);
        });
    }

    toggleLock() {
        this.lock = !this.lock;
    }

    ngOnDestroy() {
        this.terminator.next();
    }
}
