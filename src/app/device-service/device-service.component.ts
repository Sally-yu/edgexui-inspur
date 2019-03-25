import {Component, OnInit} from '@angular/core';
import {NzMessageService, toBoolean} from 'ng-zorro-antd';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {unescapeIdentifier} from '@angular/compiler';

@Component({
  selector: 'app-device-service',
  templateUrl: './device-service.component.html',
  styleUrls: ['./device-service.component.scss']
})
export class DeviceServiceComponent implements OnInit {

  //请求头
  head = new HttpHeaders({
    'X-Session-Token': '21232f297a57a5a743894a0e4a801fc3',
    'X-Requested-With': 'XMLHttpRequest'
  });
  mangourl="http://10.24.20.7:8090";
  influxPort = '8086';
  selectOpc;
  isSpinning=false;
  f=false;

  //OpcUrl
  opcUrl = {
    RunorNot: 'http://10.72.212.104:9990/Api/RunorNot.ashx',
    InfluxHandle: 'http://10.72.212.104:9990/Api/InfluxHandle.ashx',
    OpcHandle: 'http://10.72.212.104:9990/Api/OpcHandle.ashx',
  };
  show = true;//显示列表主界面
  loading = false;
  selectedService;//选中的service，赋值后会打开详情界面
  datastrategy={ 
    "opcstate":   "",
    "opctype":    "DA",
    "opchost":    "10.72.212.104",
    "serverurl":  "opcda://10.72.212.104/KEPware.KEPServerEx.V4",
    "interval":     "100",
    "savestrategy":  "单机版部署",
    "influxhost":    "172.31.1.27" ,
    "influxdatabase":"ExgeX",
    "servergroup":   "",
    "login":         ""                
  }  
  device_services;

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }
   //更新数据存储策略配置信息
   updateDataconfig(state) {
    this.datastrategy.opcstate=state;
    this.http.post(this.mangourl+'/assets/opcua/update',this.datastrategy)
    .subscribe(res => {
      this.isSpinning=eval(state.toLowerCase());
    });
  }
 // //启动
 startOPCServer() {
    var opcaction = 'startcollect';
    var data = new FormData();
    data.append('database', this.datastrategy.influxdatabase);
    data.append('inhost', this.datastrategy.influxhost);
    data.append('opctype', this.datastrategy.opctype);
    data.append('opcip', this.datastrategy.opchost);
    data.append('inport', this.influxPort);
    data.append('serverurl', this.datastrategy.serverurl);
    data.append('frequency', this.datastrategy.interval);
    data.append('opcaction', opcaction);
    this.http.post(this.opcUrl.OpcHandle, data, {responseType: 'text'}).subscribe(res => {
      if (res.indexOf('Error') > -1 || res.indexOf('Exception') > -1) {   //后端代码内部报错也返回200，会在请求成功的结果中
        this.message.warning('启动失败');
      } else {
        this.message.success(res);
        this.updateDataconfig("true");
        // this.runornot(true);
      }
      console.log(res);
    }, error1 => {
      this.message.warning('启动失败', error1.error);
      console.log(error1.error);
    });
  }

  //停止
  stopOPCServer() {
    if(!this.isSpinning){
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
        this.updateDataconfig("false");
        this.message.success(res);
      }
      console.log(res);
    }, error1 => {
      this.message.warning('停止失败', error1.error);
      console.log(error1.error);
    });
  }

  //获取服务
  getService() {
    // this.device_services = this.testServices;
    var url = '/core-metadata/api/v1/deviceservice';
    this.loading = true;
    this.http.get(url, {headers: this.head}).subscribe(res => {
      this.device_services = res;
      var  opcTest = {
          'created': 0,
          'modified': 0,
          'origin': 0,
          'description': 'OPC',
          'id': '22223df234f',
          'name': 'OPC设备服务',
          'lastConnected': 0,
          'lastReported': 0,
          'operatingState': 'ENABLED',
          'labels': ['OPC'],
          'addressable': {},
          'adminState': 'UNLOCKED',
          'opc': true,
        };
      this.device_services = [...this.device_services, opcTest];//添加伪数据测试
      console.log(this.device_services);
      this.device_services.forEach(function (e) {      //处理标签，时间戳
        if (e.labels instanceof Array) {
          e.labels = e.labels.join(',');
        }
        e.created = (new Date(e.created)).toLocaleString();
        e.modified = (new Date(e.modified)).toLocaleString();
        e.lastConnected = (new Date(e.lastConnected)).toLocaleString();
        e.lastReported = (new Date(e.lastReported)).toLocaleString();
      });
      this.loading = false;
    }, error1 => {
      this.message.warning('获取服务失败:' + error1.error);
      var  opcTest = {
        'created': 0,
        'modified': 0,
        'origin': 0,
        'description': 'OPC',
        'id': '22223df234f',
        'name': 'OPC设备服务',
        'lastConnected': 0,
        'lastReported': 0,
        'operatingState': 'ENABLED',
        'labels': ['OPC'],
        'addressable': {},
        'adminState': 'UNLOCKED',
        'opc': true,
      };
      this.device_services=[];
      this.device_services = [...this.device_services, opcTest];//添加伪数据测试
      this.loading = false;
    });
  }

  //新增
  newService() {
    this.selectedService = {
      'created': 0,
      'modified': 0,
      'origin': 0,
      'description': '',
      'id': '',
      'name': '',
      'lastConnected': 0,
      'lastReported': 0,
      'operatingState': 'ENABLED',
      'labels': [],
      'addressable': {},
      'adminState': 'UNLOCKED'
    };
    this.show = false;//关掉列表界面
  }

  //编辑
  edit(name) {
    var selected = this.device_services.filter(s => s.name === name)[0];
    if (name && selected.opc) {
      if(this.isSpinning){
        this.message.info('该服务在启动状态下禁止编辑');
        return 0;
      }else{
        this.selectOpc = selected;
        this.show = false;
      }
     
    } else if (name) {
      var url = '/core-metadata/api/v1/deviceservice/name/' + name;
      this.http.get(url, {headers: this.head}).subscribe(res => {
        this.selectedService = res;
        this.show = false;
      }, error1 => {
        this.message.warning('找不到该服务' + error1.error);
      });
    }
  }

  //删除
  delete(name) {
    if (name) {
      var url = '/core-metadata/api/v1/deviceservice/name/';
      this.http.delete(url + name, {headers: this.head}).subscribe(res => {
        this.message.success('服务已删除');
        this.getService();
      }, error1 => {
        this.message.warning('未能删除服务:' + error1.error);
      });
    }
  }

  //详情页关闭回调
  detailClosed(event) {
    if (!event) {
      return;
    }
    this.selectedService = null;//关闭detail界面
    this.selectOpc = null;
    this.getService();
    this.show = true;//打开list界面
  }

  detailNext(event) {
    if (event) {
      var url = '/core-metadata/api/v1/deviceservice';
      this.http.get(url, {headers: this.head}).subscribe(res => {
        this.device_services = res;
        var defalut = {
          'created': 0,
          'modified': 0,
          'origin': 0,
          'description': '',
          'id': '',
          'name': '',
          'lastConnected': 0,
          'lastReported': 0,
          'operatingState': 'ENABLED',
          'labels': [],
          'addressable': {},
          'adminState': 'UNLOCKED'
        };
        this.selectedService = this.device_services.length > 0 ? this.device_services[0] : defalut;
      }, error1 => {
        console.log(error1.error);
      });
    }
  }
  getDataconfig(){

    this.http.post(this.mangourl+'/assets/opcua/get',null)
    .subscribe(data => {
      this.datastrategy=JSON.parse(JSON.stringify(data));
      this.isSpinning=eval(this.datastrategy.opcstate.toLowerCase());
    });
  }
  ngOnInit() {
    this.getService();
    this.getDataconfig()
  }

}
