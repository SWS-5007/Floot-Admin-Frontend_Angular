import { EventEmitter, Injectable } from "@angular/core";
import weatherData from "../../data/weatherData.json";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthService } from "../identity/auth.service";

interface Transaction {
  created: Date;
  product: string;
  price: number;
}

/**
 * Responsible for aggregating the data from the json files
 * Variables are used to store data that will be used by the charts
 */

@Injectable({
  providedIn: "root",
})
export class ProcessDataService {
  tiltTransactions: Transaction[] = [];
  pelicanTransactions: Transaction[] = [];

  times: Date[] = [];
  timeValues: number[] = [];
  earliestTransaction: Date = null;
  latestTransaction: Date = null;

  // Sales for different granularities
  hourlyChartData: any = [];
  dailyChartData: any = [];
  weeklyChartData: any = [];
  monthlyChartData: any = [];
  yearlyChartData: any = [];

  // Average transaction values for different granularities
  avgHourlyChartData: any = [];
  avgDailyChartData: any = [];
  avgWeeklyChartData: any = [];
  avgMonthlyChartData: any = [];
  avgYearlyChartData: any = [];

  // Sales Volume for different granularities
  volumeHourly: any = [];
  volumeDaily: any = [];
  volumeWeekly: any = [];
  volumeMonthly: any = [];
  volumeYearly: any = [];

  hourlyDate: Date[] = [];
  dailyDate: Date[] = [];
  weeklyDate: Date[] = [];
  monthlyDate: Date[] = [];
  yearlyDate: Date[] = [];

  selectedStartDay = null;
  selectedEndDay = null;

  hourlyStartDate = null;
  hourlyEndDate = null;

  weatherData: any = [];

  dataLoaded = new EventEmitter();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadData();
  }

  public async loadData() {
    // Formatting data from json file
    await this.pullTiltData().then((res) => {
      this.tiltTransactions = res.rows.map((x) => {
        return {
          created: new Date(x.created),
          product: x.product,
          price: parseFloat(x.price),
        };
      });
    });

    await this.pullCityData().then((res) => {
      this.pelicanTransactions = res.rows.map((x) => {
        let time = x.time.substring(0, 5);
        return {
          created: new Date(x.date.replace("22:00", time)),
          product: x.itemname,
          price: parseFloat(x.itemprice),
        };
      });

      console.log(this.pelicanTransactions);
    });

    this.weatherData = weatherData.map((x) => {
      return {
        day: x.wc,
        time: x.time,
        wind: parseFloat(x.wind),
        temperature: parseFloat(x.temperature),
        clouds: parseFloat(x.clouds),
        rain: parseFloat(x.rain),
      };
    });

    //Aggregating data to display different granularites
    this.getTimeRange();
    this.aggregateHourly();
    this.generateDailyData();
    this.generateWeeklyData();
    this.generateMonthlyData();
    this.generateYearlyData();
    this.dataLoaded.emit();
  }

  async pullTiltData() {
    try {
      const request: any = await this.http
        .post(environment.api + "/api/get-venue-sales", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 2,
        })
        .toPromise();
      console.log(request.data.payload);
      return request.data.payload;
    } catch (error) {
      console.log(error);
    }
  }

  async pullCityData() {
    try {
      const request: any = await this.http
        .post(environment.api + "/api/get-venue-sales", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 1,
        })
        .toPromise();
      console.log("pulled city data");
      console.log(request.data.payload);
      return request.data.payload;
    } catch (error) {
      console.log(error);
    }
  }

  async getLastTransaction(): Promise<Date> {
    if (this.earliestTransaction == null) {
      await this.loadData();
    }
    return this.earliestTransaction;
  }

  async getFirstTransaction(): Promise<Date> {
    if (!this.latestTransaction) {
      await this.loadData;
    }
    return this.latestTransaction;
  }

  /**
   * Aggregates the data based on hourly time bins
   */
  public aggregateHourly() {
    this.hourlyStartDate = new Date(this.earliestTransaction.toString());
    this.hourlyEndDate = new Date(this.latestTransaction.toString());
    this.hourlyStartDate.setMinutes(0);
    this.hourlyStartDate.setSeconds(0);
    this.hourlyStartDate.setMilliseconds(0);

    this.hourlyEndDate.setMinutes(0);
    this.hourlyEndDate.setSeconds(0);
    this.hourlyEndDate.setMilliseconds(0);

    let hoursElapsed = Math.floor(
      this.millisecondsToHours(
        this.hourlyEndDate.getTime() - this.hourlyStartDate.getTime()
      )
    );
    let currentDate = new Date(this.hourlyStartDate);
    let nextHour = new Date(currentDate);
    nextHour.setHours(nextHour.getHours() + 1);

    for (let hour = 0; hour < hoursElapsed; hour++) {
      let [tiltSales, tiltVolume, tiltAvg] = this.getTimePeriodAggregates(
        currentDate,
        nextHour,
        this.tiltTransactions
      );
      let [pelicanSales, pelicanVolume, pelicanAvg] =
        this.getTimePeriodAggregates(
          currentDate,
          nextHour,
          this.pelicanTransactions
        );

      let dateString = new Date(currentDate).toString();
      dateString = dateString.substring(0, dateString.length - 45);

      this.hourlyChartData.push([dateString, tiltSales, pelicanSales]);
      this.volumeHourly.push([dateString, tiltVolume, pelicanVolume]);
      this.avgHourlyChartData.push([dateString, tiltAvg, pelicanAvg]);
      this.hourlyDate.push(new Date(currentDate.getTime()));

      currentDate.setHours(currentDate.getHours() + 1);
      nextHour.setHours(nextHour.getHours() + 1);
    }
  }

  /**
   * Aggregates the data based on daily time bins
   */
  public generateDailyData() {
    let dailyStartDate = new Date(this.hourlyStartDate.toString());
    let dailyEndDate = new Date(this.hourlyEndDate.toString());

    dailyStartDate.setHours(0);
    dailyEndDate.setHours(0);

    let daysElapsed = Math.floor(
      this.millisecondsToDays(dailyEndDate.getTime() - dailyStartDate.getTime())
    );
    let currentDate = new Date(dailyStartDate);

    let nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);

    for (let day = 0; day < daysElapsed + 1; day++) {
      let [tiltSales, tiltVolume, tiltAvg] = this.getTimePeriodAggregates(
        currentDate,
        nextDay,
        this.tiltTransactions
      );
      let [pelicanSales, pelicanVolume, pelicanAvg] =
        this.getTimePeriodAggregates(
          currentDate,
          nextDay,
          this.pelicanTransactions
        );

      let dateString = new Date(currentDate).toString();
      dateString = dateString.substring(0, dateString.length - 51);

      this.dailyChartData.push([dateString, tiltSales, pelicanSales]);
      this.volumeDaily.push([dateString, tiltVolume, pelicanVolume]);
      this.avgDailyChartData.push([dateString, tiltAvg, pelicanAvg]);
      this.dailyDate.push(new Date(currentDate.getTime()));

      currentDate.setDate(currentDate.getDate() + 1);
      nextDay.setDate(nextDay.getDate() + 1);
    }
  }

  /**
   * Aggregates the data based on weekly time bins
   */
  public generateWeeklyData() {
    let weeklyStartDate = new Date(this.hourlyStartDate.toString());
    let weeklyEndDate = new Date(this.hourlyEndDate.toString());

    weeklyStartDate.setDate(weeklyStartDate.getDate() - weeklyEndDate.getDay());
    weeklyEndDate.setDate(weeklyEndDate.getDate() + 7 - weeklyEndDate.getDay());

    let weeksElapsed = Math.floor(
      this.millisecondsToWeeks(
        weeklyEndDate.getTime() - weeklyStartDate.getTime()
      )
    );
    let currentWeek = new Date(weeklyStartDate);

    let nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);

    for (let week = 0; week < weeksElapsed; week++) {
      let [tiltSales, tiltVolume, tiltAvg] = this.getTimePeriodAggregates(
        currentWeek,
        nextWeek,
        this.tiltTransactions
      );
      let [pelicanSales, pelicanVolume, pelicanAvg] =
        this.getTimePeriodAggregates(
          currentWeek,
          nextWeek,
          this.pelicanTransactions
        );

      let dateString = new Date(currentWeek).toString();
      dateString = dateString.substring(4, dateString.length - 51);

      this.weeklyChartData.push([dateString, tiltSales, pelicanSales]);
      this.volumeWeekly.push([dateString, tiltVolume, pelicanVolume]);
      this.avgWeeklyChartData.push([dateString, tiltAvg, pelicanAvg]);
      this.weeklyDate.push(new Date(currentWeek.getTime()));

      currentWeek.setDate(currentWeek.getDate() + 7);
      nextWeek.setDate(nextWeek.getDate() + 7);
    }
  }

  /**
   * Aggregates the data based on monthly time bins
   */
  public generateMonthlyData() {
    let monthlyStartDate = new Date(this.hourlyStartDate.toString());
    let monthlyEndDate = new Date(this.hourlyEndDate.toString());

    monthlyStartDate.setDate(1);
    monthlyEndDate.setDate(1);

    let monthsElapsed = monthlyEndDate.getMonth() - monthlyStartDate.getMonth();
    let currentMonth = new Date(monthlyStartDate);

    let nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    for (let month = 0; month < monthsElapsed; month++) {
      let [tiltSales, tiltVolume, tiltAvg] = this.getTimePeriodAggregates(
        currentMonth,
        nextMonth,
        this.tiltTransactions
      );
      let [pelicanSales, pelicanVolume, pelicanAvg] =
        this.getTimePeriodAggregates(
          currentMonth,
          nextMonth,
          this.pelicanTransactions
        );

      let dateString = `${currentMonth.toLocaleString("en-US", {
        month: "short",
      })} / ${currentMonth.getFullYear()}`;

      this.monthlyChartData.push([dateString, tiltSales, pelicanSales]);
      this.volumeMonthly.push([dateString, tiltVolume, pelicanVolume]);
      this.avgMonthlyChartData.push([dateString, tiltAvg, pelicanAvg]);
      this.monthlyDate.push(new Date(currentMonth.getTime()));

      currentMonth.setMonth(currentMonth.getMonth() + 1);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
    }
  }

  /**
   * Aggregates the data based on yearly time bins
   */
  public generateYearlyData() {
    let yearlyStartDate = new Date(this.hourlyStartDate);
    let yearlyEndDate = new Date(this.hourlyEndDate);

    yearlyStartDate.setMonth(0);
    yearlyEndDate.setMonth(0);
    yearlyEndDate.setFullYear(yearlyEndDate.getFullYear() + 1);

    let yearsElapsed =
      yearlyEndDate.getFullYear() - yearlyStartDate.getFullYear();
    let currentYear = new Date(yearlyStartDate);

    let nextYear = new Date(currentYear);
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    for (let year = 0; year < yearsElapsed; year++) {
      let [tiltSales, tiltVolume, tiltAvg] = this.getTimePeriodAggregates(
        currentYear,
        nextYear,
        this.tiltTransactions
      );
      let [pelicanSales, pelicanVolume, pelicanAvg] =
        this.getTimePeriodAggregates(
          currentYear,
          nextYear,
          this.pelicanTransactions
        );

      let dateString = `${currentYear.getFullYear()}`;

      this.yearlyChartData.push([dateString, tiltSales, pelicanSales]);
      this.volumeYearly.push([dateString, tiltVolume, pelicanVolume]);
      this.avgYearlyChartData.push([dateString, tiltAvg, pelicanAvg]);
      this.yearlyDate.push(new Date(currentYear.getTime()));

      currentYear.setFullYear(currentYear.getFullYear() + 1);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
    }
  }

  /**
   *
   * @param startDate Duration start date time
   * @param endDate Duration end date time
   * @param transactions List of all transactions
   * @returns sales, number of items sold, averge transaction value of transactions made between the start and end date
   */
  public getTimePeriodAggregates(
    startDate: Date,
    endDate: Date,
    transactions: Transaction[]
  ) {
    let sales = 0;
    let itemsSold = 0;
    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i];
      if (
        transaction.created.getTime() >= startDate.getTime() &&
        transaction.created.getTime() < endDate.getTime()
      ) {
        sales += transaction.price;
        itemsSold += 1;
      }
    }
    let avgTransactionValue = sales / itemsSold;
    return [sales, itemsSold, avgTransactionValue];
  }

  /**
   *
   * @param milliseconds
   * @returns Number of days
   */
  public millisecondsToDays(milliseconds: number): number {
    return milliseconds / 1000 / 60 / 60 / 24;
  }

  /**
   *
   * @param milliseconds
   * @returns Number of Hours
   */
  public millisecondsToHours(milliseconds: number): number {
    return milliseconds / 1000 / 60 / 60;
  }

  /**
   *
   * @param milliseconds
   * @returns Number of Weeks
   */
  public millisecondsToWeeks(milliseconds: number): number {
    return milliseconds / 1000 / 60 / 60 / 24 / 7;
  }

  /**
   * Finds the latest and most recent transactions in the data provided
   */
  public getTimeRange() {
    this.times = this.tiltTransactions.map((x) => x.created);
    this.timeValues = this.times.map((x) => x.getTime());

    let minDateValue = Math.min(...this.timeValues);
    let maxDateValue = Math.max(...this.timeValues);
    this.earliestTransaction =
      this.times[this.timeValues.indexOf(minDateValue)];
    this.latestTransaction = this.times[this.timeValues.indexOf(maxDateValue)];
  }
}
