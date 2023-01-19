import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Post } from 'src/app/components/venues/venue-profile/venue-profile.component';
import { DeleteModalData, DeleteModalComponent } from 'src/app/modals/delete-modal/delete-modal.component';

@Component({
  selector: 'app-floot-venue-posts-table',
  templateUrl: './floot-venue-posts-table.component.html',
  styleUrls: ['./floot-venue-posts-table.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FlootVenuePostsTableComponent implements OnInit {

  @Input() posts: Post[];
  @Output() deletePost = new EventEmitter<string>();

  columnsToDisplay = ['caption', 'venue', 'created'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];


  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onDeletePost(postId: string){
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '250px',
      data: {
        heading: "Delete Post",
        message: "Are you sure you would like to delete this post?",
        data: postId,
      },
    });

    dialogRef.afterClosed().subscribe((result:DeleteModalData) => {
      console.log('The dialog was closed');
      if(result){
        this.deletePost.emit(result.data);
      }
    });
  }
}
