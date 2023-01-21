import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { start } from "@popperjs/core";
import { ProcessDataService } from "src/app/services/dataProcess/process-data.service";
import { OverheadsService } from "src/app/services/overheads/overheads.service";
import { ChartComponent } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
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

  totalOverheads: number = 0;
  selectedSupplierId: number = null;

  suppliers: any[] = [];

  suppliersSearch: {} = {};
  activeButton = 0;
  chartData: any[] = [];
  yData: any[] = [];
  xData: any[] = [];
  maxDate: Date = null;
  minDate: Date = null;

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private overheadsService: OverheadsService,
    private processDataService: ProcessDataService
  ) { }

  loadChart() {
    this.chartOptions = {
      series: this.yData,
      chart: {
        width: 700,
        type: "donut"
      },
      labels: this.xData,
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

    this.loadSupplierData(startMonth, endDay);

    this.dateRange = new FormGroup({
      start: new FormControl(new Date(startMonth)),
      end: new FormControl(new Date(this.maxDate)),
    });
  }

  setSelectedSupplier(supplierId: number) {
    this.activeButton = supplierId;
    this.selectedSupplierId = supplierId;
  }

  loadSupplierData(startDay: Date, endDay: Date) {
    this.overheadsService.getOverheads(startDay, endDay).then((res) => {
      this.suppliers = res;
      this.suppliersSearch = this.suppliers.reduce(
        (obj, item) =>
          Object.assign(obj, {
            [item.id]: { name: item.name, overhead: item.overhead },
          }),
        {}
      );

      this.formatChartData();
      this.activeButton = this.selectedSupplierId = this.suppliers[0].id;

      this.totalOverheads = this.suppliers.reduce(
        (total, current) => (total += current.overhead),
        0
      );
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
    this.loadChart();
  }

  changeDateRange() {
    let endDay = new Date(this.dateRange.value.end);
    endDay.setDate(endDay.getDate() + 1);

    this.loadSupplierData(this.dateRange.value.start, endDay);
    this.loadChart();
  }

  handleDateRange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    if (dateRangeEnd.value) {
      var startDate = new Date(dateRangeStart.value);
      var endDate = new Date(dateRangeEnd.value);

      this.dateRange = new FormGroup({
        start: new FormControl(new Date(startDate)),
        end: new FormControl(new Date(endDate)),
      });


      this.loadSupplierData(startDate, endDate);
      this.loadChart();
    }
  }


  ngOnInit() {
    this.loadData();
    this.loadChart();
  }

  ngOnChanges() { }
}
