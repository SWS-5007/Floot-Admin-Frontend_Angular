import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class OverheadsService {
  suppliers = {};

  constructor(private http: HttpClient) {}

  async getOverheads(month: number, year: number) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-overheads", {
          venueId: 1,
          month: month,
          year: year,
        })
        .toPromise();
      console.log(request.data.payload);
      return request.data.payload.map((x) => {
        return { id: x.id, name: x.name, overhead: parseFloat(x.overhead), perc_diff: x.perc_diff ? parseFloat(x.perc_diff): 0 };
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

  async getInvoiceList(month: Date) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-invoice-list", {
          venueId: 1,
          month: month.toISOString()
        })
        .toPromise()
      
      console.log(request)
      let formattedInvoiceData = request.map((x) => {return {
        id: x.id, 
        date: new Date(x.date),
        total: parseFloat(x.total),
        supplier_id: x.supplier_id,
        supplier_name: x.supplier_name,
        paid: x.paid ? x.paid : false 
      }})
      return formattedInvoiceData
    } catch (error) {
      console.log("failed to get invoice list: ", error)
    }
  }
}
