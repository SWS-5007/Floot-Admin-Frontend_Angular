import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import Ingredient from "../../interfaces/ingredient.interface";

@Injectable({
  providedIn: "root",
})
export class ProductMarginTrackerService {
  constructor(private http: HttpClient) {}

  public async getProductTrackerData(venue_id: number) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-product-tracker-data", {
          venue_id,
        })
        .toPromise();
      console.log("request is:", request);
      return request.payload;
    } catch (error) {
      console.log(error);
    }
  }

  // public async postProduct(product: object) {
  //   try {
  //     const request: any = await this.http.post(environment.api + '/api/', {
  //       product
  //     }).toPromise();
  //   } catch(error) {
  //     console.log(error);
  //   }
  // }

  // public async getProducts(venue_id: number) {
  //   try {
  //     const request: any = await this.http.post(environment.api + '/api/get-products', {
  //       venue_id
  //     }).toPromise();
  //     console.log("request is:", request)
  //     return(request.payload)
  //   } catch(error) {
  //     console.log(error);
  //   }
  // }

  // public async getingredients(venue_id: number) {
  //   try {
  //     const request: any = await this.http.post(environment.api + '/api/get-ingredients', {
  //       venue_id
  //     }).toPromise();
  //     console.log("request is:", request)
  //     return(request.payload)
  //   } catch(error) {
  //     console.log(error);
  //   }
  // }

  // public async updateProduct(productChanges: object, ingredientChanges: object) {
  //   try {
  //     const request: any = await this.http.put(environment.api + '/api/update-product', {
  //       productChanges,
  //       ingredientChanges
  //     }).toPromise();
  //   } catch(error) {
  //     console.log(error);
  //   }
  // }

  // public async deleteProduct(productIdToDelete: any, ingredientIdsToDelete: any[]) {
  //   try {
  //     const request: any = await this.http.post(environment.api + '/api/delete-product', {
  //       productIdToDelete,
  //       ingredientIdsToDelete
  //     }).toPromise();
  //   } catch(error) {
  //     console.log(error);
  //   }
  // }

  // public async createProduct(ingredientsToCreate: object, productToCreate: object) {
  //   try {
  //     const request: any = await this.http.post(environment.api + '/api/create-product', {
  //       productToCreate,
  //       ingredientsToCreate
  //     }).toPromise();
  //   } catch(error) {
  //     console.log(error);
  //   }
  // }

  // public async fetchProducts () {
  //   try {
  //     const request: any = await this.http.get(environment.api + '/api/test-api-connection', {

  //     }).toPromise();
  //     // console.log("request is:", request)
  //     // return(request.payload)
  //   } catch(error) {
  //     console.log(error);
  //   }
  // }
}
