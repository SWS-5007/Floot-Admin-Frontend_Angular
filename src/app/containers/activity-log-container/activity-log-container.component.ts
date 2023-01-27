import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivityFormData, ActivityLogModalComponent } from 'src/app/modals/activity-log-modal/activity-log-modal.component';

@Component({
  selector: 'app-activity-log-container',
  templateUrl: './activity-log-container.component.html',
  styleUrls: ['./activity-log-container.component.less']
})
export class ActivityLogContainerComponent {


  private _activityLogs: ActivityLog[] = [];
  @Input() set activityLogs(activityLogs: ActivityLog[]){
    this._activityLogs = activityLogs;
    this.refreshList();
  }
  get activityLogs() {
    return this._activityLogs;
  }

  @Output() addActivity = new EventEmitter<ActivityFormData>();

  totalPages: number;
  currentPage = 1;
  availablePages = [1];
  resultsPerPage = 5;
  activitiesToDisplay = []

  constructor(public dialog: MatDialog) { }

  onAddActivity() {
    const dialog = this.dialog.open(ActivityLogModalComponent);

    dialog.afterClosed().subscribe(result => {
      if(result){
        this.addActivity.emit(result);
      }
    })
  }

  public refreshList(): void {

    let skip = 0;
    if (this.currentPage > 1) {
      skip = ((this.currentPage - 1) * this.resultsPerPage) - 1;
    }
    this.activitiesToDisplay = this._activityLogs.slice(skip, skip + this.resultsPerPage);
    this.setPageNumbers();
  }

  public setPageNumbers(): void {
    const totalPageCount = Math.ceil(this.activitiesToDisplay.length / this.resultsPerPage);
    this.totalPages = totalPageCount;
    if (Number(this.currentPage)) {

      this.availablePages = [];

      if (this.totalPages <= 5) {
        for (let i = 0; i < totalPageCount; i) {
          this.availablePages.push(i+1)
          i++
        }
      } else if (totalPageCount - Number(this.currentPage) <= 2) {
        for (let i = 0; i < 5; i) {
          this.availablePages.push((totalPageCount - 5) + (i+1))
          i++
        }
      } else if ((totalPageCount > 5 && Number(this.currentPage)) <= 3) {
        for (let i = 0; i < 5; i) {
          this.availablePages.push(i+1);
          i++
        }
      } else {
        for (let i = 0; i < 5; i) {
          this.availablePages.push((Number(this.currentPage) - 2) + i)
          i++
        }
      }

    }
  }

  public changePageNo(input: number) : void {
    if (Number(input)) {
      this.currentPage = Number(input);
      this.refreshList();
    }
  }

}

export interface ActivityLog{
  activityType: string;
  comment: string;
  createdOn: string;
  activityDate: string;
  author: {
    name: string;
    role: string;
  }
}