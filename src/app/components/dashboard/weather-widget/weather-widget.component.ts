import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { TimeFrame } from "src/app/app.component";
import { WeatherApiService } from "../../../services/weather-api/weather-api.service";

export interface Weather {
  dateString: string;
  temperature: number;
  iconId: string;
}

@Component({
  selector: "app-weather-widget",
  templateUrl: "./weather-widget.component.html",
  styleUrls: ["./weather-widget.component.less"],
})
export class WeatherWidgetComponent implements OnInit {
  @Input() date: Date = null;
  @Input() timeFrame: TimeFrame = TimeFrame.hourly;

  timePeriods: Weather[] = [];

  constructor(private weatherAPIService: WeatherApiService) {}

  ngOnInit() {
    this.weatherAPIService.getDayWeather(this.date).then((res) => {
      this.timePeriods = res;
    });
  }

  ngOnChanges() {
    if (this.timeFrame == TimeFrame.hourly) {
      this.weatherAPIService.getDayWeather(this.date).then((res) => {
        this.timePeriods = res;
      });
    } else if (this.timeFrame == TimeFrame.daily) {
      this.weatherAPIService.getWeekWeather(this.date).then((res) => {
        this.timePeriods = res;
      });
    } else {
      this.timePeriods = [];
    }
  }
}
