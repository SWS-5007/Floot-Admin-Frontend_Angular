import { HttpClient } from "@angular/common/http";
import { SafeKeyedRead } from "@angular/compiler";
import { Injectable } from "@angular/core";
// import { ConsoleReporter } from 'jasmine';
import { Weather } from "../../components/dashboard/weather-widget/weather-widget.component";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class WeatherApiService {
  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  constructor(private http: HttpClient) {}

  test() {
    console.log("test");
    let day = new Date();
    day.setMonth(9);
    day.setDate(1);
    day.setHours(19);
    day.setMinutes(0);
    day.setSeconds(0);
    day.setMilliseconds(0);
    console.log(day);
    this.getWeather(day);
  }

  /**
   * Gets temperature and weather icon for a specific timestamp
   * @param date time stamp at which weather data will be retrived
   * @returns temperature and weather icon in an object
   */
  public async getWeather(date: Date) {
    // let url = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=52.953225&lon=-1.148004&units=metric&dt=${Math.round(date.getTime()/1000)}&appid=739907587ad902579d0f94a67c440076`;
    // return fetch(url)
    // .then(response => response.json())
    // .then((data) => {
    //   return {temperature: data.data[0].temp, iconId: data.data[0].weather[0].icon}
    // })

    let dateString = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}:${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-day-weather", {
          date: dateString,
        })
        .toPromise();

      console.log(request);
      return request.data.payload.rows;
    } catch (error) {
      console.log(error);
    }
  }

  //Gets Weather for each day at 7pm

  /**
   * Gets the temperature at 7pm for everyeday in a 7 day span starting at @param startDate
   * @param startDate Start day for the week to be displayed
   * @returns day of the week, temperature, and icon id for every day
   */
  public async getWeekWeather(startDate: Date): Promise<Weather[]> {
    // return [
    //   {dateString: "Monday", temperature: 18, iconId: "01d"},
    //   {dateString: "Tuesday", temperature: 18, iconId: "01d"},
    //   {dateString: "Wednesday", temperature: 18, iconId: "01d"},
    //   {dateString: "Thursday", temperature: 18, iconId: "01d"},
    //   {dateString: "Friday", temperature: 18, iconId: "01d"},
    //   {dateString: "Saterday", temperature: 18, iconId: "01d"},
    //   {dateString: "Sunday", temperature: 18, iconId: "01d"},
    // ];
    let day = new Date(startDate.getTime());
    day.setHours(19);
    let weekdata = [];
    for (let i = 0; i < 7; i++) {
      let temperature = null;
      let iconId = null;
      await this.getWeather(day).then((res) => {
        temperature = parseFloat(res[0].temp_c);
        iconId = res[0].owm_icon_id;
      });
      weekdata.push({
        dateString: this.days[day.getDay()],
        temperature: Math.round(temperature),
        iconId: iconId,
      });
      day.setDate(day.getDate() + 1);
    }
    console.log(weekdata);
    return weekdata;
  }

  public async getDayWeather(day: Date): Promise<Weather[]> {
    return [];
    let time = new Date(day);
    time.setMinutes(0);
    time.setHours(16);
    let dayData = [];
    for (let i = 0; i < 10; i++) {
      let temperature = null;
      let iconId = null;
      await this.getWeather(time).then((res) => {
        temperature = res.temperature;
        iconId = res.iconId;
      });
      dayData.push({
        dateString: time.toTimeString().substring(0, 5),
        temperature: Math.round(temperature),
        iconId: iconId,
      });
      time.setHours(time.getHours() + 1);
    }
    return dayData;
  }
}
