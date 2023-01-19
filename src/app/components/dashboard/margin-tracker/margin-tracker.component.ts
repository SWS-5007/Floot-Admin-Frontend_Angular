import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

export interface Element {
  name: string;
  gp_per_unit: number;
  gross: number;
  margin: number;
  mls: number;
  rate: number;
  unitCost: number;
  cost: number;
}

@Component({
  selector: "app-margin-tracker",
  templateUrl: "./margin-tracker.component.html",
  styleUrls: ["./margin-tracker.component.less"],
})
export class MarginTrackerComponent {
  @ViewChild(MatSort) sort: MatSort;

  displayColumns: string[] = [
    "name",
    "cost",
    "rate",
    "mls",
    "unit_cost",
    "gross",
    "gp_per_unit",
    "margin",
  ];
  tableData: Element[] = [];

  dataSource = null;

  constructor(private http: HttpClient) {
    this.loadTable();
  }

  async loadTable() {
    await this.pullTableData().then((res) => {
      console.log(this.tableData);
      this.tableData = res.map((x) => {
        return {
          name: x.name,
          gp_per_unit: parseFloat(x.gp_per_uni),
          gross: parseFloat(x.gross),
          margin: parseFloat(x.margin),
          mls: parseFloat(x.mls),
          rate: parseFloat(x.rate),
          unitCost: parseFloat(x.unitCost),
          cost: parseFloat(x.cost),
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
      console.log("request is");
      console.log(request);
      return request.payload;
    } catch (error) {
      console.log(error);
    }
  }

  doFilter = (value: any) => {
    let v = (<HTMLTextAreaElement>value).value;
    this.dataSource.filter = v.trim().toLocaleLowerCase();
  };
}
