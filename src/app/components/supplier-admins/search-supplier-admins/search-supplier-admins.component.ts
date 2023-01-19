import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

interface Account {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  assignedSupplier: {
    id: string,
    name: string,
    address: string
  } | null
}

interface Supplier {
  id: string,
  name: string
}

@Component({
  selector: 'app-search-supplier-admins',
  templateUrl: './search-supplier-admins.component.html',
  styleUrls: ['./search-supplier-admins.component.less']
})
export class SearchSupplierAdminsComponent implements OnInit {

  public accounts: Account[] = [];
  public suppliers: Supplier[] = [];

  public showAccounts: Account[] = [];
  public totalPageCount: number = 0;
  public currentPageNo: number = 1;
  public resultsPerPage: number = 10;
  public availablePages: number[] = [1,2,3,4,5];

  public searchForm: FormGroup;

  public pendingDeleteId: string = "";

  public userDeleted: boolean = false;
  public userEdited: boolean = false;
  public userCreated: boolean = false;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    public pendingSaveService: PendingSaveService,
    private router: Router
  ) {
    this.searchForm = new FormGroup({
      searchText: new FormControl(""),
      assignedSupplier: new FormControl("any")
    })

    if((this.router.getCurrentNavigation() as any).extras.state) {

      const routeState = (this.router.getCurrentNavigation() as any).extras.state;

      if (routeState.userEdited === true) {
        this.userEdited = true;

        setTimeout(() => {
          this.userEdited = false;
        }, 3000)
      }

      if (routeState.userCreated === true) {
        this.userCreated = true;

        setTimeout(() => {
          this.userCreated = false;
        }, 3000)
      }
    }

    this.loadSuppliers();
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/accounts/suppliers/get-accounts', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      

      if(request.status === 'ok') {
        this.accounts = request.responseData.accounts.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0);
        this.refreshList();

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not load accounts.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not load accounts.',
        unsanitizedMessage: error
      });

    }
  }

  public refreshList(): void {

    let skip = 0;

    if (this.currentPageNo > 1) {
      skip = ((this.currentPageNo - 1) * this.resultsPerPage) - 1;
    }

    this.showAccounts = this.accounts.slice(skip, skip + this.resultsPerPage);

    this.setPageNumbers();
  }

  public setPageNumbers(): void {
    const totalPageCount = Math.ceil(this.accounts.length / this.resultsPerPage);
    this.totalPageCount = totalPageCount;
    if (Number(this.currentPageNo)) {

      this.availablePages = [];

      if (this.totalPageCount <= 5) {
        for (let i = 0; i < totalPageCount; i) {
          this.availablePages.push(i+1)
          i++
        }
      } else if (totalPageCount - Number(this.currentPageNo) <= 2) {
        for (let i = 0; i < 5; i) {
          this.availablePages.push((totalPageCount - 5) + (i+1))
          i++
        }
      } else if ((totalPageCount > 5 && Number(this.currentPageNo)) <= 3) {
        for (let i = 0; i < 5; i) {
          this.availablePages.push(i+1);
          i++
        }
      } else {
        for (let i = 0; i < 5; i) {
          this.availablePages.push((Number(this.currentPageNo) - 2) + i)

          i++
        }
      }

    }
  }

  public clearSearch(): void {
    this.searchForm.patchValue({
      searchText: null,
      assignedSupplier: 'any',
    })

    this.loadData();
  }

  public setPendingDeleteId(id: string): void {
    this.pendingDeleteId = id
  }

  public async deleteUser(): Promise<void> {
    try {

      const pendingDeleteUser = this.accounts.findIndex(x => x.id === this.pendingDeleteId);

      if (pendingDeleteUser > -1) {

        if (this.accounts[pendingDeleteUser].email === this.authService.account.email) {
          // They are trying to delete their own account
          return;
        }

        const request: any = await this.http.post(environment.api + '/api/admin/accounts/delete-account', {
          token: this.authService.getAuthenticationState().authenticationToken,
          accountId: this.pendingDeleteId,
        }).toPromise();

        if(request.status === 'ok' && request.responseData.userDeleted === true) {

          const userIndex = this.accounts.findIndex(x => x.id === this.pendingDeleteId);
          if (userIndex > -1) {
            this.accounts.splice(userIndex, 1);
          }

          this.refreshList();

          this.pendingDeleteId = '';

          this.userDeleted = true;

          setTimeout(() => {
            this.userDeleted = false;
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

  private async loadSuppliers(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/get-suppliers', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();

      

      if(request.status === 'ok') {
        
        this.suppliers = request.responseData.suppliers.sort((a, b) => a.name.toLowerCase() !== b.name.toLowerCase() ? a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1 : 0);;

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
        displayMessage: "Could not load the suppliers.",
        unsanitizedMessage: error
      });

    }
  }

  public async searchAdmins(): Promise<void> {
    try {

      if (this.searchForm.invalid) {
        return
      }

      const request: any = await this.http.post(environment.api + '/api/admin/accounts/suppliers/get-accounts', {
        token: this.authService.getAuthenticationState().authenticationToken,
        searchText: this.searchForm.value.searchText ? this.searchForm.value.searchText : null,
        supplierId: this.searchForm.value.assignedSupplier && this.searchForm.value.assignedSupplier !== 'any' ? this.searchForm.value.assignedSupplier : null
      }).toPromise();

      

      if(request.status === 'ok') {
        this.accounts = request.responseData.accounts;
        this.refreshList();
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
        displayMessage: 'Could not search accounts.',
        unsanitizedMessage: error
      });

    }
  }

  public changePageNo(input: string) : void {
    if (Number(input)) {
      this.currentPageNo = Number(input);
      this.refreshList();
    }
  }

  ngOnInit(): void {
  }

}
