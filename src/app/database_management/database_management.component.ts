import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import {AjaxService} from '../ajax.service';

@Component({
  selector: 'app-database_management',
  templateUrl: './database_management.component.html',
  styleUrls: ['./database_management.component.scss']
})
export class DatabaseComponent implements OnInit {

  getinfluxUrl=this.ajax.getinfluxUrl;
  insertinfluxUrl=this.ajax.insertinfluxUrl;
  updateinfluxUrl=this.ajax.updateinfluxUrl;
  deleteinfluxUrl=this.ajax.deleteinfluxUrl;
  getopcUrl=this.ajax.getopcUrl;
  influxhandleUrl=this.ajax.influxhandleUrl;

  show:boolean = false;//不显示编辑界面
  dataSet = [];//数组列表信息
  editData = {"servername" :  "",
              "serveraddress"  :  "",
              "database"  :  "",
              "serverport":"",
              "databasetype"  :  "时序数据库",
              "username"  :  "admin",
              "password"  :  "admin",
              "description":""};//正在编辑的信息
  isAddnewRow:boolean;//是否是在添加新行
  indexOfdataSet:number;//数组索引号

  addNewDatabase(){
    this.editData= {"servername" :  "",
    "serveraddress"  :  "",
    "database"  :  "",
    "serverport":"",
    "databasetype"  :  "时序数据库",
    "username"  :  "admin",
    "password"  :  "admin",
    "description":""};//正在编辑的信息
    this.isAddnewRow=true;
    this.show = true;//显示抽屉
  }
  goback(){
    this.show = false;//显示列表主界面
    this.reFresh();
  }
  // //连接测试
  // pingTest() {
  //   var data = new FormData();
  //   var influxHandleUrl;
  //   data.append('database', this.editData.database);
  //   data.append('inhost', this.editData.serveraddress);
  //   data.append('inport', '8086');
  //   influxHandleUrl="http://"+this.opchandleHost+this.influxhandleUrl;
  //   this.http.post(influxHandleUrl, data, {responseType: 'text'}).subscribe(res => {
  //     this.message.info(res);
  //   }, error1 => {
  //     this.message.warning('连接测试出错');
  //   });
  // }
  save(){
    var repeats=this.dataSet.filter(d => d.serveraddress === this.editData.serveraddress);
    if (this.isAddnewRow) {       //增加新行
      if (repeats.length!==0) {   //检查IP地址唯一性
        this.message.create("error", `服务器IP与已存在重复`);
      } else {
        this.dataSet.push(this.editData);
        this.addDatabaselist(this.editData);
      }
    } else {                      //编辑已有行
      if (repeats.length>1) {     //检查IP地址唯一性
        this.message.create("error", `服务器IP与已存在重复`);
      } else {
        this.dataSet[this.indexOfdataSet]=this.editData;
        this.editDatabaselist(this.dataSet[this.indexOfdataSet]);
      }
    }
  }
  //编辑
  editRow(serveraddress:string) {
    var cx=this.dataSet.filter(d => d.serveraddress === serveraddress);
    this.editData=cx[0];
    this.indexOfdataSet=this.dataSet.indexOf(this.editData);
    this.show = true;//显示抽屉界面
    this.isAddnewRow=false;
  }

  //删除
  deleteRow(serveraddress:string) {
    this.dataSet = this.dataSet.filter(d => d.serveraddress !== serveraddress);
    this.delDatabaselist(serveraddress);
  }
  //刷新
  reFresh(){
    this.getDatabaselist();
  }
  constructor(
    private ajax: AjaxService,
    private http: HttpClient,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.getDatabaselist();
    // this.getDataconfig();

  }
  // getDataconfig(){
  //   this.http.post(this.getopcUrl,null)
  //   .subscribe(data => {
  //     var datastrategy=JSON.parse(JSON.stringify(data));
  //     if(!this.ajax.checkNullObj(datastrategy)) {
  //       this.opchandleHost=datastrategy.opchost;  
  //      }           
  //   });
  // }
  getDatabaselist(){
    this.http.get(this.getinfluxUrl)
      .subscribe(data => {
        this.dataSet=JSON.parse(JSON.stringify(data));
      });
  }
  addDatabaselist(addData){
    this.http.post(this.insertinfluxUrl,addData)
      .subscribe(res => {
        this.goback();//显示列表主界面
      });
  }
  editDatabaselist(addData){
    this.http.post(this.updateinfluxUrl,addData)
      .subscribe(res => {
        this.goback();//显示列表主界面
      });
  }
  delDatabaselist(serveraddress:string){
    console.log(serveraddress);
    this.http.post(this.deleteinfluxUrl,{"serveraddress":serveraddress}).
    subscribe(res => {
      this.goback();//显示列表主界面
    });
  }

}
