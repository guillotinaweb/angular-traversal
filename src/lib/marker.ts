import { Injectable } from '@angular/core';

@Injectable()
export abstract class Marker {
  abstract mark(context: any): string|string[];
}
