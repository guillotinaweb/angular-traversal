import { NgModule } from '@angular/core';

import { FileInfoLazyComponent } from './file-info.component';
import { ViewMapping } from '../../../projects/traversal/src/public-api';

@NgModule({
    imports: [],
    exports: [FileInfoLazyComponent],
    declarations: [FileInfoLazyComponent],
    providers: [],
})
export class FileInfoLazyModule {
    static traverserViews: ViewMapping[] = [{ name: 'lazy-info', components: { file: FileInfoLazyComponent } }];
}
