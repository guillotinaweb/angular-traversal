import { Component } from '@angular/core';
import { Traverser } from 'angular-traversal';
import { FileComponent } from './file/file.component';
import { FolderComponent } from './folder/folder.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(traverser:Traverser) {
    traverser.addView('view', 'file', FileComponent);
    traverser.addView('view', 'dir', FolderComponent);
  }
}
