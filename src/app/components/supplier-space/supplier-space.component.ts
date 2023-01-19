import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface Supplier {
  id: string,
  name: string,
  profileImageUrl: string | null,
  coverImageUrl: string | null,
  tagline: string,
  websiteUrl: string | null,
  contactForms: ContactForm[] | null,
}

interface ContactForm {
  id: string,
  title: string,
  description: string | null,
  fields: ContactFormField[]
}

interface ContactFormField {
  id: string | null,
  label: string | null,
  type: "text" | "number" | "file" | null,
}

interface ContactFormFieldSubmission {
  id: string | null,
  label: string | null,
  value: any,
}

@Component({
  selector: 'app-supplier-space',
  templateUrl: './supplier-space.component.html',
  styleUrls: ['./supplier-space.component.less']
})
export class SupplierSpaceComponent implements OnInit {

  public suppliers: Supplier[] = [];

  public selectedSupplierIndex: number = -1;
  public selectedFormIndex: number = -1;

  public contactForm: FormGroup = null;

  public formFileError: boolean = null;

  public selectedFormFile: any = null;

  public notificationSupplierIndex: number = -1;
  public showFormSent: boolean = false;

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.contactForm = null
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/venues/get-suppliers', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      if(request.status === 'ok') {
        
        this.suppliers = request.responseData.suppliers.sort((a, b) => a.name.toLowerCase() !== b.name.toLowerCase)

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not load the suppliers.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not load the suppliers.',
        unsanitizedMessage: error
      });

    }
  }

  public async sendContactForm(): Promise<void> {
    try {

      if (!this.contactForm || !this.contactForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/venues/submit-supplier-contact-form', {
        token: this.authService.getAuthenticationState().authenticationToken,
        contactFormId: this.suppliers[this.selectedSupplierIndex].contactForms[this.selectedFormIndex].id,
        supplierForm: this.formatContactFormSubmission(this.contactForm.value, this.selectedSupplierIndex, this.selectedFormIndex)
      }).toPromise();

      if(request.status === 'ok') {
        
        this.notificationSupplierIndex = this.selectedSupplierIndex;
        this.selectedSupplierIndex = -1;
        this.selectedFormIndex = -1;
        this.contactForm = new FormGroup({})
        this.selectedFormFile = null;

        this.showFormSent = true;
        
        setTimeout(() => {
          this.showFormSent = false;
        }, 5000)

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not submit the contact form.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not submit the contact form.',
        unsanitizedMessage: error
      });

    }
  }

  public formatContactFormSubmission(form: any, supplierIndex: number, formIndex: number): ContactFormFieldSubmission[] {
    try {

      let formattedFields = [];

      const ids = Object.keys(form);
      const values = Object.values(form)

      for (let i = 0; i < ids.length; i++) {

        const indexOfField = this.suppliers[supplierIndex].contactForms[formIndex].fields.findIndex(x => x.id === ids[i])

        formattedFields.push({
          id: ids[i],
          type: this.suppliers[supplierIndex].contactForms[formIndex].fields[indexOfField].type,
          value: this.suppliers[supplierIndex].contactForms[formIndex].fields[indexOfField].type === 'file' ? this.selectedFormFile : values[i]
        })

        // this.selectedFormFile = null;

      }

      return formattedFields;
    }
    catch(error) {
      throw error;
    }
  }

  public openContactForm(supplier: Supplier, index: number, formIndex: number): void {
    try {

      

      if (!supplier || !supplier.contactForms || index < 0) {
        
        return;
      }

      this.contactForm = new FormGroup({})

      for (let index = 0; index < supplier.contactForms[formIndex].fields.length; index++) {
        const element = supplier.contactForms[formIndex].fields[index];

        this.contactForm.addControl(element.id, new FormControl('', Validators.required))
        
      }

    }
    catch(error) {
      throw error;
    }
  }

  public dismissContactForm(): void {
    try {

      this.contactForm = null

      return;

    }
    catch(error) {
      throw error;
    }
  }

  public onFormFileSelected(event: any): void {

    var reader = new FileReader();
    
    if (event.target.files.length === 1) {

      if (event.target.files[0].size > 50048576) {

        this.formFileError = true

      } else {

        this.formFileError = false

        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (readerLoadEvent) => {
          this.selectedFormFile = {
            buffer: readerLoadEvent.target.result,
            meta: {
              fileName: event.target.files[0].name,
              fileType: event.target.files[0].type
            }
          }
        }
      }
    }
  }

  ngOnInit(): void {
  }

}
