import { Component, OnInit } from '@angular/core';
import data from '../../../../data-import/data.json';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log(data);
  }

}
