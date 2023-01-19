import {
  Component,
  ElementRef,
  Input,
  SimpleChange,
  ViewChild,
  OnInit,
} from "@angular/core";

@Component({
  selector: "app-area-chart",
  templateUrl: "./area-chart.component.html",
  styleUrls: ["./area-chart.component.less"],
})
export class AreaChartComponent implements OnInit {
  @ViewChild("areaChart") areaChart: ElementRef;

  @Input("data") chartData: any[] = [];
  @Input("options") chartOptions: {};
  @Input("cityView") cityView: boolean = true;

  drawChart = () => {
    let data = google.visualization.arrayToDataTable(this.chartData);
    let view = new google.visualization.DataView(data);
    view.setColumns(this.getColumns());
    let options = this.chartOptions;

    let chart = new google.visualization.AreaChart(
      this.areaChart.nativeElement
    );

    chart.draw(view, options);
  };

  ngOnChanges(changes: SimpleChange) {
    this.drawChart();
  }

  ngOnInit() {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(this.drawChart);
  }

  getColumns() {
    if (this.cityView) {
      return [0, 1, 2];
    } else {
      return [0, 1];
    }
  }
}
