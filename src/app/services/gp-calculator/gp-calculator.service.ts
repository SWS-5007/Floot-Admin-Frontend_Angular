import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import Ingredient from "../../interfaces/ingredient.interface";
import { AuthService } from "../identity/auth.service";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  public async postProduct(product: object) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/", {
          product,
        })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  public async getProducts(venue_id: number) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-products", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venue_id,
        })
        .toPromise();
      console.log("request is:", request);
      return request.payload;
    } catch (error) {
      console.log(error);
    }
  }

  public async getingredients(venueId: number) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-ingredients", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId,
        })
        .toPromise();
      console.log("request is:", request);
      return request.payload;
    } catch (error) {
      console.log(error);
    }
  }

  public async updateProduct(
    productChanges: object,
    ingredientChanges: object
  ) {
    try {
      const request: any = await this.http
        .put(environment.apiUrl + "/api/update-product", {
          productChanges,
          ingredientChanges,
        })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteProduct(
    productIdToDelete: any,
    ingredientsToDelete: any[]
  ) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/delete-product", {
          productIdToDelete,
          ingredientsToDelete,
        })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  public async createProduct(
    ingredientsToCreate: object,
    productToCreate: object
  ) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/create-product", {
          productToCreate,
          ingredientsToCreate,
        })
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  public async fetchProducts() {
    try {
      const request: any = await this.http
        .get(environment.apiUrl + "/api/test-api-connection", {})
        .toPromise();
      // console.log("request is:", request)
      // return(request.payload)
    } catch (error) {
      console.log(error);
    }
  }
}
