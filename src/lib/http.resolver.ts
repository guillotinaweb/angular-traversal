import { Inject, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolver } from './resolver';

// the actual value will be provided by the module
export var BACKEND_BASE_URL: string = '';

@Injectable()
export class BasicHttpResolver extends Resolver {

  constructor(
    private http: Http,
    @Inject(BACKEND_BASE_URL) private backend: string,
  ) {
    super();
  }

  resolve(path: string): Observable<any> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    return this.http.get(this.backend + path, { headers })
      .map(res => res.json());
  }
}