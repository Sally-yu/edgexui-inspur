import { Component, OnInit } from '@angular/core';
import {UploadFile} from 'ng-zorro-antd';
import {AjaxService} from '../ajax.service';

declare let $: any;
@Component({
  selector: 'app-rule',
  templateUrl: './rule.html',
  styleUrls: ['./rule.scss']
})
export class RuleComponent implements OnInit {

  constructor(
    private ajax :AjaxService,
  ) { }

  imgUrl=this.ajax.imgUrl;
  saveUrl=this.ajax.saveUrl;

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
