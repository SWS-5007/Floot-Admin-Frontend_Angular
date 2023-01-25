import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

export interface Element {
  name: string;
  cost: number;
  rate: number;
  mls: number;
  unitCost: number;
  gross: number;
  gp_per_unit: number;
  margin: number;
}

@Component({
  selector: "app-margin-tracker",
  templateUrl: "./margin-tracker.component.html",
  styleUrls: ["./margin-tracker.component.less"],
})
export class MarginTrackerComponent implements OnInit, AfterViewInit {
  // @ViewChild(MatSort) sort: MatSort;

  displayColumns: string[] = [
    "name",
    "cost",
    "rate",
    "mls",
    "unitCost",
    "gross",
    "gp_per_unit",
    "margin",
  ];
  tableData: Element[] = [];

  dataSource = null;

  constructor(
    private http: HttpClient,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.loadTable();
  }

  // @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort) sort: MatSort;


  announceSortChange(sortState: Sort) {
    console.log('@@@@@@@########', sortState)
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  async loadTable() {
    await this.pullTableData().then((res) => {
      this.tableData = res.map((x) => {
        return {
          name: x.name,
          cost: parseFloat(x.cost),
          gp_per_unit: parseFloat(x.gp_per_uni),
          gross: parseFloat(x.gross),
          margin: parseFloat(x.margin),
          mls: parseFloat(x.mls),
          rate: parseFloat(x.rate),
          unitCost: parseFloat(x.unitCost),
        };
      });
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.sort = this.sort;
    });
  }

  async pullTableData() {
    try {
      const request: any = await this.http
        .post(environment.apiUrl + "/api/get-product-tracker-data", {
          venue_id: 1,
        })
        .toPromise();
      return request.payload;
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit() {
    // this.loadTable();
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
  }

  doFilter = (value: any) => {
    let v = (<HTMLTextAreaElement>value).value;
    this.dataSource.filter = v.trim().toLocaleLowerCase();
  };
}
