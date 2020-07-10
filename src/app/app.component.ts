import { Component } from '@angular/core';
import { Traverser } from '../../projects/traversal/src/public-api';
import { FileComponent } from './file/file.component';
import { FolderComponent } from './folder/folder.component';
import { FolderDetailsComponent } from './folder/folder-details.component';
import { FileInfoComponent } from './file-info/file-info.component';
import { take } from 'rxjs/operators';
import { DetailService } from './service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    public repository = 'guillotinaweb/angular-traversal';

    constructor(private traverser: Traverser, public service: DetailService) {
        traverser.addView('view', 'file', FileComponent);
        traverser.addView('info', 'file', FileInfoComponent);
        traverser.addLazyView('lazyinfo', 'file', () =>
            import('./file-info-lazy/module').then((m) => m.FileInfoLazyModule)
        );
        traverser.addView('view', 'dir', FolderComponent);
        traverser.addLazyTile('details', 'file', () => import('./file/module').then((m) => m.FileDetailsModule));
        traverser.addTile('details', 'dir', FolderDetailsComponent);
    }

    openCurrentDetail() {
        this.traverser.loadTile('details', '.');
    }

    toggleDetail() {
        this.service.showDetail = !this.service.showDetail;
        if (this.service.showDetail) {
            this.traverser.loadTile('details', '.');
        }
    }
}
