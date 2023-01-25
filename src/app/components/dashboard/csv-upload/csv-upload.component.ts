import { Component, OnInit } from '@angular/core';
import { CsvUploadService } from 'src/app/services/csv-upload/csv-upload.service';

@Component({
  selector: 'app-csv-upload',
  templateUrl: './csv-upload.component.html',
  styleUrls: ['./csv-upload.component.less']
})
export class CsvUploadComponent implements OnInit {

  selectedCSV: any = null;

  constructor(private csvUploadService: CsvUploadService) { }

  ngOnInit(): void {
  }

  onFileSelect(event) {
    var reader = new FileReader()

    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (readerLoadEvent) => {
      this.selectedCSV = {
        buffer: readerLoadEvent.target.result,
        meta: {
          fileName: event.target.files[0].name,
          fileType: event.target.files[0].type
        }
      }
      console.log(this.selectedCSV, "THE SELECTED FILE DATA STORED")
      this.uploadCSV()
    }
  }

  uploadCSV() {
    if(this.selectedCSV) {
      this.csvUploadService.uploadCSV(this.selectedCSV);
    }
  }
}
