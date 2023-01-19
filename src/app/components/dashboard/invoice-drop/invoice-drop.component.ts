import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invoice-drop',
  templateUrl: './invoice-drop.component.html',
  styleUrls: ['./invoice-drop.component.less']
})
export class InvoiceDropComponent {

  files: File[] = [];
  public selectedFile: any = null;
  public fileExtension: string = null;
  public posting: boolean = false;

  constructor(
    private http: HttpClient

  ) {}

public async onSelect(event:any ) {
  this.posting = true;

  this.files.push(...event.addedFiles);

  await (new Promise<void>(async(resolve,reject) => {
      let reader = new FileReader();

      reader.readAsDataURL(this.files[0]);
      reader.onload = (readerLoadEvent) => {
        this.selectedFile = {
          buffer: readerLoadEvent.target.result,
          meta: {
            fileName: this.files[0].name,
            fileType: this.files[0].type
          }
        }
        console.log('seelctfile')
        console.log(this.selectedFile);
        this.fileExtension = this.selectedFile.meta.fileType.replace(/(.*)\//g, '');
        resolve();
        //this.onUserInputEvent();

    };
  }).then(async() => {
    try {

      const request: any = await this.http.post(environment.api + '/api/upload-invoice', {
        venueJsonId: '6231c0e5386f0d9e3ccf151e',
        venueName: 'Tilt',
        file: this.selectedFile ? this.selectedFile : null,
        originalFileName: this.fileExtension,
      }).toPromise();
        
      console.log('request' + request.status);

      

      if(request.status === 'ok') {
        
      }
      else {
      }

    } catch {

    }
  }).catch(function(reason){

  }));


  this.posting = false;

    

    console.log(this.selectedFile)

    console.log(event);

    


  }



  onRemove(event) {
    console.log(event)
    this.files.splice(this.files.indexOf(event),1)
  }

}