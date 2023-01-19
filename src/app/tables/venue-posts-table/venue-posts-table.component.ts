import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Post } from 'src/app/components/venues/venue-profile/venue-profile.component';
import { DeleteModalData, DeleteModalComponent } from 'src/app/modals/delete-modal/delete-modal.component';

@Component({
  selector: 'app-venue-posts-table',
  templateUrl: './venue-posts-table.component.html',
  styleUrls: ['./venue-posts-table.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VenuePostsTableComponent implements OnInit {

  @Input() posts: Post[];
  
  @Output() deletePost = new EventEmitter<string>();

  columnsToDisplay = ['caption', 'created'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  pendingDeletePostId: string = null;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onDeletePost(postId: string){
    const dialogRef = this.dialog.open(DeleteModalComponent, {
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
