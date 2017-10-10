import { Injectable } from '@angular/core';

@Injectable()
export class Normalizer {
  normalize(path: string): string {
    return path;
  }
}
