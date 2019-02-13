import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-opcua',
  templateUrl: './opcua.component.html',
  styleUrls: ['./opcua.component.scss']
})
export class OpcuaComponent implements OnInit {

  @Input() opcDevice;

  @Output() result: EventEmitter<any> = new EventEmitter();

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

  //连接测试
  pingTest() {
    var data = new FormData();
    data.append('database', this.opcDevice.dbname);
    data.append('inhost', this.opcDevice.dbip);
    data.append('inport', '8086');
    this.http.post(this.opcUrl.InfluxHandle, data, {responseType: 'text'}).subscribe(res => {
      this.message.info(res);
    }, error1 => {
      this.message.warning('连接测试出错');
    });
  }

  //启动
  opcStart() {
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

  ngOnInit() {
    this.search();
  }

}
