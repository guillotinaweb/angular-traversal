/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TraversalModule, Traverser } from 'angular-traversal';
import { Resolver } from 'angular-traversal';
import { Marker } from 'angular-traversal';
import { TypeMarker } from './marker';
import { Normalizer } from 'angular-traversal';
import { FullPathNormalizer } from './normalizer';

import { AppComponent } from './app.component';
import { FileComponent } from './file/file.component';
import { FolderComponent } from './folder/folder.component';
import { FileInfoComponent } from './file-info/file-info.component';
import { Target } from '../../../src/lib/interfaces';

@Injectable()
export class FakeResolver1 extends Resolver {

  constructor() {
    super();
  }

  resolve(path: string, view: string, queryString?: string): Observable<any> {
    return Observable.create(observer => {
      observer.next({
        type: 'file',
        name: 'myfile.txt',
        content: '',
      });
    });
  }
}

@Injectable()
export class FakeResolver2 extends Resolver {

  constructor() {
    super();
  }

  resolve(path: string, view: string, queryString?: string): Observable<any> {
    return Observable.create(observer => {
      observer.next({
        type: ['blue', 'file', 'bird'],
        name: 'myfile.txt',
        content: '',
      });
    });
  }
}

describe('Traverser', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FileComponent,
        FolderComponent,
        FileInfoComponent
      ],
      imports: [TraversalModule, FormsModule],
      providers: [
        { provide: Resolver, useClass: FakeResolver1 },
        { provide: Marker, useClass: TypeMarker },
        { provide: Normalizer, useClass: FullPathNormalizer },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    });
  });

  it('should traverse using the current path', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const traverser: Traverser = TestBed.get(Traverser);
    traverser.traverse('/file1');
    traverser.target.subscribe(target => {
      expect(target.path).toBe('/file1');
    });
  }));

  it('should return the context object', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const traverser: Traverser = TestBed.get(Traverser);
    traverser.traverse('/file1');
    traverser.target.subscribe(target => {
      expect(target.context.name).toBe('myfile.txt');
    });
  }));

  it('should use the mentionned view', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const traverser: Traverser = TestBed.get(Traverser);
    traverser.traverse('/file1/@@info');
    traverser.target.subscribe(target => {
      expect(target.view).toBe('info');
      expect(target.component).toBe(FileInfoComponent);
    });
  }));

  it('should use the view component by default', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const traverser: Traverser = TestBed.get(Traverser);
    traverser.traverse('/file1');
    traverser.target.subscribe(target => {
      expect(target.view).toBe('view');
      expect(target.component).toBe(FileComponent);
    });
  }));

  it('should navigate to the requested path', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const traverser: Traverser = TestBed.get(Traverser);
    const location: Location = TestBed.get(Location);
    traverser.traverse('/file1');
    expect(location.path()).toBe('/file1');
  }));

  it('should get queryString at traverse', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const traverser: Traverser = TestBed.get(Traverser);
    traverser.traverse('/file1?format=pdf');
    traverser.target.subscribe((target: Target) => {
      expect(target.path).toBe('/file1?format=pdf');
      expect(target.contextPath).toBe('/file1');
      expect(target.query.get('format')).toBe('pdf');
    });
  }));

});

describe('Marker', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FileComponent,
        FolderComponent,
        FileInfoComponent
      ],
      imports: [TraversalModule, FormsModule],
      providers: [
        { provide: Resolver, useClass: FakeResolver2 },
        { provide: Marker, useClass: TypeMarker },
        { provide: Normalizer, useClass: FullPathNormalizer },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    });
  });

  it('should pick first match if marker returns a list', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const traverser: Traverser = TestBed.get(Traverser);
    traverser.traverse('/file1/@@info');
    traverser.target.subscribe(target => {
      expect(target.view).toBe('info');
      expect(target.component).toBe(FileInfoComponent);
    });
  }));

});
