import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Resolver } from './resolver';

// the actual value will be provided by the module
export let BACKEND_BASE_URL = new InjectionToken('backend.base.url');

@Injectable()
export class BasicHttpResolver extends Resolver {

  constructor(
    private http: HttpClient,
    @Inject(BACKEND_BASE_URL) private backend: string,
  ) {
    super();
  }

  resolve(path: string, view: string, queryString?: string): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    return this.http.get(this.backend + path, { headers });
  }
}
