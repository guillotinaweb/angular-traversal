import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMapping } from '../../../projects/traversal/src/public-api';
import { QueryParametersComponent } from './query-parameters.component';

@NgModule({
    imports: [CommonModule],
    exports: [QueryParametersComponent],
    declarations: [QueryParametersComponent],
    providers: [],
})
export class QueryParametersModule {
    static traverserViews: ViewMapping[] = [
        { name: 'query-parameters', components: { dir: QueryParametersComponent } }
    ];
}
