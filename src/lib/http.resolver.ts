import { Inject, Injectable, OpaqueToken } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Resolver } from './resolver';

// the actual value will be provided by the module
export let BACKEND_BASE_URL = new OpaqueToken('backend.base.url');

@Injectable()
export class BasicHttpResolver extends Resolver {

  constructor(
    private http: Http,
    @Inject(BACKEND_BASE_URL) private backend: string,
  ) {
    super();
  }

  resolve(path: string): Observable<any> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    return this.http.get(this.backend + path, { headers })
      .map(res => res.json());
  }
}
