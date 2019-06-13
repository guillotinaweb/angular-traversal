import {
  Directive,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { Traverser } from './traverser';
import { Normalizer } from './normalizer';

@Directive({
  selector: ':not(a)[traverseTo]',
  host: {
    '(click)': 'onClick()'
  }
})
export class TraverserButton {
  @Input() traverseTo: string;

  constructor(
    private traverser: Traverser,
  ) {}

  onClick() {
    this.traverser.traverse(this.traverseTo);
    return false;
  }
}

@Directive({
  selector: 'a[traverseTo]',
  host: {
    '(click)': 'onClick()'
  }
})
export class TraverserLink extends TraverserButton implements OnInit {
  @HostBinding() href: string;

  constructor(
    private privateTraverser: Traverser,
    private normalizer: Normalizer,
  ) {
    super(privateTraverser);
  }

  ngOnInit() {
    this.href = this.normalizer.normalize(this.traverseTo);
  }
}
