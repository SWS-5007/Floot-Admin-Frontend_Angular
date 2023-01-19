import { Component, ViewChild, OnInit, EventEmitter, Output } from "@angular/core";
import { TimeFrame } from "src/app/app.component";
import { ChartConfiguration } from "chart.js";

import { SalesDataService } from "src/app/services/sales-data/sales-data.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
};

export type DashTilesData = {
  overheadsPast30: number
  salesPast30: number,
  vatLastMonth: number,
  vatThisMonth: number
};

export type DashTile = {
  name: string,
  value: number,
  class: string
};

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexTooltip,
  ApexLegend,
} from "ng-apexcharts";

import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.less"],
})

export class DashboardComponent implements OnInit {
  constructor(
    private salesDataService: SalesDataService,
  ) { }

  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public lineChartData: ChartConfiguration<"line">["data"] = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: "Series A",
        fill: true,
        tension: 0.5,
        borderColor: "black",
        backgroundColor: "rgba(255,0,0,0.3)",
      },
    ],
  };

  range = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });

  // manualSalesFormdata = new FormGroup({
  //   // date: new FormControl<String | null>(null),
  //   total: new FormControl<String | null>(null),
  //   cash: new FormControl<String | null>(null),
  //   card: new FormControl<String | null>(null),
  //   // passwd: new FormControl("abcd1234")
  // });

  manualSalesFormdata = new FormArray([]);

  selectedDate: Date = null;
  timeFrame: TimeFrame = TimeFrame.daily;

  salesData: any[] = [];
  public yData: any[] = [];
  public xData: any[] = [];

  maxDate: Date = null;
  minDate: Date = null;
  beforeThirtyDays: Date = null;

  salesDates = [];

  dashTiles: DashTile[] = []

  name: string = "";
  // public lineChartOptions: ChartOptions<"line"> = {
  //   responsive: false,
  // };
  public lineChartLegend = true;
  // area chart start
  public areaChartOptions = {
    responsive: true,
    legend: {
      display: false,
      labels: {
        usePointStyle: true,
        fontFamily: "Poppins",
      },
    },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            display: false,
            drawBorder: false,
          },
          scaleLabel: {
            display: false,
            labelString: "Month",
          },
          ticks: {
            fontFamily: "Poppins",
            fontColor: "#9aa0ac", // Font Color
          },
        },
      ],
      yAxes: [
        {
          display: true,
          gridLines: {
            display: true,
            draw1Border: !1,
            lineWidth: 0.5,
            zeroLineColor: "transparent",
            drawBorder: false,
          },
          scaleLabel: {
            display: true,
            labelString: "Value",
            fontFamily: "Poppins",
          },
          ticks: {
            fontFamily: "Poppins",
            fontColor: "#9aa0ac", // Font Color
          },
        },
      ],
    },
    title: {
      display: false,
      text: "Normal Legend",
    },
  };
  areaChartData = [
    {
      label: "Foods",
      data: [0, 105, 190, 140, 270],
      borderWidth: 4,
      pointStyle: "circle",
      pointRadius: 5,
      borderColor: "rgba(154, 156, 157, 1)",
      backgroundColor: "rgba(154, 156, 157, 0.4)",
      pointBackgroundColor: "rgba(154, 156, 157, 1)",
      pointBorderColor: "transparent",
      pointHoverBackgroundColor: "transparent",
      pointHoverBorderColor: "rgba(154, 156, 157,0.8)",
    },
    // {
    //   label: "Electronics",
    //   data: [0, 152, 80, 250, 190],
    //   borderWidth: 4,
    //   pointStyle: "circle",
    //   pointRadius: 5,
    //   borderColor: "rgba(76, 194, 176, 1)",
    //   backgroundColor: "rgba(76, 194, 176, 0.4)",
    //   pointBackgroundColor: "rgba(76, 194, 176, 1)",
    //   pointBorderColor: "transparent",
    //   pointHoverBackgroundColor: "transparent",
    //   pointHoverBorderColor: "rgba(76, 194, 176,0.8)",
    // },
  ];

  areaChartLabels = ["January", "February", "March", "April", "May"];
  // area chart end

  // barChart

  open(arg, name) {
    this.name = name
  }

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      display: true,
      labels: {
        fontColor: "#9aa0ac",
      },
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            fontFamily: "Poppins",
            fontColor: "#9aa0ac", // Font Color
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontFamily: "Poppins",
            fontColor: "#9aa0ac", // Font Color
          },
        },
      ],
    },
  };
  public barChartLabels: string[] = [
    "2001",
    "2002",
    "2003",
    "2004",
    "2005",
    "2006",
    "2007",
  ];
  public barChartType = "bar";
  public barChartLegend = true;

  public barChartData: any[] = [
    { data: [58, 60, 74, 78, 55, 64, 42], label: "Series A" },
    { data: [30, 45, 51, 22, 79, 35, 82], label: "Series B" },
  ];

  public barChartColors: Array<any> = [
    {
      backgroundColor: "rgba(90, 155, 246, 0.8)",
      borderColor: "rgba(90, 155, 246, 1)",
      pointBackgroundColor: "rgba(90, 155, 246, 1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(90, 155, 246, 0.8)",
    },
    {
      backgroundColor: "rgba(174, 174, 174, 0.8)",
      borderColor: "rgba(174, 174, 174, 1)",
      pointBackgroundColor: "rgba(174, 174, 174, 1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(174, 174, 174, 0.8)",
    },
  ];
  // end bar chart

  ngOnInit() {
    "use strict";
    this.chart1();
    this.chart2();
    this.loadSales();
  }

  get manualSaleEveryData() {
    return this.manualSalesFormdata.get("datas") as FormArray;
  }

  onSubmit(data) {
    console.log('$$$$$$%%%%%%%%@@@@@@@@', data)
  }

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
    this.beforeThirtyDays = thirtyDaysBefore;

    this.salesData = await this.salesDataService.getSalesData(
      thirtyDaysBefore,
      this.maxDate,
      TimeFrame.daily
    );

    this.salesDataService.getDashTilesData(this.maxDate).then((res: DashTilesData) => {
      this.dashTiles.push({ name: "Sales - 30 Day", value: res.salesPast30, class: "card1" })
      this.dashTiles.push({ name: "Overheads - 30 Day", value: res.overheadsPast30, class: "card2" })
      this.dashTiles.push({ name: "VAT - Last Month", value: res.vatLastMonth, class: "purple" })
      this.dashTiles.push({ name: "VAT - This Month", value: res.vatThisMonth, class: "orange" })
    });

    this.salesData.forEach((x, i) => {
      if (i > 0) {
        this.yData.push(x[1]);
        this.xData.push(x[0]);
      }
    });
  }

  @Output() changeTimeFrame = new EventEmitter<TimeFrame>();

  async handleChangeTimeFrame(event: TimeFrame, flag: String) {
    switch (flag) {
      case 'hour':
        // this.changeTimeFrame.emit(TimeFrame.hourly);
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
      this.beforeThirtyDays,
      this.maxDate,
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

  // Chart 1
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
    this.chartOptions2 = {
      series: [
        {
          name: "blue",
          data: [
            {
              x: "Team A",
              y: [1, 5],
            },
            {
              x: "Team B",
              y: [4, 6],
            },
            {
              x: "Team C",
              y: [5, 8],
            },
          ],
        },
        {
          name: "green",
          data: [
            {
              x: "Team A",
              y: [2, 6],
            },
            {
              x: "Team B",
              y: [1, 3],
            },
            {
              x: "Team C",
              y: [7, 8],
            },
          ],
        },
      ],
      chart: {
        type: "rangeBar",
        height: 250,
        foreColor: "#9aa0ac",
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: true,
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



  handleDateRange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeEnd.value) {
      this.salesDates = [];
      var startDate = new Date(dateRangeStart.value);
      var endDate = new Date(dateRangeEnd.value);
      var Difference_In_Time = endDate.getTime() - startDate.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      for (let i = Difference_In_Days; i >= 0; i--) {
        const date = new Date(dateRangeEnd.value);
        date.setDate(date.getDate() - i);
        this.salesDates.push(date.toISOString());
      }

      console.log('@@@@@@@@@@@@@@', this.salesDates)
      for (let j = 0; j <= Difference_In_Days; j++) {
        const group = new FormGroup({
          total: new FormControl(''),
          cash: new FormControl(''),
          card: new FormControl('')
        });

        this.manualSalesFormdata.push(group);
      }
      //   manualSalesFormControls.push(
      //     { ['total_' + j]: new FormControl<String | null>(null) },
      //     { ['cash_' + j]: new FormControl<String | null>(null) },
      //     { ['card_' + j]: new FormControl<String | null>(null) },
      //   );
    }
  }

  handleVATDate(vatLastDate: HTMLInputElement) {
    if (vatLastDate.value) {
      console.log('$$$$$$$$$$', vatLastDate.value)
      var vatDate = new Date(vatLastDate.value);

      this.salesDataService.postVatLastDate(vatDate).then(() => {
      });
    }
  }

}
