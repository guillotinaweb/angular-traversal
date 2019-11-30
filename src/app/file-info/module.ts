import { NgModule } from '@angular/core';

import { FileInfoComponent } from './file-info.component';
import { ViewMapping } from '../../../projects/traversal/src/public-api';

@NgModule({
    imports: [],
    exports: [FileInfoComponent],
    declarations: [FileInfoComponent],
    providers: [],
})
export class FileInfoModule {
    static traverserViews: ViewMapping[] = [
        {name: 'info', components: {file: FileInfoComponent}},
    ];
}
