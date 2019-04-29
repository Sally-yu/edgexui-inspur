import { Component, OnInit,ViewChild } from '@angular/core';
import {AjaxService} from './ajax.service';
import {ajax} from 'rxjs/ajax';
import {NzMessageService, toBoolean} from 'ng-zorro-antd';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {unescapeIdentifier} from '@angular/compiler';
import { AnalysisUIComponent } from './edge_analysis/analysis-ui/analysis-ui.component';

declare var $:any;
// @ts-ignore
// @ts-ignore
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(AnalysisUIComponent) 
  private analysischild:AnalysisUIComponent;

  constructor(
    private ajax: AjaxService,
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }
  isCollapsed = false;
  width = 210;
  defaultUrl="http://10.24.20.45:8080/logout";
  title = 'Edge-Access';   //页面标题
  analysisurl='';//分析展示网址
  dataSet=[{
    "name" :  "",
    "address"  :  "",
    "description":""
   }];
  tabs = ['欢迎'];
  fileimgUrl=this.ajax.fileimgUrl;
  logoPath=this.fileimgUrl+'/'+'logo-big.png';
  framePath=this.fileimgUrl+'/'+'framework.png';
  content='欢迎';
  collapsed=false;
  getanalysisUrl=this.ajax.getanalysisUrl;

  //切换菜单展开
  toggleColl(){
    this.collapsed=!this.collapsed;
  }

  logout(){
    // var loc = window.location;
    // var href= (loc.protocol + '//' + loc.hostname + ':48081/api/v1/deviceprofile') ;
    // window.location.href=href;
  }

  visible = false;
  drawerTitle='User';
  open(func:string): void {
    this.drawerTitle=func;
    this.visible = true;
  }
  getplayUIlist(){
    this.http.get(this.getanalysisUrl)
      .subscribe(data => {
        this.dataSet=JSON.parse(JSON.stringify(data));
        console.log(JSON.stringify(data));
      });
  }
  close(): void {
    this.visible = false;
  }
  isemptyofArray(arr){
   if(arr.length>0){
    return true;
   }else{
    return false;
   }  
  }
  setAnalysis(data,state){
    this.content="边缘分析";
    setTimeout(() => {
      if(state=="true"){
        this.analysisurl=data.address;
        this.analysischild.getUrl(this.analysisurl);//调用子组件方法
      }else{
        this.analysischild.getUrl(this.defaultUrl);//调用子组件方法
      }   
    }, 50);
  }
  ngOnInit() {
    this.getplayUIlist();
  }
}
