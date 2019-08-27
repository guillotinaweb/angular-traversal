import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { TraverserOutlet } from './traverser.directive';
import { TraverserLink, TraverserButton } from './traverser.link';

@NgModule({
    declarations: [
        TraverserOutlet,
        TraverserButton,
        TraverserLink,
    ],
    imports: [
        HttpClientModule,
    ],
    exports: [
        TraverserOutlet,
        TraverserButton,
        TraverserLink,
    ],
})
export class TraversalModule {}
