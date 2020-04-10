import { Component, OnInit } from '@angular/core';
import { Traverser } from '../../../projects/traversal/src/public-api';

@Component({
  selector: 'app-file-info-lazy',
  templateUrl: './file-info.component.html',
  styleUrls: ['./file-info.component.css']
})
export class FileInfoLazyComponent implements OnInit {

  public context: any;

  constructor(private traverser: Traverser) { }

  ngOnInit() {
    this.traverser.target.subscribe(target => {
      this.context = target.context;
    });
  }

}
