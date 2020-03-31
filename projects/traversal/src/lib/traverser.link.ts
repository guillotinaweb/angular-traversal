import {
    Directive,
    HostBinding,
    Input,
    OnInit,
    Optional,
    Inject,
    HostListener,
} from '@angular/core';
import { Traverser, NAVIGATION_PREFIX } from './traverser';
import { Normalizer } from './normalizer';

@Directive({
    selector: ':not(a)[traverseTo]',
})
export class TraverserButton {
    @Input() traverseTo?: string;

    constructor(
        private traverser: Traverser,
    ) { }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        event.preventDefault();
        if (!!this.traverseTo) {
            this.traverser.traverse(this.traverseTo);
        }
    }
}

@Directive({
    selector: 'a[traverseTo]',
})
export class TraverserLink extends TraverserButton implements OnInit {
    @HostBinding() href?: string;
    private prefix: string;

    constructor(
        private privateTraverser: Traverser,
        private normalizer: Normalizer,
        @Optional() @Inject(NAVIGATION_PREFIX) prefix: string,
    ) {
        super(privateTraverser);
        this.prefix = prefix || '';
    }

    ngOnInit() {
        if (!!this.traverseTo) {
            this.href = this.prefix + this.normalizer.normalize(this.privateTraverser.getFullPath(this.traverseTo));
        }
    }
}
