import { Component, OnInit } from '@angular/core';
import { Traverser } from '../../../projects/traversal/src/public-api';

@Component({
    selector: 'app-file-details',
    templateUrl: './file-details.component.html',
})
export class FileDetailsComponent implements OnInit {

    public context: any;

    constructor(private traverser: Traverser) { }

    ngOnInit() {
        const tileContext = this.traverser.tilesContexts.details;
        if (!!tileContext) {
            tileContext.subscribe(target => {
                this.context = target.context;
            });
        }
    }
}
