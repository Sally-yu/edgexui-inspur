import {Component, Input, OnInit} from '@angular/core';

declare var $:any;
@Component({
  selector: 'app-grafana',
  templateUrl: './grafana.component.html',
  styleUrls: ['./grafana.component.scss']
})
export class GrafanaComponent implements OnInit {

  constructor() { }

  btn=true;


  defaultUrl="http://localhost:8080/d/jgq_eofiz/yi-biao-pan-yan-shi?refresh=1m&orgId=1&from=1548314508355&to=1548314628355&theme=dark&&kiosk";

  getUrl(){
    $('.iframe').attr("src", this.defaultUrl);
  }

  ngOnInit() {
    this.getUrl();
  }

}
