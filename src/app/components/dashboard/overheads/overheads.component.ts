import { Component, OnInit ,ViewChild} from '@angular/core';
import { ChartComponent } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
@Component({
  selector: 'app-overheads',
  templateUrl: './overheads.component.html',
  styleUrls: ['./overheads.component.less']
})
export class OverheadsComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor() { 
        this.chartOptions = {
          series: [27.2, 24.1, 18.5, 18.2, 16.5, 15.9],
          chart: {
            width: 700,
            type: "donut"
          },
          labels: ["Pilgrim Foodservice 27.2%", "Kater Four (Cash And Carry)", "Jens Brincker", "Mark Hay", "John Deo", "Stevie Supplies"],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 100
                },
                // legend: {
                //   position: "bottom"
                // }
              }
            }
          ]
        };
  
  }

  ngOnInit(): void {
  }

}
