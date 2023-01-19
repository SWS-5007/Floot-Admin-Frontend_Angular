import { Component, OnInit, ViewChild } from "@angular/core";
import { TimeFrame } from "src/app/app.component";
import { ProcessDataService } from "src/app/services/dataProcess/process-data.service";
import { SalesDataService } from "src/app/services/sales-data/sales-data.service";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexYAxis,
} from "ng-apexcharts";
import { resolveSoa } from "dns";
import { MatDialog } from "@angular/material/dialog";
import { SalesEntryModalComponent } from "../modals/sales-entry-modal/sales-entry-modal.component";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

export type DashTilesData = {
  overheadsPast30: number
  salesPast30: number,
  vatLastMonth: number,
  vatThisMonth: number
}

export type DashTile = {
  name: string, 
  value: number,
  class: string
}

export type GrowthData = {
  weekly: number,
  monthly: number, 
  yearly: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  // readonly tileClasses = ['card1', 'card2', 'purple', 'orange']
  public chartOptions: Partial<ChartOptions>;
  selectedDate: Date = null;
  timeFrame: TimeFrame = TimeFrame.daily;

  salesData: any[] = [];
  public yData: any[] = [];
  public xData: any[] = [];
  cityView = false;

  maxDate: Date = null;
  minDate: Date = null;

  salesOptions: {} = {
    vAxis: { minValue: 0, viewWindow: { min: 0 } },
    backgroundColor: "#f9f9fb",
    width: "100%",
    height: "100%",
    chartArea: { left: 50, top: 20, right: 90, bottom: 60 },
  };

  totalSales = 0;
  avgSales = 0;
  growth = 0;

  dashTiles: DashTile[] = []

  growthDisplay: GrowthData = {
    weekly: null,
    monthly: null,
    yearly: null,
  };

  growthData: GrowthData = {
    weekly: null,
    monthly: null,
    yearly: null,
  }

  constructor(
    // private processDataService: ProcessDataService,
    private salesDataService: SalesDataService,
    private dialog: MatDialog
  ) {}
  // public generateData(baseval, count, yrange) {
  //   var i = 0;
  //   var series = [];
  //   while (i < count) {
  //     var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
  //     var y =
  //       Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
  //     var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

  //     series.push([x, y, z]);
  //     baseval += 86400000;
  //     i++;
  //   }
  //   return series;
  // }
  async loadSales() {
    await this.salesDataService.getDateRange().then((res) => {
      this.maxDate = new Date(res.max);
      this.minDate = new Date(res.min);
      this.selectedDate = new Date(this.maxDate);
      this.selectedDate.setHours(0);
      this.selectedDate.setMinutes(
        this.selectedDate.getMinutes() - this.selectedDate.getTimezoneOffset()
      );
    });

    let thirtyDaysBefore: Date = new Date(this.maxDate)
    thirtyDaysBefore.setDate(this.maxDate.getDate() - 30)
    
    this.salesData = await this.salesDataService.getSalesData(
      thirtyDaysBefore,
      this.maxDate,
      TimeFrame.daily
    );

    this.salesDataService.getDashTilesData(this.maxDate).then((res: DashTilesData) => {
      console.log(res)
      this.dashTiles.push({ name: "Sales - 30 Day", value: res.salesPast30, class: "card1" })
      this.dashTiles.push({ name: "Overheads - 30 Day", value: res.overheadsPast30, class: "card2" })
      this.dashTiles.push({ name: "VAT - Last Month", value: res.vatLastMonth, class: "purple" })
      this.dashTiles.push({ name: "VAT - This Month", value: res.vatThisMonth, class: "orange" })
    })

    this.salesDataService.getGrowthValues(this.maxDate).then((res: GrowthData) => {
      this.growthData = res;
      console.log(this.growthData)

      if(this.growthData.weekly < 1) {
        this.growthDisplay.weekly = Math.round((1 - this.growthData.weekly) * 100)
      } else {
        this.growthDisplay.weekly = Math.round((this.growthData.weekly - 1) * 100)
      }

      if(this.growthData.monthly < 1) {
        this.growthDisplay.monthly = Math.round((1 - this.growthData.monthly) * 100)
      } else {
        this.growthDisplay.monthly = Math.round((this.growthData.monthly - 1) * 100)
      }

      if(this.growthData.yearly < 1) {
        this.growthDisplay.yearly = Math.round((1 - this.growthData.yearly) * 100)
      } else {
        this.growthDisplay.yearly = Math.round((this.growthData.yearly - 1) * 100)
      }

      console.log(this.growthDisplay)
      console.log(this.growthData)
    })


    // this.chartOptions.series[0].data = this.salesData;

    this.salesData.forEach((x, i) => {
      if (i > 0) {
        this.yData.push(x[1]);
        this.xData.push(x[0]);
      }
    });

    //this.chartOptions.series[0].data = yData;
    //this.chartOptions.xaxis.categories = xData;
    console.log("this.salesDatathis.salesData", this.chartOptions);

    for (let i = 1; i < this.salesData.length; i++) {
      this.totalSales += this.salesData[i][1];
    }

    let res = await this.salesDataService.getAVGDaySales(this.selectedDate);
    this.avgSales = parseFloat(res.avg);

    this.growth = this.totalSales / this.avgSales;
    this.chartDisplay();
  }

  // async changeDay(event: any) {
  //   this.selectedDate = event.value;
  //   this.selectedDate.setMinutes(
  //     this.selectedDate.getMinutes() - this.selectedDate.getTimezoneOffset()
  //   );
  //   this.salesData = await this.salesDataService.getSalesData(
  //     this.selectedDate,
  //     this.timeFrame
  //   );
  //   this.yData = [];
  //   this.xData = [];
  //   this.salesData.forEach((x, i) => {
  //     if (i > 0) {
  //       this.yData.push(x[1]);
  //       this.xData.push(x[0]);
  //     }
  //   });
  //   this.chartDisplay();
  // }

  // async changeTimeFrame(event: TimeFrame) {
  //   this.timeFrame = event;
  //   this.salesData = await this.salesDataService.getSalesData(
  //     this.selectedDate,
  //     this.timeFrame
  //   );
  //   this.yData = [];
  //   this.xData = [];
  //   this.salesData.forEach((x, i) => {
  //     if (i > 0) {
  //       this.yData.push(x[1]);
  //       this.xData.push(x[0]);
  //     }
  //   });

  //   this.chartDisplay();
  // }

  onManualEntry(){
    const dialog = this.dialog.open(SalesEntryModalComponent, {
      data: null
    })

    dialog.afterClosed().subscribe(result => {
      if(result){
        console.log(result);
      }
    })
  }

  toggleCityView() {
    // this.cityView = !this.cityView
  }

  ngOnInit(): void {
    this.loadSales();
  }

  chartDisplay() {
    console.log(this.yData);
    this.chartOptions = {
      series: [
        {
          data: this.yData,
        },
      ],
      chart: {
        height: 425,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: this.xData,
        
      },
    };
    console.log(this.chartOptions.series);
  }
}
