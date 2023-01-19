import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class OverheadsService {
  suppliers = {};

  constructor(private http: HttpClient) {}

  async getOverheads(startDay: Date, endDay: Date) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-overheads", {
          venueId: 1,
          startDay: startDay.toISOString(),
          endDay: endDay.toISOString(),
        })
        .toPromise();

      console.log("sucess");
      console.log(request.data.payload);
      return request.data.payload.rows.map((x) => {
        return { id: x.id, name: x.name, overhead: parseFloat(x.overhead) };
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getDateRange() {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-invoice-date-range", {
          venueId: 1,
        })
        .toPromise();

      console.log("Get invoices date range");
      console.log(request.data.payload.rows[0]);
      return request.data.payload.rows[0];
    } catch (error) {
      console.log(error);
    }
  }
}
