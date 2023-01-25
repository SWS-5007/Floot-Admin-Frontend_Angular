import { Component, OnInit, ViewChild } from "@angular/core";
import { TimeFrame } from "src/app/app.component";
import { ProcessDataService } from "src/app/services/dataProcess/process-data.service";
import { SalesDataService } from "src/app/services/sales-data/sales-data.service";
import { FormGroup, FormControl } from '@angular/forms';


import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexGrid,
  ApexMarkers,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexTooltip,
  ApexStroke,
  ApexYAxis,
} from "ng-apexcharts";
import { MatDialog } from "@angular/material/dialog";
import { SalesEntryModalComponent } from "../modals/sales-entry-modal/sales-entry-modal.component";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  markers: ApexMarkers;
  legend: ApexLegend;
  colors: string[];
  grid: ApexGrid;
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
export type ChartOptions1 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};
export type GrowthData = {
  weekly: number,
  monthly: number,
  yearly: number
}

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.less"],
})
export class SalesComponent implements OnInit {
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  // readonly tileClasses = ['card1', 'card2', 'purple', 'orange']
  public chartOptions: Partial<ChartOptions>;
  public ChartOptions1: Partial<ChartOptions>;
  timeFrame: TimeFrame = TimeFrame.hourly;

  salesData: any[] = [];
  public yData: any[] = [];
  public xData: any[] = [];

  cityView = false;

  salesDates = [];

  maxDate: Date = null;
  minDate: Date = null;

  rangeStartDate: Date = null;
  rangeEndDate: Date = null;

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
  name: string = "";
  range = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });
  open(arg, name) {
    this.name = name
  }


  constructor(public dialog: MatDialog, public salesDataService: SalesDataService) {
    this.ChartOptions1 = {
      series: [
        {
          name: "basic",
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [
          "South Korea",
          "Canada",
          "United Kingdom",
          "Netherlands",
          "Italy",
          "France",
          "Japan",
          "United States",
          "China",
          "Germany"
        ]
      }
    };
  }
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
      console.log(res)
      this.maxDate = new Date();
      this.minDate = new Date();
      this.range.value.startDate = new Date();
      console.log(this.range.value.startDate.getTimezoneOffset())
      this.range.value.startDate.setHours(0);
      this.range.value.startDate.setMinutes(
        this.range.value.startDate.getMinutes() - this.range.value.startDate.getTimezoneOffset()
      );
    });
    this.salesData = await this.salesDataService.getSalesData(
      this.range.value.startDate,
      this.range.value.endDate,
      this.timeFrame
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

      if (this.growthData.weekly < 1) {
        this.growthDisplay.weekly = Math.round((1 - this.growthData.weekly) * 100)
      } else {
        this.growthDisplay.weekly = Math.round((this.growthData.weekly - 1) * 100)
      }

      if (this.growthData.monthly < 1) {
        this.growthDisplay.monthly = Math.round((1 - this.growthData.monthly) * 100)
      } else {
        this.growthDisplay.monthly = Math.round((this.growthData.monthly - 1) * 100)
      }

      if (this.growthData.yearly < 1) {
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

    let res = await this.salesDataService.getAVGDaySales(this.range.value.startDate);
    this.avgSales = parseFloat(res.avg);

    this.growth = this.totalSales / this.avgSales;
    // this.chart1();
  }

  onManualEntry() {
    const dialog = this.dialog.open(SalesEntryModalComponent, {
      data: null
    })

    dialog.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    })
  }

  toggleCityView() {
    // this.cityView = !this.cityView
  }
  single: any[];
  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = false;
  shoDataLabel: boolean = true;
  xAxisLabel: string = 'Population';

  colorScheme = {
    domain: ['#45b6fe', '#3792cb', '#296d98', '#1c4966']
  };
  ngOnInit(): void {
    // this.chart1();
    // this.chart2();
    this.loadSales();
  }

  async handleDateRange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeEnd.value) {
      this.rangeStartDate = new Date(dateRangeStart.value);
      this.rangeEndDate = new Date(dateRangeEnd.value);

      this.salesData = await this.salesDataService.getSalesData(
        this.rangeStartDate,
        this.rangeEndDate,
        this.timeFrame
      );
      this.yData = [];
      this.xData = [];
      this.salesData.forEach((x, i) => {
        if (i > 0) {
          this.yData.push(x[1]);
          this.xData.push(x[0]);
        }
      });
      console.log(this.salesData)
      this.chart1();
    }
  }

  async handleChangeTimeFrame(event: TimeFrame, flag: String) {
    switch (flag) {
      case 'hour':
        this.timeFrame = TimeFrame.hourly;
        break;
      case 'day':
        this.timeFrame = TimeFrame.daily;
        break;
      case 'week':
        this.timeFrame = TimeFrame.weekly;
        break;
      case 'month':
        this.timeFrame = TimeFrame.monthly;
        break;
      case 'year':
        this.timeFrame = TimeFrame.yearly;
        break;
      default:
        break;
    }

    this.salesData = await this.salesDataService.getSalesData(
      this.rangeStartDate,
      this.rangeEndDate,
      this.timeFrame
    );
    this.yData = [];
    this.xData = [];
    this.salesData.forEach((x, i) => {
      if (i > 0) {
        this.yData.push(x[1]);
        this.xData.push(x[0]);
      }
    });

    this.chart1();
  }

  private chart1() {
    this.chartOptions = {
      series: [
        {
          name: "High - 2013",
          data: this.yData,
        },
        // {
        //   name: "Low - 2013",
        //   data: [12, 25, 14, 18, 27, 13, 21],
        // },
      ],
      chart: {
        height: 350,
        type: "line",
        foreColor: "#9aa0ac",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#9F78FF", "#858585"],
      stroke: {
        curve: "smooth",
      },
      grid: {
        borderColor: "rgba(216, 216, 216, 0.30)",
        row: {
          colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      markers: {
        size: 3,
      },
      xaxis: {
        categories: this.xData,
        title: {
          text: "Month",
        },
      },
      yaxis: {
        min: 5,
        max: 40,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
      tooltip: {
        theme: "dark",
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  // Chart 2
  private chart2() {
    // this.chartOptions2 = {
    //   series: [
    //     {
    //       name: "blue",
    //       data: [
    //         {
    //           x: "Team A",
    //           y: [1, 5],
    //         },
    //         {
    //           x: "Team B",
    //           y: [4, 6],
    //         },
    //         {
    //           x: "Team C",
    //           y: [5, 8],
    //         },
    //       ],
    //     },
    //     {
    //       name: "green",
    //       data: [
    //         {
    //           x: "Team A",
    //           y: [2, 6],
    //         },
    //         {
    //           x: "Team B",
    //           y: [1, 3],
    //         },
    //         {
    //           x: "Team C",
    //           y: [7, 8],
    //         },
    //       ],
    //     },
    //   ],
    //   chart: {
    //     type: "rangeBar",
    //     height: 250,
    //     foreColor: "#9aa0ac",
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //     },
    //   },
    //   dataLabels: {
    //     enabled: true,
    //   },
    //   tooltip: {
    //     theme: "dark",
    //     marker: {
    //       show: true,
    //     },
    //     x: {
    //       show: true,
    //     },
    //   },

    // };
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
