import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../identity/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CsvUploadService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
    ) { }

  public async uploadCSV(selectedCSV) {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/upload-csv", {
          token: this.authService.getAuthenticationState().authenticationToken,
          venueId: 1,
          csv: selectedCSV
        })
        .toPromise();

        console.log("Upload file")
        console.log(request)

    } catch (error) {
      console.log(error);
    }
  }

}
