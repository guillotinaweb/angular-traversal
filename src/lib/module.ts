import { NgModule } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { TraverserOutlet } from './traverser.directive';
import { TraverserLink, TraverserButton } from './traverser.link';
import { Traverser } from './traverser';

@NgModule({
  declarations: [
    TraverserOutlet,
    TraverserButton,
    TraverserLink,
  ],
  imports: [
    HttpClientModule,
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    Traverser,
  ],
  exports: [
    TraverserOutlet,
    TraverserButton,
    TraverserLink,
  ]
})
export class TraversalModule {
}
