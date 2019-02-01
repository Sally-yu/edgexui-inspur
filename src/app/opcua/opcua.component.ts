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
    OracleHandle:'http://10.24.19.221:9990/Api/OracleHandle.ashx'
  };

  influxPort = 8086;
  opcTypes = ['DA', 'UA'];
  collectFrq = [
    100, 300, 500, 800, 1000, 1500
  ];

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }

  //连接测试
  pingTest() {
    var data = {
      'database': this.opcDevice.dbname,
      'inhost': this.opcDevice.dbip,
      'inport': 8086
    };
    this.http.post(this.opcUrl.InfluxHandle, JSON.stringify(data)).subscribe(res => {
      this.message.info('连接状态' + res);
    }, error1 => {
      this.message.warning('连接测试出错');
    });
  }

  //启动
  opcStart() {
    var opcaction = 'startcollect';
    var data = {
      database: this.opcDevice.dbname,
      inhost: this.opcDevice.dbip,
      opctype: this.opcDevice.opctype,
      opcip: this.opcDevice.serverip,
      inport: this.influxPort,
      serverurl: this.opcDevice.servername,
      frequency: this.opcDevice.frq,
      opcaction: opcaction
    };
    this.http.post(this.opcUrl.OpcHandle, JSON.stringify(data)).subscribe(res => {
      this.message.success('opc启动');
    }, error1 => {
      this.message.warning('opc启动失败:' + error1.error);
    });
  }

  //停止
  opcStop() {
    var opcaction = 'stopcollect';
    var data = {opcaction: opcaction};
    this.http.post(this.opcUrl.OpcHandle, JSON.stringify(data)).subscribe(res => {
      this.message.success('opc停止运行');
    }, error1 => {
      this.message.warning('opc停止时出错:' + error1.error);
    });
  }

  //删除配置
  delete(){

  }

  //查找服务器名称
  search() {
    var data = {opcip: this.opcDevice.serverip, opctype: this.opcDevice.opctype, opcaction: 'recognition'};
    this.http.post(this.opcUrl.OpcHandle,JSON.stringify(data)).subscribe(res=>{
      this.getServerName(res);
    })
  }

  //查找服务器名称
  getServerName(data){
    var servers=[];
    this.opcDevice.servername=null;
    if (!data) {
      servers.push({ "text": "未找到Server", "id": "NoServer" });
    }
    var self=this;
    data.forEach(function(e){
      var strs = []; //定义一数组
      strs = e.split("/"); //字符分割
      if (self.opcDevice.opctype === "DA") {
        servers.push({ "text": strs[3], "id": e });
      }
      else if(self.opcDevice.opctype==='UA') {
        servers.push({ "text": e, "id": e });
      }else{
        this.message.info('未定义的类型');
      }

    });
    // this.servername=servers;
    console.log(servers);
  }

  //返回
  close(){
    this.result.emit(true);
    this.opcDevice=null;
  }

  ngOnInit() {
  }

}
