import { Component } from '@angular/core';
import { Traverser } from '../../projects/traversal/src/public-api';
import { FileComponent } from './file/file.component';
import { FolderComponent } from './folder/folder.component';
import { FolderDetailsComponent } from './folder/folder-details.component';
import { FileInfoComponent } from './file-info/file-info.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public repository = 'guillotinaweb/angular-traversal';

  constructor(traverser: Traverser) {
    traverser.addView('view', 'file', FileComponent);
    traverser.addView('info', 'file', FileInfoComponent);
    traverser.addLazyView('lazy-info', 'file', () => import('./file-info-lazy/module').then(m => m.FileInfoLazyModule));
    traverser.addView('view', 'dir', FolderComponent);
    traverser.addLazyTile('details', 'file', () => import('./file/module').then(m => m.FileDetailsModule));
    traverser.addTile('details', 'dir', FolderDetailsComponent);
  }
}
