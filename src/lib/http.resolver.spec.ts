/* tslint:disable:no-unused-variable */

import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { Resolver } from './resolver';
import { BasicHttpResolver, BACKEND_BASE_URL } from './http.resolver';


describe('BasicHttpResolver', () => {

  let resolver: Resolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Resolver, useClass: BasicHttpResolver },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: BACKEND_BASE_URL, useValue: 'http://fake/backend' },
      ]
    });

    resolver = TestBed.get(Resolver);

  });

  it('should make a get request to the configured backend url',
     inject([HttpClient, HttpTestingController],
     (http: HttpClient, httpMock: HttpTestingController) => {

    // fake response
    const response = {
      'dummykey': 'dummyvalue',
    };

    const view = '';

    resolver
      .resolve('/data', view)
      .subscribe(data => expect(data['dummykey']).toEqual('dummyvalue'));

    const req = httpMock.expectOne('http://fake/backend/data');
    req.flush(response);
    httpMock.verify();

  }));


});
