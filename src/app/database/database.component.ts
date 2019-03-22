import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {
  selectedValue;
  mangourl="http://127.0.0.1:8090";
  //OpcUrl
  opcUrl = {
    RunorNot: 'http://10.24.19.221:9990/Api/RunorNot.ashx',
    InfluxHandle: 'http://10.24.19.221:9990/Api/InfluxHandle.ashx',
    OpcHandle: 'http://10.24.19.221:9990/Api/OpcHandle.ashx',
  };
  show:boolean = true;//显示列表主界面
  dataSet = [];//数组列表信息
  editData = {"servername" :  "",
              "serveraddress"  :  "",
              "database"  :  "",
              "databasetype"  :  "时序数据库",
              "username"  :  "admin",
              "password"  :  "admin"};//正在编辑的信息
  isAddnewRow:boolean;//是否是在添加新行
  indexOfdataSet:number;//数组索引号
  
  addNewDatabase(){
    this.editData={"servername" :  "",
                    "serveraddress" :  "",
                    "database"  :  "",
                    "databasetype"  :  "时序数据库",
                    "username"  :  "admin",
                    "password"  :  "admin"};//正在编辑的信息;
    this.isAddnewRow=true;
    this.show = false;//显示卡片界面
  }
  goback(){
    this.show = true;//显示列表主界面
  }
   //连接测试
   pingTest() {
    var data = new FormData();
    data.append('database', this.editData.database);
    data.append('inhost', this.editData.serveraddress);
    data.append('inport', '8086');
    this.http.post(this.opcUrl.InfluxHandle, data, {responseType: 'text'}).subscribe(res => {
      this.message.info(res);
    }, error1 => {
      this.message.warning('连接测试出错');
    });
  }
  save(){
    var repeats=this.dataSet.filter(d => d.serveraddress === this.editData.serveraddress);
    if (this.isAddnewRow) {       //增加新行
      if (repeats.length!==0) {   //检查IP地址唯一性
        this.message.create("error", `服务器IP与已存在重复`);
      } else {
        this.dataSet.push(this.editData);
        this.addDatabaselist(this.editData);
        this.show = true;//显示列表主界面
      }
    } else {                      //编辑已有行
      if (repeats.length>1) {     //检查IP地址唯一性
        this.message.create("error", `服务器IP与已存在重复`);
      } else {
        this.dataSet[this.indexOfdataSet]=this.editData;
        this.editDatabaselist(this.dataSet[this.indexOfdataSet]);
        this.show = true;//显示列表主界面
      }
    }
  }
   //编辑
   editRow(serveraddress:string) {
    var cx=this.dataSet.filter(d => d.serveraddress === serveraddress);
    this.editData=cx[0];
    this.indexOfdataSet=this.dataSet.indexOf(this.editData);
    this.show = false;//显示卡片界面
    this.isAddnewRow=false;
  }

  //删除
  deleteRow(id:string) {
    this.dataSet = this.dataSet.filter(d => d.key !== id);
    this.delDatabaselist(id);
  }
  //刷新
  reFresh(){
    this.getDatabaselist();
  }
  constructor(
    private http: HttpClient,
    private message: NzMessageService
    ) { }
  
  ngOnInit() {
    this.getDatabaselist();
  }
  getDatabaselist(){
    this.http.get(this.mangourl+'/assets/influx/get')
    .subscribe(data => {
      this.dataSet=JSON.parse(JSON.stringify(data));
    });
  }
  addDatabaselist(addData){
    this.http.post(this.mangourl+'/assets/influx/insert',addData)
    .subscribe(res => {
     
    });
  }
  editDatabaselist(addData){
    this.http.post(this.mangourl+'/assets/influx/edit',addData)
    .subscribe(res => {
     
    });
  }
  delDatabaselist(id){
    this.http.post(this.mangourl+'/assets/influx/delete',{"key":id}).
    subscribe(res => {
     
    });
  }

}
