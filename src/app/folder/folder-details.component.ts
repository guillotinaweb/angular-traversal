import { Component, OnInit } from '@angular/core';
import { Traverser } from '../../../projects/traversal/src/public-api';

@Component({
    selector: 'app-folder-details',
    templateUrl: './folder-details.component.html',
})
export class FolderDetailsComponent implements OnInit {
    public context: any;

    constructor(private traverser: Traverser) {}

    ngOnInit() {
        this.traverser.target.subscribe((target) => {
            this.context = target.context;
        });
    }
}
