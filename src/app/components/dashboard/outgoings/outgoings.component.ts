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
  selector: "app-outgoings",
  templateUrl: "./outgoings.component.html",
  styleUrls: ["./outgoings.component.less"],
})
export class OutgoingsComponent implements OnInit {
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

  // chartOptions = {
  //   title: "Supplier Overheads",
  //   width: "100%",
  //   height: "100%",
  //   chartArea: { left: 0, top: 0, right: 0, bottom: 0 },
  // };

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private overheadsService: OverheadsService,
    private processDataService: ProcessDataService
  ) {}

  loadChart() {
    this.chartOptions = {
      series: this.yData,
      
      chart: {
        width: 800,
        type: "pie",
        events: {
          click(event, chartContext, config) {
            console.log(config.config);
            console.log(config.dataPointIndex);
            //this.getStates(config.dataPointIndex);
            // var test: number = config.dataPointIndex;
            // console.log(config.globals.labels[test]);
            // this.getStates(test);
          },

        },
        
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
      labels: this.xData,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: "bottom",
            },
          },
        },
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
    this.overheadsService.getOverheads(1, 2022).then((res) => {
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

  ngOnInit() {
    this.loadData();
    this.loadChart();
  }

  ngOnChanges() {}
}
