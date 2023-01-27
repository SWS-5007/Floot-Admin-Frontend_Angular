import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { filter } from "rxjs";
import { TimeFrame } from "src/app/app.component";
import { ProcessDataService } from "../dataProcess/process-data.service";
import { environment } from "src/environments/environment";
import { start } from "@popperjs/core";
import { AuthService } from "../identity/auth.service";

@Injectable({
  providedIn: "root",
})
export class SalesDataService {
  times: {} = {};
  chartDetails: {} = {};

  constructor(
    private processDataService: ProcessDataService,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getSalesChartData(date: Date, timeFrame: TimeFrame) {
    let startDate = new Date(date.getTime());
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    startDate.setHours(0);

    let endDate = null;
    let expectedDataPoints = 0;

    if (timeFrame == TimeFrame.hourly) {
      startDate.setHours(16);

      endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 10);
      expectedDataPoints = 10;
    } else if (timeFrame == TimeFrame.daily) {
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
      expectedDataPoints = 7;
    } else if (timeFrame == TimeFrame.weekly) {
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 8 * 7);
      expectedDataPoints = 8;
    } else if (timeFrame == TimeFrame.monthly) {
      startDate.setDate(1);
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 6);
      expectedDataPoints = 6;
    } else {
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 5);
      expectedDataPoints = 5;
    }
    return this.filterRawData(
      timeFrame,
      startDate,
      endDate,
      expectedDataPoints
    );
  }

  loadData() {
    this.times[TimeFrame.hourly] = this.processDataService.hourlyDate;
    this.times[TimeFrame.daily] = this.processDataService.dailyDate;
    this.times[TimeFrame.weekly] = this.processDataService.weeklyDate;
    this.times[TimeFrame.monthly] = this.processDataService.monthlyDate;
    this.times[TimeFrame.yearly] = this.processDataService.yearlyDate;

    this.chartDetails[TimeFrame.hourly] =
      this.processDataService.hourlyChartData;
    this.chartDetails[TimeFrame.daily] = this.processDataService.dailyChartData;
    (this.chartDetails[TimeFrame.weekly] =
      this.processDataService.weeklyChartData),
      (this.chartDetails[TimeFrame.monthly] =
        this.processDataService.monthlyChartData);
    this.chartDetails[TimeFrame.yearly] =
      this.processDataService.yearlyChartData;
  }

  filterRawData(
    chosenTimeFrame: TimeFrame,
    startDate: Date,
    endDate: Date,
    expectedDataPoints: number
  ) {
    let filteredData: any[] = [["Date", "Tilt", "City Avg"]];
    for (let i = 0; i < this.chartDetails[chosenTimeFrame].length; i++) {
      let transactionDate = this.times[chosenTimeFrame][i];
      if (
        transactionDate.getTime() >= startDate.getTime() &&
        transactionDate.getTime() < endDate.getTime()
      ) {
        filteredData.push(this.chartDetails[chosenTimeFrame][i]);
      }
    }

    if (
      expectedDataPoints != 0 &&
      filteredData.length != expectedDataPoints + 1
    ) {
      let date = new Date(
        this.times[chosenTimeFrame][this.times[chosenTimeFrame].length - 1]
      );
      let additions = expectedDataPoints - filteredData.length + 1;
      for (let i = 0; i < additions; i++) {
        date = this.timeFrameIncrement(date, chosenTimeFrame);
        let dateString = new Date(date).toString();
        if (chosenTimeFrame == TimeFrame.hourly) {
          dateString = dateString.substring(0, dateString.length - 45);
        } else {
          dateString = dateString.substring(0, dateString.length - 51);
        }
        filteredData.push([dateString, 0, 0]);
      }
    }
    console.log(filteredData);
    return filteredData;
  }

  timeFrameIncrement(date: Date, timeFrame: TimeFrame) {
    switch (timeFrame) {
      case TimeFrame.hourly:
        return new Date(date.setHours(date.getHours() + 1));
      case TimeFrame.daily:
        return new Date(date.setDate(date.getDate() + 1));
      case TimeFrame.weekly:
        return new Date(date.setDate(date.getDate() + 7));
      case TimeFrame.monthly:
        return new Date(date.setMonth(date.getMonth() + 1));
      case TimeFrame.yearly:
        return new Date(date.setFullYear(date.getFullYear() + 1));
      default:
        return new Date();
    }
  }

  async getSalesData(startDate: Date, endDate: Date, timeFrame: TimeFrame) {
    switch (timeFrame) {
      case TimeFrame.hourly:
        return await this.loadHourlySales(startDate, endDate);
      case TimeFrame.daily:
        return await this.loadDailySales(startDate, endDate);
      case TimeFrame.weekly:
        return await this.loadWeeklySales(startDate, endDate);
      case TimeFrame.monthly:
        return await this.loadMonthlySales(startDate, endDate);
      case TimeFrame.yearly:
        return await this.loadYearlySales(startDate, endDate);
      default:
        return [];
    }
  }

  async loadHourlySales(startDate: Date, endDate) {
    startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
    endDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-hourly-sales", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 1,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        })
        .toPromise();

      console.log("loaded hourly sales");
      console.log(request.data.payload);

      let data = request.data.payload.rows.map((x) => [x.hour, x.sales]);
      data.unshift(["Hour", "Sales"]);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async loadDailySales(startDate: Date, endDate: Date) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-daily-sales", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 1,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        })
        .toPromise();

      console.log("loaded sales");
      console.log(request.data.payload);
      let data = request.data.payload.rows.map((x) => [x.day, x.sales]);
      data.unshift(["Day", "Sales"]);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async loadWeeklySales(startDate: Date, endDate: Date) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-weekly-sales", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 1,
          startWeek: startDate.toISOString(),
          endWeek: endDate.toISOString(),
        })
        .toPromise();

      console.log("loaded sales");
      console.log(request.data.payload);
      let data = request.data.payload.rows.map((x) => [x.week, x.sales]);
      data.unshift(["Week", "sales"]);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async loadMonthlySales(startDate: Date, endDate: Date) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-monthly-sales", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 1,
          startMonth: startDate.toISOString(),
          endMonth: endDate.toISOString(),
        })
        .toPromise();

      console.log("loaded sales");
      console.log(request.data.payload);
      let data = request.data.payload.rows.map((x) => [x.month, x.sales]);
      data.unshift(["Month", "Sales"]);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async loadYearlySales(startDate: Date, endDate: Date) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-yearly-sales", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 1,
          startYear: startDate.toISOString(),
          endYear: endDate.toISOString(),
        })
        .toPromise();

      console.log("loaded sales");
      console.log(request.data.payload);
      let data = request.data.payload.rows.map((x) => [x.year, x.sales]);
      data.unshift(["Year", "Sales"]);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getDateRange() {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-sales-date-range", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 1,
        })
        .toPromise();

      console.log("Get sales date range");
      console.log(request.data.payload.rows[0]);
      return request.data.payload.rows[0];
    } catch (error) {
      console.log(error);
    }
  }

  async getAVGDaySales(day: Date) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-avg-day-sales", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 1,
          day: day.toISOString(),
        })
        .toPromise();

      console.log("get Avg day sales");
      console.log(request.data.payload);

      return request.data.payload.rows[0];
    } catch (error) {
      console.log(error);
    }
  }

  async getDashTilesData(day: Date) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-dash-tiles", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 1,
          day: day.toISOString(),
        })
        .toPromise();
      return request.payload;
    } catch (error) {
      console.log(error)
    }
  }

  async getGrowthValues(day: Date) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-growth-values", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 1,
          day: day.toISOString()
        })
        .toPromise();

      console.log("Get growth values")
      console.log(day)
      console.log(request.data.payload);

      return request.data.payload
    } catch (error) {
      console.log(error)
    }
  }

  async postVatLastDate(day: Date) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/save-vat-liability-date", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 1,
          day: day.toISOString(),
        })
        .toPromise();
      console.log('$$$$$$$$$$', request.payload)
      return request.payload;
    } catch (error) {
      console.log(error)
    }
  }

  async getManualDailySales(startDate, endDate) {
    const request: any = await this.http
      .get(environment.apiUrl + "/api/get-manual-daily", {
      
      })
      .toPromise();
    console.log('$$$$$$$$$$', request.payload)
  }
}