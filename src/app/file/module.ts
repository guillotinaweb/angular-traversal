import { NgModule } from '@angular/core';

import { FileDetailsComponent } from './file-details.component';
import { CommonModule } from '@angular/common';
import { ViewMapping } from 'traversal//lib';

@NgModule({
    imports: [CommonModule],
    exports: [FileDetailsComponent],
    declarations: [FileDetailsComponent],
})
export class FileDetailsModule {
    static traverserTiles: ViewMapping[] = [
        {name: 'details', components: {file: FileDetailsComponent}},
    ];
}
