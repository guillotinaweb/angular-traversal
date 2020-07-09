import { Component, OnInit } from '@angular/core';
import { Traverser } from '../../../projects/traversal/src/public-api';
import { DetailService } from '../service';

@Component({
    selector: 'app-folder',
    templateUrl: './folder.component.html',
    styleUrls: ['./folder.component.css'],
})
export class FolderComponent implements OnInit {
    public context: any;

    constructor(private traverser: Traverser, private service: DetailService) {}

    ngOnInit() {
        this.traverser.target.subscribe((target) => {
            this.context = target.context;
        });
    }

    openDetail(path: string) {
        this.service.showDetail = true;
        this.traverser.loadTile('details', path);
    }
}
