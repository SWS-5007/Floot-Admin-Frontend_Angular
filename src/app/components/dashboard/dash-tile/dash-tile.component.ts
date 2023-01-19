import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dash-tile',
  templateUrl: './dash-tile.component.html',
  styleUrls: ['./dash-tile.component.less']
})
export class DashTileComponent implements OnInit {

  @Input("name") name: string = ""
  @Input("value") value: number = 0

  constructor() { }

  ngOnInit(): void {
  }

}
