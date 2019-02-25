import { Component, OnInit } from '@angular/core';
import {UploadFile} from 'ng-zorro-antd';

declare let $: any;
@Component({
  selector: 'app-rule',
  templateUrl: './rule.html',
  styleUrls: ['./rule.scss']
})
export class RuleComponent implements OnInit {

  constructor() { }

  imgUrl = 'http://10.24.20.7:8090/assets/img';//go后台上传服务url

  uploadChg(event){
    console.log(event.file);
    console.log(event.fileList);
    console.log(event.event);
  }

  ngOnInit() {
    $( ".draggable" ).draggable({ containment: "#container", scroll: false });
    $( ".resizable" ).resizable({ containment: "#container",aspectRatio: true});
    $( "#img").draggable({ containment: "#container", scroll: false });

  }

}
