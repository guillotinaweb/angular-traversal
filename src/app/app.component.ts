import { Component } from '@angular/core';
import { Traverser } from '../../projects/traversal/src/public-api';
import { FileComponent } from './file/file.component';
import { FileInfoComponent } from './file-info/file-info.component';
import { FolderComponent } from './folder/folder.component';
import { FolderDetailsComponent } from './folder/folder-details.component';
import { FileDetailsComponent } from './file/file-details.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public repository = 'guillotinaweb/angular-traversal';

  constructor(traverser: Traverser) {
    traverser.addView('view', 'file', FileComponent);
    traverser.addLazyView('info', 'file', () => import('./file-info/module').then(m => m.FileInfoModule));
    traverser.addView('view', 'dir', FolderComponent);
    traverser.addLazyTile('details', 'file', () => import('./file/module').then(m => m.FileDetailsModule));
    traverser.addTile('details', 'dir', FolderDetailsComponent);
  }
}
