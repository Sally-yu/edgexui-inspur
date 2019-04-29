import { Component, OnInit, Input,EventEmitter, Output } from '@angular/core';
import {fromEvent} from "rxjs/index";
import { DomSanitizer } from '@angular/platform-browser'
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import {AjaxService} from '../../ajax.service';


declare var $:any;
@Component({
  selector: 'app-analysis-ui',
  templateUrl: './analysis-ui.component.html',
  styleUrls: ['./analysis-ui.component.scss']
})
export class AnalysisUIComponent implements OnInit {
  @Output() setParentmenu = new EventEmitter();

  @Input() analysisurl:string;
  constructor(
    private ajax: AjaxService,
    private http: HttpClient,
    private message: NzMessageService
  ) { }
  getanalysisUrl=this.ajax.getanalysisUrl;
  insertanalysisUrl=this.ajax.insertanalysisUrl;
  updateanalysisUrl=this.ajax.updateanalysisUrl;
  deleteanalysisUrl=this.ajax.deleteanalysisUrl;


  show:boolean = true;//显示列表主界面
  dataSet = [];//数组列表信息
  editData = {
              "name" :  "",
              "address"  :  "",
              "description":""
             };//正在编辑的信息
  isAddnewRow:boolean;//是否是在添加新行
  indexOfdataSet:number;//数组索引号

  btn=true;

  getUrl(url){
    $('.iframe').attr("src", url);
  }
  openUrl(data){
    var win=window.open(data.address,data.name)
    setTimeout(() => {
      win.document.title = data.name;
    }, 500);
  }
  changeUrl(address){
    this.getUrl(address);
    this.btn=true;
  }
  ngOnInit() {
    this.getplayUIlist();
  }
  addnewRow(){
    this.editData = {
      "name" :  "",
      "address"  :  "",
      "description":""
     };//正在编辑的信息
    this.isAddnewRow=true;
    this.show = false;//显示卡片界面
  }
  goback(){
    this.show = true;//显示列表主界面
    this.reFresh();
  }
  save(){
    var repeats=this.dataSet.filter(d => d.name === this.editData.name);
    if (this.isAddnewRow) {       //增加新行
      if (repeats.length!==0) {   //检查IP地址唯一性
        this.message.create("error", `名称与已存在重复`);
      } else {
        var arr=this.editData.address.split("?");
        if(arr.length>1){
          this.editData.address=arr[0]+"?refresh=1s&orgId=1&from=now-5m&to=now&kiosk"
        }
        this.dataSet.push(this.editData);
        this.addplayUIlist(this.editData);
        
      }
    } else {                      //编辑已有行
      if (repeats.length>1) {     //检查IP地址唯一性
        this.message.create("error", `名称与已存在重复`);
      } else {
        this.dataSet[this.indexOfdataSet]=this.editData;
        this.editplayUIlist(this.dataSet[this.indexOfdataSet]);
       
      }
    }
  }
  //编辑
  editRow(name:string) {
    var cx=this.dataSet.filter(d => d.name === name);
    this.editData=cx[0];
    this.indexOfdataSet=this.dataSet.indexOf(this.editData);
    this.show = false;//显示卡片界面
    this.isAddnewRow=false;
  }

  //删除
  deleteRow(name:string) {
    this.dataSet = this.dataSet.filter(d => d.name !== name);
    this.delplayUIlist(name);
  }
  //刷新
  reFresh(){
    this.getplayUIlist();
  }

  getplayUIlist(){
    this.http.get(this.getanalysisUrl)
      .subscribe(data => {
        this.dataSet=JSON.parse(JSON.stringify(data));
        //console.log(JSON.stringify(data));
      });
  }
  addplayUIlist(addData){
    this.http.post(this.insertanalysisUrl,addData)
      .subscribe(res => {
        this.goback();//显示列表主界面
        this.setParentmenu.emit();
      });
  }
  editplayUIlist(addData){
    this.http.post(this.updateanalysisUrl,addData)
      .subscribe(res => {
        this.goback();//显示列表主界面
        this.setParentmenu.emit();
      });
  }
  delplayUIlist(name:string){
    //console.log(name);
    this.http.post(this.deleteanalysisUrl,{"name":name}).
    subscribe(res => {
      this.goback();//显示列表主界面
      this.setParentmenu.emit();

    });
  }

}
