import { Component, OnInit } from '@angular/core';
import { Traverser } from '../../dist';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  public name: string;
  public code: string;
  public path: string;

  constructor(private traverser: Traverser) { }

  ngOnInit() {
    this.traverser.target.subscribe(target => {
      let context = target.context;
      this.name = context.name;
      this.code = atob(context.content);
      this.path = target.path.split('?')[0];
    });
  }

}
