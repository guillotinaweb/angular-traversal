import { NgModule } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';

import { TraverserOutlet } from './traverser.directive';
import { TraverserLink } from './traverser.link';
import { Traverser } from './traverser';

@NgModule({
  declarations: [
    TraverserOutlet,
    TraverserLink,
  ],
  imports: [
    HttpModule,
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    Traverser,
  ],
  exports: [
    TraverserOutlet,
    TraverserLink,
  ]
})
export class TraversalModule {
}
