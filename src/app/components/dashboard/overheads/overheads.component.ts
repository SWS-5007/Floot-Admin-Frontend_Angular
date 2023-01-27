import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { start } from "@popperjs/core";
import { ProcessDataService } from "src/app/services/dataProcess/process-data.service";
import { OverheadsService } from "src/app/services/overheads/overheads.service";
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexTitleSubtitle,
  ApexPlotOptions,
} from "ng-apexcharts";
import { MatDialog } from "@angular/material/dialog";
import { CompareSuppliersModalComponent } from "../modals/compare-suppliers-modal/compare-suppliers-modal.component";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';


import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';

const moment: any = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export type Invoice = {
  id: number,
  date: Date,
  total: number,
  supplier_id: number,
  supplier_name: string, 
  paid: boolean,
}


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions,
};

@Component({
  selector: 'app-overheads',
  templateUrl: './overheads.component.html',
  styleUrls: ['./overheads.component.less'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class OverheadsComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  totalOverheads: number = 0;
  selectedSupplierId: number = null;

  invoices: Invoice[] = []

  suppliers: any[] = [];

  suppliersSearch: {} = {};
  activeButton = 0;
  chartData: any[] = [];
  yData: any[] = [];
  xData: any[] = [];
  maxDate: Date = null;
  minDate: Date = null;
  compareSupplier: boolean = false;

  chartBasicColor: any[] = ['#008ffb', '#00e396', '#feb019', '#ff4560', '#775dd0',];
  chartColorArray = [];

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  date = new FormControl(moment())

  constructor(
    private overheadsService: OverheadsService,
    private processDataService: ProcessDataService,
    private dialog: MatDialog,
  ) { }

  async setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    console.log("date chang: ", this.date.value._d)
    console.log("month: ", this.date.value._d.getMonth())
    console.log("year: ", this.date.value._d.getFullYear())
    const month: number = this.date.value._d.getMonth() + 1
    const year: number = this.date.value._d.getFullYear()

    this.loadSupplierData(month, year)
    this.loadInvoiceList(this.date.value._d)
  }

  async loadInvoiceList(month: Date) {
    this.invoices = await this.overheadsService.getInvoiceList(month);

  }

  downloadInvoice(invoiceId: number) {

  }

  

  loadChart() {
    console.log("xdata, ", this.xData)
    var totalOverheadsValue = this.totalOverheads.toFixed(2);
    this.chartOptions = {
      series: this.yData,
      chart: {
        width: 600,
        type: "donut",
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: false,
          zoomedArea: {
            fill: {
              color: "#90CAF9",
              opacity: 0.4,
            },
            stroke: {
              color: "#0D47A1",
              opacity: 0.4,
              width: 1,
            },
          },
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                formatter: () => `£ ${totalOverheadsValue}`,
                fontSize: '25px',
                color: '#000000',
              },
              value: {
                show: true,
                formatter: () => 'Total Overheads',
                fontSize: '20px',
                color: '#442a6e',
              },
              total: {
                show: true,
                showAlways: true,
                fontSize: '25px',
                color: '#000000',
                label: `£ ${totalOverheadsValue}`,
                formatter: () => 'Total Overheads',
              }
            }
          }
        }
      },
      labels: this.xData,

      // title: {
      //   text: `£ ${this.totalOverheads}`,
      //   // align: "center",
      //   // margin: 30,
      //   offsetX: 190,
      //   offsetY: 250,
      //   style: {
      //     fontSize: '25px',
      //   }
      // },
      // subtitle: {
      //   text: 'Total Overheads',
      //   // align: "center",
      //   // margin: 30,
      //   offsetX: 190,
      //   offsetY: 290,
      //   style: {
      //     fontSize: '20px',
      //   }
      // },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
    };
  }

  async loadData() {
    await this.overheadsService.getDateRange().then((res) => {
      this.maxDate = new Date(res.max);
      this.minDate = new Date(res.min);
    });

    // Show you the currents months overheads
    let endDay = new Date(this.maxDate);
    endDay.setDate(endDay.getDate() + 1);
    endDay.setHours(0);
    endDay.setMinutes(0);
    endDay.setSeconds(0);
    endDay.setMilliseconds(0);

    let startMonth = new Date(this.maxDate);
    startMonth.setDate(0);
    startMonth.setHours(0);
    startMonth.setMinutes(0);
    startMonth.setSeconds(0);
    startMonth.setMilliseconds(0);

    if (this.minDate.getTime() > startMonth.getTime()) {
      startMonth = this.minDate;
    }

    this.loadSupplierData(startMonth.getMonth() + 1, startMonth.getFullYear());

    this.dateRange = new FormGroup({
      start: new FormControl(new Date(startMonth)),
      end: new FormControl(new Date(this.maxDate)),
    });

    this.loadChart();
  }

  setSelectedSupplier(supplierId: number) {
    this.activeButton = supplierId;
    this.selectedSupplierId = supplierId;
  }

  loadSupplierData(day: number, month: number) {
    this.overheadsService.getOverheads(day, month).then((res) => {
      console.log("query res: ", res)
      this.suppliers = res;
      this.suppliersSearch = this.suppliers.reduce(
        (obj, item) =>
          Object.assign(obj, {
            [item.id]: { name: item.name, overhead: item.overhead },
          }),
        {}
      );

      this.activeButton = this.selectedSupplierId = this.suppliers[0].id;

      this.totalOverheads = this.suppliers.reduce(
        (total, current) => (total += current.overhead),
        0
      );

      this.formatChartData();
    });
  }

  formatChartData() {
    this.chartData = this.suppliers.reduce(
      (prev: any[], item) => {
        if (item.overhead >= 0) {
          prev.push([item.name, item.overhead]);
        }
        return prev;
      },
      [["Supplier", "Overhead"]]
    );
    this.yData = [];
    this.xData = [];
    this.chartData.forEach((x, i) => {
      if (i > 0) {
        this.yData.push(x[1]);
        this.xData.push(x[0]);
      }
    });

    this.chartColorArray = [];
    var chartDataCounts = this.chartData.length * 1 - 1;

    for (let i = 0; i < chartDataCounts; i++) {
      var index = i % this.chartBasicColor.length;
      this.chartColorArray.push(this.chartBasicColor[index]);
    }

    this.loadChart();
  }

  // changeDateRange() {
  //   let endDay = new Date(this.dateRange.value.end);
  //   endDay.setDate(endDay.getDate() + 1);

  //   this.loadSupplierData(this.dateRange.value.start, endDay);
  //   this.loadChart();
  // }

  // handleDateRange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
  //   if (dateRangeEnd.value) {
  //     var startDate = new Date(dateRangeStart.value);
  //     var endDate = new Date(dateRangeEnd.value);

  //     this.dateRange = new FormGroup({
  //       start: new FormControl(new Date(startDate)),
  //       end: new FormControl(new Date(endDate)),
  //     });


  //     this.loadSupplierData(startDate, endDate);
  //     this.loadChart();
  //   }
  // }


  ngOnInit() {
    this.loadData();
  }

  onToggleChange({checked}: MatSlideToggleChange){
    if(!checked) return;
    const dialog = this.dialog.open(CompareSuppliersModalComponent, {
      width: '300px'
    });

    dialog.afterClosed().subscribe((result) => {
      if(!result){
        this.compareSupplier = false;
        return;
      }
      // compare suppliers api call
    })
  }

}
