import { Injectable } from '@angular/core';
import { Marker } from 'angular-traversal';

@Injectable()
export class TypeMarker extends Marker {
  mark(context: any): string {
    // if the GitHub API returns an array, the context is a directroy, else
    // we just return the type property
    if (context instanceof Array) {
      return 'dir';
    } else {
      return context.type;
    }
  }
}
