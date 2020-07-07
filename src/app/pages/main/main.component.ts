import { Component, OnInit } from '@angular/core';
import * as data from '../../../../data-import/data.json';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  items: any = (data as any).default;

  data_chart_1 = [];
  data_chart_2 = [];
  data_chart_3 = [];
  data_chart_4 = [
    {x: 100, y: 0},
    {x: 200, y: 0},
    {x: 300, y: 0},
    {x: 400, y: 0},
    {x: 500, y: 0},
    {x: 600, y: 0},
    {x: 700, y: 0},
    {x: 800, y: 0},
    {x: 900, y: 0},
    {x: 1000, y: 0}
  ];

  constructor() { }

  ngOnInit() {
    console.log(data);
    
    for(let item of this.items) {

      let label: string = item['request']['method'] ? item['request']['method'] : 'Invalid';
      let obj_2 = this.data_chart_2.find(o => o.label == label);
      obj_2 ? obj_2.y++ : this.data_chart_2.push({y: 1, label: label});

      let obj_3 = this.data_chart_3.find(o => o.label == item['response_code']);
      obj_3 ? obj_3.y++ : this.data_chart_3.push({y: 1, label: item['response_code']});

      if(item['response_code'] == 200 && item['document_size']<1000) {
        let obj_4 = this.data_chart_4.find(o => o.x > item['document_size']);
        obj_4.y++;
      }
      
    }
    
  }

}
