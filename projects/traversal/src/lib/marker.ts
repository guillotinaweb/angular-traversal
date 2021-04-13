import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export abstract class Marker {
    abstract mark(context: any): string | string[];
}
