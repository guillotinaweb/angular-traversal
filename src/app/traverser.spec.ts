import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { skip } from 'rxjs/operators';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    Marker,
    Normalizer,
    Resolver,
    Target,
    TraversalModule,
    Traverser,
} from '../../projects/traversal/src/public-api';
import { TypeMarker } from './marker';
import { FullPathNormalizer } from './normalizer';

import { AppComponent } from './app.component';
import { FileComponent } from './file/file.component';
import { FolderComponent } from './folder/folder.component';
import { FileDetailsComponent } from './file/file-details.component';
import { FileInfoComponent } from './file-info/file-info.component';

@Injectable()
export class FakeResolver1 extends Resolver {
    constructor() {
        super();
    }

    resolve(path: string, view: string, queryString?: string): Observable<any> {
        return new Observable((observer) => {
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
        return new Observable((observer) => {
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
    declarations: [AppComponent, FileComponent, FolderComponent, FileInfoComponent],
    imports: [TraversalModule, FormsModule],
    providers: [
        { provide: Resolver, useClass: FakeResolver1 },
        { provide: Marker, useClass: TypeMarker },
        { provide: Normalizer, useClass: FullPathNormalizer },
        { provide: APP_BASE_HREF, useValue: '/' },
    ],
    teardown: { destroyAfterEach: false }
});
    });

    it('should traverse using the current path', async(() => {
        const traverser: Traverser = TestBed.inject(Traverser);
        traverser.traverse('/file1');
        traverser.target.pipe(skip(1)).subscribe((target) => {
            expect(target.path).toBe('/file1');
        });
    }));

    it('should return the context object', async(() => {
        const traverser: Traverser = TestBed.inject(Traverser);
        traverser.traverse('/file1');
        traverser.target.pipe(skip(1)).subscribe((target) => {
            expect(target.context.name).toBe('myfile.txt');
        });
    }));

    it('should use the mentionned view', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const traverser: Traverser = TestBed.inject(Traverser);
        traverser.traverse('/file1/@@info');
        traverser.target.pipe(skip(1)).subscribe((target) => {
            expect(target.view).toBe('info');
            expect(target.component).toBe(FileInfoComponent);
        });
    }));

    it('should set context in tile', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const traverser: Traverser = TestBed.inject(Traverser);
        traverser.loadTile('details', '/file1');
        traverser.tilesContexts.details.pipe(skip(1)).subscribe((target) => {
            expect(target.context.name).toEqual('myfile.txt');
            expect(target.component).toBe(FileDetailsComponent);
        });
    }));

    it('should use the view component by default', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const traverser: Traverser = TestBed.inject(Traverser);
        traverser.traverse('/file1');
        traverser.target.pipe(skip(1)).subscribe((target) => {
            expect(target.view).toBe('view');
            expect(target.component).toBe(FileComponent);
        });
    }));

    it('should navigate to the requested path', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const traverser: Traverser = TestBed.inject(Traverser);
        const location: Location = TestBed.inject(Location);
        traverser.traverse('/file1');
        expect(location.path()).toBe('/file1');
    }));

    // target.query is a HttpParams object - see https://angular.io/api/common/http/HttpParams
    it('should get queryString at traverse', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const traverser: Traverser = TestBed.inject(Traverser);
        traverser.traverse('/file1?format=pdf');
        traverser.target.pipe(skip(1)).subscribe((target: Target) => {
            expect(target.path).toBe('/file1?format=pdf');
            expect(target.contextPath).toBe('/file1');
            expect(!!target.query && target.query.get('format')).toBe('pdf');
        });
    }));

    it('should get multiple queryString items at traverse', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const traverser: Traverser = TestBed.inject(Traverser);
        traverser.traverse('/file1?format=pdf&mykey=test');
        traverser.target.pipe(skip(1)).subscribe((target: Target) => {
            expect(target.path).toBe('/file1?format=pdf&mykey=test');
            expect(target.contextPath).toBe('/file1');
            expect(!!target.query && target.query.get('format')).toBe('pdf');
            expect(!!target.query && target.query.get('mykey')).toBe('test');
            expect(!!target.query && target.query.toString()).toBe('format=pdf&mykey=test');
        });
    }));

    it('should get multiple queryString items with the same key (list items) at traverse', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const traverser: Traverser = TestBed.inject(Traverser);
        traverser.traverse('/file1?formats=pdf&formats=doc');
        traverser.target.pipe(skip(1)).subscribe((target: Target) => {
            expect(target.path).toBe('/file1?formats=pdf&formats=doc');
            expect(target.contextPath).toBe('/file1');
            // get the first value for param
            expect(!!target.query && target.query.get('formats')).toBe('pdf');
            // get all values for param
            expect(!!target.query && target.query.getAll('formats')).toEqual(['pdf', 'doc']);
            expect(!!target.query && target.query.toString()).toBe('formats=pdf&formats=doc');
        });
    }));
});

describe('Marker', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
    declarations: [AppComponent, FileComponent, FolderComponent, FileInfoComponent],
    imports: [TraversalModule, FormsModule],
    providers: [
        { provide: Resolver, useClass: FakeResolver2 },
        { provide: Marker, useClass: TypeMarker },
        { provide: Normalizer, useClass: FullPathNormalizer },
        { provide: APP_BASE_HREF, useValue: '/' },
    ],
    teardown: { destroyAfterEach: false }
});
    });

    it('should pick first match if marker returns a list', async(() => {
        const traverser: Traverser = TestBed.inject(Traverser);
        traverser.traverse('/file1/@@info');
        traverser.target.pipe(skip(1)).subscribe((target) => {
            expect(target.view).toBe('info');
            expect(target.component).toBe(FileInfoComponent);
        });
    }));
});
