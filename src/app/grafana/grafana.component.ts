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

  defaultUrl="http://172.31.1.27:9100/d/jgq_eofiz/she-bei-shu-zi-yun-wei-max?refresh=5s&orgId=1&kiosk";

  getUrl(){
    $('.iframe').attr("src", this.defaultUrl);
  }

  ngOnInit() {
    this.getUrl();
  }

}
