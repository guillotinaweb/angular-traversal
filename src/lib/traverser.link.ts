import {
  Directive,
  Input,
} from '@angular/core';
import { Traverser } from './traverser';

@Directive({
  selector: '*[traverseTo]',
  host: {
    '(click)': 'onClick()'
  }
})
export class TraverserLink {
  @Input() traverseTo: string;

  constructor(
    private traverser: Traverser,
  ) {}

  onClick(): void {
    this.traverser.traverse(this.traverseTo);
  }
}