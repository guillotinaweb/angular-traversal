import { Component, OnInit, OnDestroy } from '@angular/core';
import { Traverser } from '../../../projects/traversal/src/public-api';
import { Subject, throwError } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

@Component({
    selector: 'app-query-parameters',
    templateUrl: './query-parameters.component.html',
    styleUrls: ['./query-parameters.component.css'],
})
export class QueryParametersComponent implements OnInit, OnDestroy {
    context: any;
    lock = false;
    terminator: Subject<void> = new Subject();
    parameters: { [key: string]: string | string [] } = {};
    parameterKeys: string[] = [];

    constructor(private traverser: Traverser) {}

    ngOnInit() {
        this.traverser
            .getQueryParams()
            .subscribe(data => {
                console.log('Query parameters', data);
                this.parameters = data;
                this.parameterKeys = Object.keys(data);
            });
    }

    toggleLock() {
        this.lock = !this.lock;
    }

    ngOnDestroy() {
        this.terminator.next();
    }
}
