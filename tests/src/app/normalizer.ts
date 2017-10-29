import { Injectable } from '@angular/core';
import { Normalizer } from 'angular-traversal';

@Injectable()
export class FullPathNormalizer extends Normalizer {
  normalize(path): string {
    if (path.startsWith('https://api.github.com/repos')) {
      return path.slice(28);
    } else {
      return path;
    }
  }
}
