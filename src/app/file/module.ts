import { NgModule } from '@angular/core';

import { FileDetailsComponent } from './file-details.component';
import { CommonModule } from '@angular/common';
import { ViewMapping } from '../../../projects/traversal/src/public-api';

@NgModule({
    imports: [CommonModule],
    exports: [FileDetailsComponent],
    declarations: [FileDetailsComponent],
})
export class FileDetailsModule {
    static traverserTiles: ViewMapping[] = [{ name: 'details', components: { file: FileDetailsComponent } }];
}
