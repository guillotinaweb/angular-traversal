import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Normalizer {
    normalize(path: string): string {
        return path;
    }
}
