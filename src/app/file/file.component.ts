import { Component, OnInit } from '@angular/core';
import { Traverser } from '../../../projects/traversal/src/public-api';

@Component({
    selector: 'app-file',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

    name?: string;
    code?: string;
    path?: string;

    constructor(private traverser: Traverser) { }

    ngOnInit() {
        this.traverser.target.subscribe(target => {
            const context = target.context;
            this.name = context.name;
            try {
                this.code = atob(context.content);
            } catch {
                // bad format
            }
            this.path = target.path.split('?')[0];
        });
    }

}
