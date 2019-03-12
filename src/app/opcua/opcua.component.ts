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
 
  servergroup=new Array(20);
  savestrategy:string;
  servername:string;
  removestate:boolean=false;//判断是否显示删除数据库按钮
  addstate:boolean=false;//判断是否显示添加数据库按钮
  login =new Array();

  influxlist = [];//数组列表信息

  addInput() {
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
  removeInput() {
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
  isNotSelected(servername,node){
    if(servername===node){
      return true;
    }else{
      return this.servergroup.indexOf(node) === -1;
    }
  }
  strategyChange(strategy){
    this.servergroup.length=0;
    if(strategy==="集群版部署" && this.influxlist.length>2){
      this.addstate=true;
    }
  }

  //OpcUrl
  opcUrl = {
    RunorNot: 'http://10.24.19.221:9990/Api/RunorNot.ashx',
    InfluxHandle: 'http://10.24.19.221:9990/Api/InfluxHandle.ashx',
    OpcHandle: 'http://10.24.19.221:9990/Api/OpcHandle.ashx',
  };

  opcrun=false;
  influxPort = '8086';
  opcTypes = ['DA', 'UA'];
  collectFrq = [
    '100', '300', '500', '800', '1000', '1500'
  ];
  servernames = [];

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }

  runornot(b:boolean):boolean{       //   true更新采集频率，false不更新
    this.http.get(this.opcUrl.RunorNot,{responseType:'text'}).subscribe(res=>{
      var js=JSON.parse(res);
      this.opcrun=js.opcstate=='opcrun';
      if(this.opcrun&&b){
        this.opcDevice.frq=String(js.interval);//运行时赋采集频率
      }
      return this.opcrun;
    });
    return this.opcrun;
  }

  //保存数据存储策略配置信息
  saveDataconfig() {
    var datastrategy={ "savestrategy": this.savestrategy,
                        "login":JSON.stringify(this.login),
                        "servergroup":JSON.stringify(this.servergroup)
                      }  
    this.http.post('http://127.0.0.1:8090/assets/opcua/insert',datastrategy)
    .subscribe(res => {
     
    });
  }
  //启动
  opcStart() {
    this.saveDataconfig();
    var opcaction = 'startcollect';
    var data = new FormData();
    data.append('database', this.opcDevice.dbname);
    data.append('inhost', this.opcDevice.dbip);
    data.append('opctype', this.opcDevice.opctype);
    data.append('opcip', this.opcDevice.serverip);
    data.append('inport', this.influxPort);
    data.append('serverurl', this.opcDevice.servername);
    data.append('frequency', this.opcDevice.frq);
    data.append('opcaction', opcaction);
    this.http.post(this.opcUrl.OpcHandle, data, {responseType: 'text'}).subscribe(res => {
      if (res.indexOf('Error') > -1 || res.indexOf('Exception') > -1) {   //后端代码内部报错也返回200，会在请求成功的结果中
        this.message.warning('启动失败');
      } else {
        this.message.success(res);
        this.runornot(true);
      }
      console.log(res);
    }, error1 => {
      this.message.warning('启动失败', error1.error);
      console.log(error1.error);
    });
  }

  //停止
  opcStop() {
    if(!this.runornot(false)){
      this.message.info('该服务未启动，无需停止');
      return 0;
    }
    var opcaction = 'stopcollect';
    var data = new FormData();
    data.append('opcaction', opcaction);
    this.http.post(this.opcUrl.OpcHandle, data, {responseType: 'text'}).subscribe(res => {
      if (res.indexOf('Error') > -1 || res.indexOf('Exception') > -1) {   //后端代码内部报错也返回200，会在请求成功的结果中
        this.message.warning('停止失败');
      } else {
        this.message.success(res);
      }
      console.log(res);
    }, error1 => {
      this.message.warning('停止失败', error1.error);
      console.log(error1.error);
    });
  }

  //删除配置
  delete() {

  }

  //查找服务器名称
  search() {
    var data = new FormData();
    data.append('opcip', this.opcDevice.serverip);
    data.append('opctype', this.opcDevice.opctype);
    data.append('opcaction', 'recognition');
    this.http.post(this.opcUrl.OpcHandle, data, {responseType: 'text'}).subscribe(res => {
      console.log(res);
      this.opcDevice.servername = res;
      // this.message.success('查找服务端名称成功');
      this.runornot(true);
      this.getServerName(res.replace('[', '').replace(']', '').replace('"', '').split(','));
    }),error1=>{
      this.message.warning(error1.error);
    };
  }

  //查找服务器名称
  getServerName(data) {
    var servers = [];
    this.opcDevice.servername = '';
    this.servernames = [];
    if (!data) {
      // servers.push({ "text": "未找到Server", "id": "NoServer" });
    }
    var self = this;
    data.forEach(function (e) {
      if (self.opcDevice.opctype === 'DA' || self.opcDevice.opctype === 'UA') {
        self.servernames = [...self.servernames, e.replace('"', '')];
      } else {
        self.message.info('未定义的类型');
      }
    });
    this.opcDevice.servername = this.servernames[0];
    console.log(this.servernames);
  }

  //返回
  close() {
    this.result.emit(true);
    this.opcDevice = null;
  }
  //获取influx数据库配置信息列表
  getDatabaselist(){
    this.http.get('http://127.0.0.1:8090/assets/influx/get')
    .subscribe(data => {
      this.influxlist=JSON.parse(JSON.stringify(data));
    });
  }
  getDataconfig(){

    this.http.post('http://127.0.0.1:8090/assets/opcua/get',null)
    .subscribe(data => {
      var datastrategy=JSON.parse(JSON.stringify(data));
      this.savestrategy=datastrategy.savestrategy;
      this.login=JSON.parse(datastrategy.login);
      this.servergroup=JSON.parse(datastrategy.servergroup);
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
