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

    let curr_date = '';
    let curr_min: number = Number(this.items[0]['datetime']['minute']);
    let mins = 0;    
    
    for(let item of this.items) {

      if(Number(item['datetime']['minute']) - curr_min > 1) {
        for(let i = 0; i<Number(item['datetime']['minute']) - curr_min - 1; i++) {
          mins++;
          this.data_chart_1.push({y: 0, x: mins});
        }
      }

      if(Number(item['datetime']['minute']) - curr_min < 0) {
        for(let j = 0; j<(59 - curr_min + Number(item['datetime']['minute'])); j++) {
          mins++;
          this.data_chart_1.push({y: 0, x: mins});
        }
      }

      if(curr_min !== item['datetime']['minute']) {
        curr_min = item['datetime']['minute'];
      }

      let item_time = item['datetime']['day'] + item['datetime']['hour'] + item['datetime']['minute'];
      
      if(item_time !== curr_date) {
        curr_date = item_time, mins++;
      }

      let obj_1 = this.data_chart_1.find(o => o.x == mins);
      obj_1 ? obj_1.y++ : this.data_chart_1.push({y: 1, x: mins});

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

    console.log(this.data_chart_1);
    
  }

  redistribute(event) {
    console.log(event);
  }

}