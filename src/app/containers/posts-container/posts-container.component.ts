import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from 'src/app/components/venues/venue-profile/venue-profile.component';

@Component({
  selector: 'app-posts-container',
  templateUrl: './posts-container.component.html',
  styleUrls: ['./posts-container.component.less']
})
export class PostsContainerComponent implements OnInit {

  @Input() posts: Post[];
  @Input() venueId: string;

  @Output() createPost = new EventEmitter();
  @Output() deletePost = new EventEmitter<string>();
  @Output() editPost = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

}
