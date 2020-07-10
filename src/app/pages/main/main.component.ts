/**
 * 
 * Documentation:
 * -------------
 * Imports data from the json file.
 * Imports CanvasJs from the js file.
 * Iterates the data from the json, mounting the data arrays in the following ways:
 *  - For the first chart, it looks at the combo of day, hour, min to get every singular unrepeated minute. 
 *    It also checks if the difference between minutes is greater than 1 or smaller than 0 and fills the empty minutes consequently.
 *  - For the second one it checks if the item has method, and if not it fills it as 'Invalid'.
 *    It also orders the array by quantity of items, to mount the table in ascendent order and mount the breaks.
 *  - For the third one it just filters by the response code.
 *  - For the forth one it checks if it has a size smaller than 1000B and if the code is 200.
 *    It then group the results into hundreds (if not we ended with lot's of singular values, having no real representation).
 * 
 * Passes the arrays to the functions that render the charts into the given ids. 
 * 
 */

import { Component, OnInit } from '@angular/core';
import * as data from '../../../../data-import/data.json';
import * as CanvasJS from '../../../assets/js/canvasjs.min';

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
    CanvasJS.addColorSet('color_palette', ['#ffa600', '#ff7c43', '#f95d6a', '#d45087', '#a05195', '#665191', '#2f4b7c', '#003f5c']);

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

      let name: string = item['request']['method'] ? item['request']['method'] : 'Invalid';
      let obj_2 = this.data_chart_2.find(o => o.label == name);
      obj_2 ? obj_2.y++ : this.data_chart_2.push({y: 1, label: name});

      let obj_3 = this.data_chart_3.find(o => o.label == item['response_code']);
      obj_3 ? obj_3.y++ : this.data_chart_3.push({y: 1, label: item['response_code']});

      if(item['response_code'] == 200 && item['document_size']<1000) {
        let obj_4 = this.data_chart_4.find(o => o.x > item['document_size']);
        obj_4.y++;
      }
      
    }

    // Chart 1
    let chart_1 = new CanvasJS.Chart('chartContainer1', {
      theme: 'light2',
      colorSet: "color_palette",
      backgroundColor: "transparent",
      animationEnabled: true,
      zoomEnabled: true,
      zoomType: 'xy',
      title: {
        text: 'Requests per minute (avg: ' + (Math.round((this.items.length/this.data_chart_1.length) * 100) / 100) + ')',
        fontSize: 20,
        margin: 35
      },
      data: [{
        lineColor: "#ff7c43",
        type: 'line',
        dataPoints: this.data_chart_1
      }],
      axisY: {
        lineThickness: 1,
        stripLines: [{
          value: this.items.length/this.data_chart_1.length,
          lineDashType: "longDash",
          thickness: 2,
          showOnTop: true,
          color: '#E40071',
          labelFontColor: '#003f5c',
          label: 'Average: ' + (Math.round((this.items.length/this.data_chart_1.length) * 100) / 100)
        }]
      }
    });

    // Chart 2
    this.data_chart_2.sort((a, b) => (a.y > b.y) ? 1 : -1);

    let chart_2_breaks = [];
    for(let [index, curr] of this.data_chart_2.entries()) {
      if(this.data_chart_2[index + 1]) {
        chart_2_breaks.push({
          startValue: curr.y + 50,
          endValue: this.data_chart_2[index + 1].y - 50
        });
      }
    }

    let chart_2 = new CanvasJS.Chart('chartContainer2', {
      theme: 'light2',
      colorSet: "color_palette",
      backgroundColor: "transparent",
      animationEnabled: true,
      title: {
        text: 'Distribution of HTTP methods',
        fontSize: 20,
        margin: 35
      },
      axisY: {
        scaleBreaks: {
          customBreaks: chart_2_breaks
        }
      },
      data: [{
        type: 'column',
        tooltipContent: '{label}: {y}',
        indexLabel: '{y}',
        dataPoints: this.data_chart_2
      }]
    });

    // Chart 3
    let chart_3 = new CanvasJS.Chart('chartContainer3', {
      theme: 'light2',
      colorSet: "color_palette",
      backgroundColor: "transparent",
      animationEnabled: true,
      title: {
        text: 'Distribution of HTTP answer codes',
        fontSize: 20,
        margin: 35
      },
      showInLegend: true,
      legendText: '{label}',
      data: [{
        showInLegend: true,
        legendText: '{label}',
        type: 'pie',
        toolTipContent: '<b>{label}</b>: {y}',
        indexLabel: '{label}: {y}(#percent%)',
        dataPoints: this.data_chart_3
      }]
    });

    // Chart 4
    let chart_4 = new CanvasJS.Chart('chartContainer4', {
      theme: 'light2',
      colorSet: "color_palette",
      backgroundColor: "transparent",
      animationEnabled: true,
      axisY :{
        includeZero:false
      },
      title: {
        text: 'Size of requests with code 200 and size < 1000B',
        fontSize: 20,
        margin: 35
      },
      data: [{
        type: 'spline',
        xValueFormatString: "#B",
        dataPoints: this.data_chart_4,
        lineColor: "#B83491",
      }]
    });

    chart_1.render();
    chart_2.render();
    chart_3.render();
    chart_4.render();
    
  }

}