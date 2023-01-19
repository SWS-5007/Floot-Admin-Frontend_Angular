import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})
export class ProductsComponent implements OnInit {

  
  maxDate: Date = null;
  minDate: Date = null;

  constructor() { }

  ngOnInit(): void {
  }

  changeDay(event){

  }

}
