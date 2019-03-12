import {Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
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

  selectOpc;

  show = true;//显示列表主界面
  loading = false;
  selectedService;//选中的service，赋值后会打开详情界面

  device_services;

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {
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
          'description': '华力电机测试',
          'id': '22223df234f',
          'name': '华力电机测试',
          'lastConnected': 0,
          'lastReported': 0,
          'operatingState': 'ENABLED',
          'labels': ['opc'],
          'addressable': {},
          'adminState': 'UNLOCKED',
          'opc': true,
          'serverip': '10.24.19.221',
          'servername': '',
          'opctype': 'DA',
          'frq': '100',
          'dbip': '10.24.19.221',
          'dbname': 'mom',
          'dbuser': 'admin',
          'dbpwd': 'admin'
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
        'description': '华力电机测试',
        'id': '22223df234f',
        'name': '华力电机测试',
        'lastConnected': 0,
        'lastReported': 0,
        'operatingState': 'ENABLED',
        'labels': ['opc'],
        'addressable': {},
        'adminState': 'UNLOCKED',
        'opc': true,
        'serverip': '10.24.19.221',
        'servername': '',
        'opctype': 'DA',
        'frq': 100,
        'dbip': '10.24.19.221',
        'dbname': 'mom',
        'dbuser': 'admin',
        'dbpwd': 'admin'
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
      this.selectOpc = selected;
      this.show = false;
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

  ngOnInit() {
    this.getService();
  }

}
