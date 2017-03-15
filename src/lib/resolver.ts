import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export abstract class Resolver {
  abstract resolve(path: string, view: string): Observable<any>;
}