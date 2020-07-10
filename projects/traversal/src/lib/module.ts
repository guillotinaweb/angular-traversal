import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { TraverserOutlet } from './traverser.directive';
import { TraverserLink, TraverserButton } from './traverser.link';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TraverserTile } from './tile.directive';

@NgModule({
    declarations: [TraverserOutlet, TraverserButton, TraverserLink, TraverserTile],
    imports: [HttpClientModule],
    exports: [TraverserOutlet, TraverserButton, TraverserLink, TraverserTile],
    providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class TraversalModule {}
