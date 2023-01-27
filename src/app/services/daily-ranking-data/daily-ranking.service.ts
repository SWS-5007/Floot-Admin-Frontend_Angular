import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DailyRankingService {

  constructor(private http: HttpClient) {}

  public async getDateRange() {
    try{
      const request: any = await this.http.post(environment.apiUrl + "/api/get-top-products-date-range", {
        venueId: 1
      }).toPromise()

      console.log("Get top products date range")
      console.log(request.data.payload.rows[0])
      return request.data.payload.rows[0]
    } catch(error) {
      console.log(error)
    }
  }

  public async getTopProducts(startDay: Date, endDay: Date) {
    try {
      const request: any = await this.http.post(environment.apiUrl + "/api/get-top-products", {
        venueId: 1,
        startDay: startDay.toISOString(),
        endDay: endDay.toISOString()
      }).toPromise();
      
      console.log("Got top products")
      console.log(request.data.payload)
      return request.data.payload.rows.map(x => {return {name: x.name, quantity: parseInt(x.quantity)}})

    } catch(error) {
      console.log(error)
    }
  }
}
