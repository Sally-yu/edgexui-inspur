import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import { forEach } from '@angular/router/src/utils/collection';

declare var $:any;
@Component({
  selector: 'app-cloud_subscribe',
  templateUrl: './cloud_subscribe.component.html',
  styleUrls: ['./cloud_subscribe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportComponent implements OnInit {

  regUrl = '/core-export/api/v1/registration';
  head=new HttpHeaders({
    'X-Session-Token':  '21232f297a57a5a743894a0e4a801fc3',
    'X-Requested-With':'XMLHttpRequest'
  });

  //addressable中的全部选项
  destinationData = ['MQTT_TOPIC', 'ZMQ_TOPIC', 'IOTCORE_MQTT', 'AZURE_MQTT', 'REST_ENDPOINT'];
  zipData = ['GZIP', 'ZIP', 'NONE'];
  fomartData = ['JSON', 'XML', 'CSV', 'SERIALIZED', 'IOTCORE_JSON', 'AZURE_JSON'];
  protcolData = ['TCP', 'HTTP', 'ZMQ', 'MAC', 'OTHER'];
  methodData = ['POST', 'GET'];
  algorithmData = ['AES', 'NONE'];
  zip = 'NONE';
  algorithm = 'NONE';
  devicelists=[];
  defaultExport = {
    'id': null,
    'created': 0,
    'modified': 0,
    'origin': 0,
    'name': null,
    'addressable': {
      'created': 0,
      'modified': 0,
      'origin': 0,
      'id': null,
      'name': null,
      'protocol': 'TCP',
      'method': 'POST',
      'address': null,
      'port': 0,
      'path': null,
      'publisher': null,
      'user': null,
      'password': null,
      'topic': null,
      'baseURL': null,
      'url': null
    },
    'format': 'JSON',
    'filter': {
      "deviceIdentifiers": [""]
      },
    'encryption': {},
    'enable': false,
    'destination': 'MQTT_TOPIC'
  };
  selectedExport;//默认无id，用于新增或编辑
  devices=[]; // 订阅列表，全部订阅
  registrations=[];//全部注册的订阅事件
  addressableinfo;//寻址信息


  showNewTab = true;//订阅编辑页面

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }



  //查看地址
  viewAddress(id) {
    if (id) {
      this.addressableinfo = this.registrations.filter(d => d.id === id);
    }
  }

  //新增订阅输出信息
  newExport() {
    this.selectedExport = this.defaultExport;
    this.openExport();

  }
  reFresh(){
    this.loadExportList();
  }
  //编辑订阅输出信息
  editRow(id) {
      this.selectedExport = this.registrations.filter(d => d.id === id)[0];
      this.openExport();
  }

  //保存按钮
  submitExport() {
    var type = this.selectedExport.id ? 'edit' : 'new';
    if (type == 'new') {
      this.addExport(this.selectedExport);
    } else if (type == 'edit') {
      this.editExport(this.selectedExport); 
    }
  }
  //启动
  startExport(exportobj){
    exportobj.enable=true;
    this.editExport(exportobj); 
  }
  //启动
  stopExport(exportobj){
    exportobj.enable=false;
    this.editExport(exportobj); 
  }
  //删除订阅输出信息
  deleteExport(id) {
    var deletUrl = '/core-export/api/v1/registration/id/' + id;
    this.http.delete(deletUrl, {headers: this.head}).subscribe(response => {
      if (response) {
        this.registrations = this.registrations.filter(d => d.id != id);
        this.message.success('已删除订阅');
      } else {
        this.message.warning('未能删除订阅');
      }
    },
    error1 => {
      this.message.warning(error1);
    });
  }
  //编辑订阅输出信息
  editExport(exportobj) {
    var index=this.registrations.indexOf(exportobj);
    var deletUrl = '/core-export/api/v1/registration/id/' + exportobj.id;
    this.http.delete(deletUrl, {headers: this.head}).subscribe(response => {
      if (response) {
        this.http.post(this.regUrl, JSON.stringify(exportobj), {headers: this.head, responseType: 'text'}).subscribe(response => {
          this.registrations[index].id=response;
          this.closeExport();
          this.message.success('保存成功');
        });
      }else{
        this.message.warning('编辑失败');
      } 
    },
    error1 => {
      this.message.warning(error1);      
    });
}
  //新增订阅输出信息
  addExport(exportobj) {
    this.http.post(this.regUrl, JSON.stringify(exportobj), {headers: this.head, responseType: 'text'}).subscribe(response => {
      if (response) {
        this.closeExport();
        this.message.success('保存成功');
      }else{
        this.message.warning('新增失败');
      }
    },
    error1 => {
      this.message.warning(error1);
    });
  }
  //取消删除
  cancelDelete() {
    this.message.info('操作已取消');
  }

  //打开新增编辑界面
  openExport() {
    this.showNewTab = false;
  }

  //关闭新增编辑界面
  closeExport() {
    this.showNewTab = true;
    this.loadExportList();
  }

  //请求获取已有的数据订阅输出列表
  loadExportList() {
    this.http.get(this.regUrl, {headers: this.head}).subscribe(response => {
      if (response) {
        this.registrations=[];
        this.registrations = JSON.parse(JSON.stringify(response));
      }
    },
    error1 => {
      this.message.warning(error1);
    });
  }
  //加载已有的订阅信息
  loadDevicesCache() {
      let url = '/core-metadata/api/v1/device';
      let head = this.head;
      this.http.get(url, {headers: head}).subscribe(response => {
          this.devices = JSON.parse(JSON.stringify(response));
          this.devices.forEach(d => {
            this.devicelists.push(d.name);
          });
        },
        error1 => {
          this.message.warning(error1);
        });
  }

  ngOnInit() {
    this.loadExportList();
    this.loadDevicesCache();
  }
}
