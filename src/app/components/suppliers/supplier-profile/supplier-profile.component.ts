import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import Roles from 'src/app/types/roles';
import { environment } from 'src/environments/environment';

interface BasicInfo {
  name: string,
  tagline: string,
  description: string,
  profileImageUrl: string,
  coverImageUrl: string,
  websiteUrl: string
}

interface SupplierAdmin {
  id: string,
  name: string,
  email: string
}

export interface ContactForm {
  id: string,
  title: string | null,
  description: string | null,
  type: string | null,
  apiKey: {
    fieldId: string | null,
    apiKey: string | null,
  } | null,
  endpoint: string | null,
  emailAddress: string | null,
  fields: ContactFormField[],
  hiddenFields: ContactFormHiddenField[]
}

export interface ContactFormField {
  id: string | null,
  label: string | null,
  type: "text" | "number" | "file" | null,
}

export interface ContactFormHiddenField {
  id: string | null,
  value: string | null,
}

export interface ContactFormFieldSubmission {
  label: string | null,
  value: string,
}

@Component({
  selector: 'app-supplier-profile',
  templateUrl: './supplier-profile.component.html',
  styleUrls: ['./supplier-profile.component.less']
})
export class SupplierProfileComponent implements OnInit {

  public supplierId: string = null;
  public basicInfo: BasicInfo = null;
  public supplierAdmins: SupplierAdmin[] = [];
  public status: "active" | "hidden" | "deleted" = null;

  public email: string = null;
  public phoneNumber: string = null;

  public contactForms: ContactForm[] = [];

  public editDescriptionForm: FormGroup = null;
  public editFormForm: FormGroup[] = [];

  public addFormForm: FormGroup;

  public supplierEdited: boolean = false;
  public supplierCreated: boolean = false;
  public adminAccountDeleted: boolean = false;
  public adminAccountEdited: boolean = false;
  public supplierMarkedAsActive: boolean = false;
  supplierMarkedAsInactive = false;
  public contactFormsUpdated: boolean = false;

  public pendingDeleteAdminAccountId: string = null;

  public activePermission: boolean = false;

  public selectedFormIndex: number = 0;

  get id(): FormArray {
    return this.editFormForm[this.selectedFormIndex].get('id') as FormArray;
  }

  get type(): FormArray {
    return this.editFormForm[this.selectedFormIndex].get('type') as FormArray;
  }

  get label(): FormArray {
    return this.editFormForm[this.selectedFormIndex].get('label') as FormArray;
  }

  get hiddenId(): FormArray {
    return this.editFormForm[this.selectedFormIndex].get('hiddenId') as FormArray;
  }

  get hiddenValue(): FormArray {
    return this.editFormForm[this.selectedFormIndex].get('hiddenValue') as FormArray;
  }

  get newFormId(): FormArray {
    return this.addFormForm.get('id') as FormArray;
  }

  get newFormType(): FormArray {
    return this.addFormForm.get('type') as FormArray;
  }

  get newFormLabel(): FormArray {
    return this.addFormForm.get('label') as FormArray;
  }

  get newFormHiddenId(): FormArray {
    return this.addFormForm.get('hiddenId') as FormArray;
  }

  get newFormHiddenValue(): FormArray {
    return this.addFormForm.get('hiddenValue') as FormArray;
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    if (this.authService.account.role === Roles.FlootAdmin) {
      this.activePermission = true;
    } else {
      this.activePermission = false;
    }

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('supplierId')) {

        this.supplierId = paramMap.get('supplierId');

        this.loadData();

      } else {
        // go back the admin's assigned supplier
        this.supplierId = this.authService.account.assignedSupplier;
        this.loadData();
      }
    });

    if(this.router.getCurrentNavigation().extras.state) {

      if(this.router.getCurrentNavigation().extras.state.supplierEdited) {
        this.supplierEdited = true

        setTimeout(() => {
          this.supplierEdited = false;
        }, 3000);
      }

      if(this.router.getCurrentNavigation().extras.state.supplierCreated) {
        this.supplierCreated = true

        setTimeout(() => {
          this.supplierCreated = false;
        }, 3000);
      }
      
    }

    this.editDescriptionForm = new FormGroup({
      description: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(500)
        ]
      })
    })

    this.addFormForm = new FormGroup({
      title: new FormControl('', { validators: [ Validators.required ] }),
      description: new FormControl('', { validators: [ Validators.required ] }),
      formType: new FormControl('', { validators: [ Validators.required ]}),
      endpoint: new FormControl('', {}),
      apiKey: new FormControl('', {}),
      apiKeyFieldId: new FormControl('', {}),
      emailAddress: new FormControl('', {}),
      id: this.fb.array([]),
      type: this.fb.array([]),
      label: this.fb.array([]),
      hiddenId: this.fb.array([]),
      hiddenValue: this.fb.array([]),
    })
    
  }

  ngOnInit(): void {
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/profile/get-supplier-profile', {
        token: this.authService.getAuthenticationState().authenticationToken,
        supplierId: this.supplierId ? this.supplierId : null
      }).toPromise();

      

      if(request.status === 'ok') {
        this.basicInfo = request.responseData.supplier.basicInfo;

        this.editDescriptionForm.patchValue({
          description: this.basicInfo.description
        });

        this.supplierAdmins = request.responseData.supplier.admins;

        this.status = request.responseData.supplier.status;

        this.contactForms = request.responseData.supplier.contactForms;

        if (this.contactForms.length > 0) {

          for (let index = 0; index < this.contactForms.length;) {

            

            this.selectedFormIndex = index;

            const form = this.contactForms[index]
            
            this.editFormForm.push(new FormGroup({
              title: new FormControl(form.title ? form.title : '', { validators: [ Validators.required ] }),
              description: new FormControl(form.description ? form.description : '', { validators: [ Validators.required ] }),
              formType: new FormControl(form.type ? form.type : '', { validators: [ Validators.required ]}),
              endpoint: new FormControl(form.endpoint ? form.endpoint : '', {}),
              apiKey: new FormControl(form.apiKey && form.apiKey.apiKey ? form.apiKey.apiKey : '', {}),
              apiKeyFieldId: new FormControl(form.apiKey && form.apiKey.fieldId ? form.apiKey.fieldId : '', {}),
              emailAddress: new FormControl(form.emailAddress ? form.emailAddress : '', {}),
              id: this.fb.array([]),
              type: this.fb.array([]),
              label: this.fb.array([]),
              hiddenId: this.fb.array([]),
              hiddenValue: this.fb.array([])
            }))
            
            

            if (form.fields && form.fields.length > 0) {

              await (form.fields.forEach((field: ContactFormField, index: number) => {
                this.id.push(new FormControl(''));
                this.type.push(new FormControl(''));
                this.label.push(new FormControl(''));
      
                if (field.id) {
                  this.id.controls[index].patchValue(field.id);
                }
      
                if (field.type) {
                  this.type.controls[index].patchValue(field.type);
                }
      
                if (field.label) {
                  this.label.controls[index].patchValue(field.label);
                }
      
              }))
            }


            if (form.hiddenFields && form.hiddenFields.length > 0) {

              await (form.hiddenFields.forEach((field: ContactFormHiddenField, index: number) => {
                this.hiddenId.push(new FormControl(''));
                this.hiddenValue.push(new FormControl(''));
      
                if (field.id) {
                  this.hiddenId.controls[index].patchValue(field.id);
                }
      
                if (field.value) {
                  this.hiddenValue.controls[index].patchValue(field.value);
                }
      
              }))
            }


            

            index++
          }

          this.selectedFormIndex = null;

        }

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: request.responseData.message,
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: "Could not load the supplier.",
        unsanitizedMessage: error
      });

    }
  }

  public async editDescription(): Promise<void> {
    try {

      if (!this.editDescriptionForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/profile/edit-description', {
        token: this.authService.getAuthenticationState().authenticationToken,
        supplierId: this.supplierId,
        description: this.editDescriptionForm.value.description
      }).toPromise();

      

      if(request.status === 'ok') {

        this.basicInfo.description = this.editDescriptionForm.value.description;
        
      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: request.responseData.message,
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: "Could not edit the description.",
        unsanitizedMessage: error
      });

    }
  }

  public async deleteAdminAccount(): Promise<void> {
    try {

      const pendingDeleteUser = this.supplierAdmins.findIndex(x => x.id === this.pendingDeleteAdminAccountId);

      if (pendingDeleteUser > -1) {

        if (this.supplierAdmins[pendingDeleteUser].email === this.authService.account.email) {
          // They are trying to delete their own account
          return;
        }

        const request: any = await this.http.post(environment.api + '/api/admin/accounts/delete-account', {
          token: this.authService.getAuthenticationState().authenticationToken,
          accountId: this.pendingDeleteAdminAccountId,
        }).toPromise();

        

        if(request.status === 'ok' && request.responseData.userDeleted === true) {

          const userIndex = this.supplierAdmins.findIndex(x => x.id === this.pendingDeleteAdminAccountId);
          if (userIndex > -1) {
            this.supplierAdmins.splice(userIndex, 1);
          }

          this.pendingDeleteAdminAccountId = '';

          this.adminAccountDeleted = true;

          setTimeout(() => {
            this.adminAccountDeleted = false;
          }, 3000)

        }
        else {
          this.errorHandlerService.throwError({
            displayMessage: 'Could not delete account.',
            unsanitizedMessage: 'No stack trace.'
          });
        }
      }


    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not delete account.',
        unsanitizedMessage: error
      });

    }
  }

  public async deleteSupplier(): Promise<void> {
    try {

        const request: any = await this.http.post(environment.api + '/api/admin/suppliers/delete-supplier', {
          token: this.authService.getAuthenticationState().authenticationToken,
          supplierId: this.supplierId,
        }).toPromise();

        

        if(request.status === 'ok') {

          this.router.navigateByUrl("/supplier-list", {
            state: {
              supplierDeleted: true
            }
          })

        }
        else {
          this.errorHandlerService.throwError({
            displayMessage: 'Could not delete supplier.',
            unsanitizedMessage: 'No stack trace.'
          });
        }
    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not delete supplier.',
        unsanitizedMessage: error
      });

    }
  }

  public async makeSupplierActive(): Promise<void> {
    try {

      if (this.status !== 'hidden') {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/make-supplier-active', {
        token: this.authService.getAuthenticationState().authenticationToken,
        supplierId: this.supplierId
      }).toPromise();

      

      if(request.status === 'ok') {
        
        this.status = "active";

        this.supplierMarkedAsActive = true;

        setTimeout(() => {
          this.supplierMarkedAsActive = false;
        }, 3000)

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: request.responseData.message,
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: "Could not make the supplier active.",
        unsanitizedMessage: error
      });

    }
  }

  public async deactivateSupplier(): Promise<void> {
    try {

      if (this.status !== 'active') {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/deactivate-supplier', {
        token: this.authService.getAuthenticationState().authenticationToken,
        supplierId: this.supplierId
      }).toPromise();

      

      if(request.status === 'ok') {
        
        this.status = "hidden";

        this.supplierMarkedAsInactive = true;

        setTimeout(() => {
          this.supplierMarkedAsInactive = false;
        }, 3000)

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: request.responseData.message,
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: "Could not deactivate the supplier.",
        unsanitizedMessage: error
      });

    }
  }

  public assignAdminUserToSupplier(): void {

    this.router.navigateByUrl("/supplier-team/add-supplier-team-member", {
      state: {
        supplierId: this.supplierId
      }
    })

  }

  public navigateToEditAdminUser(id: string): void {
    this.router.navigateByUrl(`/supplier-team/edit-supplier-team-member/${id}`, {
      state: {
        returnUrl: `/supplier-list/profile/${this.supplierId}`
      }
    })
  }

  public addEditFormElement(): void {
    this.id.push(new FormControl('', { validators: [ Validators.required ] }));
    this.type.push(new FormControl('', { validators: [ Validators.required ] }));
    this.label.push(new FormControl('', { validators: [ Validators.required ] }));
  }

  public removeEditFormElement(index: number): void {
    this.id.removeAt(index);
    this.type.removeAt(index);
    this.label.removeAt(index);
  }

  public addEditFormHiddenElement(): void {
    this.hiddenId.push(new FormControl('', { validators: [ Validators.required ] }));
    this.hiddenValue.push(new FormControl('', { validators: [ Validators.required ] }));
  }

  public removeEditFormHiddenElement(index: number): void {
    this.hiddenId.removeAt(index);
    this.hiddenValue.removeAt(index);
  }

  public addAddFormElement(): void {
    this.newFormId.push(new FormControl('', { validators: [ Validators.required ] }));
    this.newFormType.push(new FormControl('', { validators: [ Validators.required ] }));
    this.newFormLabel.push(new FormControl('', { validators: [ Validators.required ] }));
  }

  public removeAddFormElement(index: number): void {
    this.newFormId.removeAt(index);
    this.newFormType.removeAt(index);
    this.newFormLabel.removeAt(index);
  }

  public addAddFormHiddenElement(): void {
    this.newFormHiddenId.push(new FormControl('', { validators: [ Validators.required ] }));
    this.newFormHiddenValue.push(new FormControl('', { validators: [ Validators.required ] }));
  }

  public removeAddFormHiddenElement(index: number): void {
    this.newFormHiddenId.removeAt(index);
    this.newFormHiddenValue.removeAt(index);
  }

  public async removeContactForm() : Promise<void> {
    try {

      if (!this.contactForms[this.selectedFormIndex]) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/profile/remove-contact-form', {
        token: this.authService.getAuthenticationState().authenticationToken,
        formId: this.contactForms[this.selectedFormIndex].id
      }).toPromise();

      if(request.status === 'ok') {

        this.contactForms.splice(this.selectedFormIndex, 1);

        this.editFormForm.splice(this.selectedFormIndex, 1);

        
        

        this.selectedFormIndex = null;
        
        this.contactFormsUpdated = true;

        setTimeout(() => {
          this.contactFormsUpdated = false;
        }, 2000);

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: request.responseData.message,
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: "Could not remove the contact form.",
        unsanitizedMessage: error
      });

    }
  }

  public async addContactForm(): Promise<void> {
    try {

      

      

      if (
        this.contactForms.length >= 3 ||
        !this.addFormForm.valid ||
        this.checkDuplicateAddFormIds() ||
        (this.addFormForm.value.formType === 'API' && !(this.addFormForm.value.endpoint && this.addFormForm.value.apiKey && this.addFormForm.value.apiKeyFieldId)) ||
        (this.addFormForm.value.formType === 'email' && !this.addFormForm.value.emailAddress)
      ) {
        throw "invalid"
      }

      let fields = this.addFormForm.value.label.map((label: string, index: number) => {

        return ({
          id: this.addFormForm.value.id[index],
          label: label,
          type: this.addFormForm.value.type[index],
        })

      });

      

      let hiddenFields = this.addFormForm.value.hiddenId.map((id: string, index: number) => {
        return ({
          id: id,
          value: this.addFormForm.value.hiddenValue[index]
        })
      })

      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/profile/add-contact-form', {
        token: this.authService.getAuthenticationState().authenticationToken,
        supplierId: this.supplierId,
        title: this.addFormForm.value.title,
        description: this.addFormForm.value.description,
        type: this.addFormForm.value.formType,
        endpoint: this.addFormForm.value.endpoint,
        emailAddress: this.addFormForm.value.emailAddress,
        apiKey: {
          fieldId: this.addFormForm.value.apiKeyFieldId,
          apiKey: this.addFormForm.value.apiKey,
        },
        formFields: fields,
        hiddenFields: hiddenFields
      }).toPromise();

      

      if(request.status === 'ok') {

        

        this.contactForms.push({
          id: request.responseData.formId,
          title: this.addFormForm.value.title,
          description: this.addFormForm.value.description,
          type: this.addFormForm.value.formType,
          apiKey: {
            apiKey: this.addFormForm.value.formType === "API" ? this.addFormForm.value.apiKey : null,
            fieldId: this.addFormForm.value.formType === "API" ? this.addFormForm.value.apiKeyFieldId : null
          },
          endpoint: this.addFormForm.value.formType === "API" ? this.addFormForm.value.endpoint : null,
          emailAddress: this.addFormForm.value.emailAddress ? this.addFormForm.value.emailAddress : null,
          fields: fields,
          hiddenFields: hiddenFields
        })
        

        
          this.addFormForm.patchValue({
            title: null,
            description: null,
            type: null,
            apiKey: null,
            apiKeyFieldId: null,
            endpoint: null,
            emailAddress: null,
          })

          while ((this.newFormId as FormArray).length !== 0) {
            this.newFormId.removeAt(0)
          }
  
          while ((this.newFormType as FormArray).length !== 0) {
            this.newFormType.removeAt(0)
          }
  
          while ((this.newFormLabel as FormArray).length !== 0) {
            this.newFormLabel.removeAt(0)
          }

          while ((this.newFormHiddenId as FormArray).length !== 0) {
            this.newFormHiddenId.removeAt(0)
          }

          while ((this.newFormHiddenValue as FormArray).length !== 0) {
            this.newFormHiddenValue.removeAt(0)
          }

          
          this.selectedFormIndex = this.contactForms.length - 1

          this.editFormForm.push(new FormGroup({
            title: new FormControl(this.contactForms[this.selectedFormIndex].title ? this.contactForms[this.selectedFormIndex].title : '', { validators: [ Validators.required ] }),
            description: new FormControl(this.contactForms[this.selectedFormIndex].description ? this.contactForms[this.selectedFormIndex].description : '', { validators: [ Validators.required ] }),
            formType: new FormControl(this.contactForms[this.selectedFormIndex].type ? this.contactForms[this.selectedFormIndex].type : '', { validators: [ Validators.required ]}),
            endpoint: new FormControl(this.contactForms[this.selectedFormIndex].endpoint ? this.contactForms[this.selectedFormIndex].endpoint : '', {}),
            apiKey: new FormControl(this.contactForms[this.selectedFormIndex].apiKey && this.contactForms[this.selectedFormIndex].apiKey.apiKey ? this.contactForms[this.selectedFormIndex].apiKey.apiKey : '', {}),
            apiKeyFieldId: new FormControl(this.contactForms[this.selectedFormIndex].apiKey && this.contactForms[this.selectedFormIndex].apiKey.fieldId ? this.contactForms[this.selectedFormIndex].apiKey.fieldId : '', {}),
            emailAddress: new FormControl(this.contactForms[this.selectedFormIndex].emailAddress ? this.contactForms[this.selectedFormIndex].emailAddress : '', {}),
            id: this.fb.array([]),
            type: this.fb.array([]),
            label: this.fb.array([]),
            hiddenId: this.fb.array([]),
            hiddenValue: this.fb.array([]),
          }))


          await (this.contactForms[this.selectedFormIndex].fields.forEach((field: ContactFormField, index: number) => {
            this.id.push(new FormControl(''));
            this.type.push(new FormControl(''));
            this.label.push(new FormControl(''));
  
            if (field.id) {
              this.id.controls[index].patchValue(field.id);
            }
  
            if (field.type) {
              this.type.controls[index].patchValue(field.type);
            }
  
            if (field.label) {
              this.label.controls[index].patchValue(field.label);
            }
  
          }))

          await (this.contactForms[this.selectedFormIndex].hiddenFields.forEach((field: ContactFormHiddenField, index: number) => {
            this.hiddenId.push(new FormControl(''));
            this.hiddenValue.push(new FormControl(''));
  
            if (field.id) {
              this.hiddenId.controls[index].patchValue(field.id);
            }
  
            if (field.value) {
              this.hiddenValue.controls[index].patchValue(field.value);
            }
  
          }))

          this.contactFormsUpdated = true;

          setTimeout(() => {
            this.contactFormsUpdated = false;
          }, 2000);

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: request.responseData.message,
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: "Could not add the contact form.",
        unsanitizedMessage: error
      });

    }
  }

  public async editContactForm(indexOfForm: number): Promise<void> {
    try {

      

      if (
        !this.editFormForm[indexOfForm].valid ||
        this.checkDuplicateEditFormIds(indexOfForm) ||
        (this.editFormForm[indexOfForm].value.formType === 'API' && !(this.editFormForm[indexOfForm].value.endpoint && this.editFormForm[indexOfForm].value.apiKey && this.editFormForm[indexOfForm].value.apiKeyFieldId)) ||
        (this.editFormForm[indexOfForm].value.formType === 'email' && !this.editFormForm[indexOfForm].value.emailAddress)
      ) {
        throw "invalid"
      }

      let fields = this.editFormForm[indexOfForm].value.label.map((label: string, index: number) => {

        return ({
          id: this.editFormForm[indexOfForm].value.id[index],
          label: label,
          type: this.editFormForm[indexOfForm].value.type[index],
        })

      });

      

      let hiddenFields = this.editFormForm[indexOfForm].value.hiddenId.map((id: string, index: number) => {
        return ({
          id: id,
          value: this.editFormForm[indexOfForm].value.hiddenValue[index]
        })
      })

      

      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/profile/edit-contact-form', {
        token: this.authService.getAuthenticationState().authenticationToken,
        supplierId: this.supplierId,
        formId: this.contactForms[indexOfForm].id,
        title: this.editFormForm[indexOfForm].value.title,
        description: this.editFormForm[indexOfForm].value.description,
        type: this.editFormForm[indexOfForm].value.formType,
        endpoint: this.editFormForm[indexOfForm].value.endpoint,
        emailAddress: this.editFormForm[indexOfForm].value.emailAddress,
        apiKey: {
          fieldId: this.editFormForm[indexOfForm].value.apiKeyFieldId,
          apiKey: this.editFormForm[indexOfForm].value.apiKey,
        },
        formFields: fields,
        hiddenFields: hiddenFields
      }).toPromise();

      

      if(request.status === 'ok') {

        

        this.contactForms[indexOfForm] = {
          id: this.contactForms[indexOfForm].id,
          title: this.editFormForm[indexOfForm].value.title,
          description: this.editFormForm[indexOfForm].value.description,
          type: this.editFormForm[indexOfForm].value.formType,
          apiKey: {
            apiKey: this.editFormForm[indexOfForm].value.formType === "API" ? this.editFormForm[indexOfForm].value.apiKey : null,
            fieldId: this.editFormForm[indexOfForm].value.formType === "API" ? this.editFormForm[indexOfForm].value.apiKeyFieldId : null
          },
          endpoint: this.editFormForm[indexOfForm].value.formType === "API" ? this.editFormForm[indexOfForm].value.endpoint : null,
          emailAddress: this.editFormForm[indexOfForm].value.emailAddress ? this.editFormForm[indexOfForm].value.emailAddress : null,
          fields: fields,
          hiddenFields: hiddenFields
        }
        
        
        if (this.contactForms[indexOfForm].type === 'email') {
          this.editFormForm[indexOfForm].patchValue({
            apiKey: null,
            apiKeyFieldId: null,
            endpoint: null
          })
        } else {
          this.editFormForm[indexOfForm].patchValue({
            emailAddress: null,
          })
        }

        this.contactFormsUpdated = true;

        setTimeout(() => {
          this.contactFormsUpdated = false;
        }, 2000);

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: request.responseData.message,
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: "Could not edit the contact form.",
        unsanitizedMessage: error
      });

    }
  }

  public checkDuplicateAddFormIds(): boolean {
    if (this.addFormForm.value.id.filter((item, index) => this.addFormForm.value.id.indexOf(item) != index).length > 0) {
      return true
    } else {
      return false
    }
  }

  public checkDuplicateEditFormIds(indexOfForm: number): boolean {
    if (this.editFormForm[indexOfForm].value.id.filter((item, index) => this.editFormForm[indexOfForm].value.id.indexOf(item) != index).length > 0) {
      return true
    } else {
      return false
    }
  }

}
