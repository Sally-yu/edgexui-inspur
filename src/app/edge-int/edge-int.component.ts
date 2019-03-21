import { Component, OnInit } from '@angular/core';

declare  var $:any;
@Component({
  selector: 'app-edge-int',
  templateUrl: './edge-int.component.html',
  styleUrls: ['./edge-int.component.scss']
})
export class EdgeIntComponent implements OnInit {

  constructor() { }

  defaultUrl="http://212.64.2.48/";

  getUrl(){
    $('.iframe').attr("src", this.defaultUrl);
  }

  ngOnInit() {
    this.getUrl();
  }
}
