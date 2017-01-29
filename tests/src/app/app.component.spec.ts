/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdlModule } from 'angular2-mdl';
import { TraversalModule } from 'angular-traversal';
import { Resolver } from 'angular-traversal';
import { Marker } from 'angular-traversal';
import { TypeMarker } from './marker';

import { AppComponent } from './app.component';

@Injectable()
export class FakeResolver extends Resolver {

  constructor() {
    super();
  }

  resolve(path: string): Observable<any> {
    return Observable.create(observer => {
      observer.onNext({
        type: 'file',
        name: 'myfile.txt',
        content: '',
      });
      observer.onCompleted();
    })
  }
}

describe('AppComponent', () => {
  it('should be a better test', async(() => {
    expect(1).toBe(1);
  }));
});
