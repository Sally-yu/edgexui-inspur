import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import { and } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-opcua',
  templateUrl: './opcua.component.html',
  styleUrls: ['./opcua.component.scss']
})
export class OpcuaComponent implements OnInit {

  @Input() opcDevice;

  @Output() result: EventEmitter<any> = new EventEmitter();
  mangourl="http://10.24.20.7:8090";
  servergroup=new Array();
  servername:string;
  removestate:boolean=false;//判断是否显示删除数据库按钮
  addstate:boolean=false;//判断是否显示添加数据库按钮
  login =new Array();

  influxPort = '8086';
  opcTypes = ['DA', 'UA'];
  collectFrq = [
    '100', '300', '500', '800', '1000', '1500'
  ];
  servernames = [];
  influxlist = [];//数组列表信息
  datastrategy={ 
                "opcstate":   "false",
                "opctype":    "DA",
                "opchost":    "10.72.212.104",
                "serverurl":  "opcda://10.72.212.104/KEPware.KEPServerEx.V4",
                "interval":     "100",
                "savestrategy":  "单机版部署",
                "influxhost":    "172.31.1.27" ,
                "influxdatabase":"ExgeX",
                 "servergroup":   JSON.stringify(this.servergroup),
                 "login":         JSON.stringify(this.login)                
               }  

  addInput() {//集群部署时添加从数据库
    var number;
    if(this.login==null){
      number=2;
      this.removestate=false;
    }else{
      this.removestate=true;
      number = this.login.length + 2;
    }
    this.login.push({"name":"从数据库"+number,"id":number});
    if((this.login.length+2)<this.influxlist.length){
      this.addstate=true;
    }
    else{
      this.addstate=false;
    }
  }
  removeInput() {//集群部署时删除从数据库
      let i = this.login.length-1;
      this.servergroup.splice(i-1, 1);
      this.login.splice(i, 1);
      if(i>0){
        this.removestate=true;
      }else{
        this.removestate=false;
      }
      if((this.login.length+2)<this.influxlist.length){
        this.addstate=true;
      }
      else{
        this.addstate=false;
      }
  }
  isNotSelected(servername,node){//判断下拉选项是否已被选中，排除已选项
    if(servername===node){
      return true;
    }else{
      return this.servergroup.indexOf(node) === -1;
    }
  }
  strategyChange(strategy){//时序数据库策略发生改变时
    this.servergroup.length=0;
    if(strategy==="集群版部署" && this.influxlist.length>2){
      this.addstate=true;
    }
  }

  //OpcUrl
  opcUrl = {
    RunorNot: 'http://10.72.212.104:9990/Api/RunorNot.ashx',
    InfluxHandle: 'http://10.72.212.104:9990/Api/InfluxHandle.ashx',
    OpcHandle: 'http://10.72.212.104:9990/Api/OpcHandle.ashx',
  };
  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }

  // runornot(b:boolean):boolean{       //   true更新采集频率，false不更新
  //   this.http.get(this.opcUrl.RunorNot,{responseType:'text'}).subscribe(res=>{
  //     var js=JSON.parse(res);
  //     this.opcrun=js.opcstate=='opcrun';
  //     if(this.opcrun&&b){
  //       this.opcDevice.frq=String(js.interval);//运行时赋采集频率
  //     }
  //     return this.opcrun;
  //   });
  //   return this.opcrun;
  // }

  //保存数据存储策略配置信息
  saveDataconfig() {
    this.datastrategy.opcstate="false";
    this.datastrategy.servergroup=JSON.stringify(this.servergroup);
    this.datastrategy.login=JSON.stringify(this.login) ;
    var influxhost=this.influxlist.filter(d => d.servername === this.servergroup[0]);
    this.datastrategy.influxhost=influxhost[0].serveraddress;
    this.datastrategy.influxdatabase=influxhost[0].database;
    this.http.post(this.mangourl+'/assets/opcua/insert',this.datastrategy)
    .subscribe(res => {
      this.close()
    });

  }
  // //删除配置
  // delete() {

  // }

  //查找服务器名称
  search() {
    var data = new FormData();
    data.append('opcip',  this.datastrategy.opchost);
    data.append('opctype', this.datastrategy.opctype);
    data.append('opcaction', 'recognition');
    this.http.post(this.opcUrl.OpcHandle, data, {responseType: 'text'}).subscribe(res => {
      console.log(res);
      this.datastrategy.serverurl = res;
      // this.message.success('查找服务端名称成功');
      // this.runornot(true);
      this.getServerName(res.replace('[', '').replace(']', '').replace('"', '').split(','));
    }),error1=>{
      this.message.warning(error1.error);
    };
  }

  //查找服务器名称
  getServerName(data) {
    var servers = [];
    this.datastrategy.serverurl = '';
    this.servernames = [];
    if (!data) {
      // servers.push({ "text": "未找到Server", "id": "NoServer" });
    }
    var self = this;
    data.forEach(function (e) {
      if (self.datastrategy.opctype === 'DA' || self.datastrategy.opctype === 'UA') {
        self.servernames = [...self.servernames, e.replace('"', '')];
      } else {
        self.message.info('未定义的类型');
      }
    });
    this.datastrategy.serverurl = this.servernames[0];
    console.log(this.servernames);
  }

  //返回
  close() {
    this.result.emit(true);
    this.opcDevice = null;
  }
  //获取influx数据库配置信息列表
  getDatabaselist(){
    this.http.get(this.mangourl+'/assets/influx/get')
    .subscribe(data => {
      this.influxlist=JSON.parse(JSON.stringify(data));
    });
  }
  getDataconfig(){

    this.http.post(this.mangourl+'/assets/opcua/get',null)
    .subscribe(data => {
      this.datastrategy=JSON.parse(JSON.stringify(data));
      this.login=JSON.parse( this.datastrategy.login);
      this.servergroup=JSON.parse( this.datastrategy.servergroup);
      this.servernames[0]=this.datastrategy.serverurl;
      if(this.login.length>0){
        this.removestate=true;
      }
      if(this.servergroup.length<this.influxlist.length){
        this.addstate=true;
      }
    });
  }

  ngOnInit() {
    this.search();
    this.getDatabaselist();
    this.getDataconfig()
  }

}
