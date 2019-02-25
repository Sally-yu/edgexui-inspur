import {Component, OnInit, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {AjaxService} from '../ajax.service';


declare var $: any;

@Component({
  selector: 'app-device',
  templateUrl: './device.html',
  styleUrls: ['./device.scss']
})

export class DeviceComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private ajax: AjaxService,
  ) {
    this.defaultDevice = {
      'created': 0,
      'modified': 0,
      'origin': 0,
      'description': null,
      'id': null,
      'name': null,
      'adminState': 'UNLOCKED',
      'operatingState': 'ENABLED',
      'addressable': {
        'created': 0,
        'modified': 0,
        'origin': 0,
        'id': null,
        'name': null,
        'protocol': 'OTHER',
        'method': null,
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
      'lastConnected': 0,
      'lastReported': 0,
      'labels': [],
      'location': null,
      'service': {
        'created': 0,
        'modified': 0,
        'origin': 0,
        'description': null,
        'id': null,
        'name': null,
        'lastConnected': 0,
        'lastReported': 0,
        'operatingState': 'ENABLED',
        'labels': [],
        'addressable': {
          'created': 0,
          'modified': 0,
          'origin': 0,
          'id': null,
          'name': null,
          'protocol': 'HTTP',
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
        'adminState': 'UNLOCKED'
      },
      'profile': {
        'created': 0,
        'modified': 0,
        'origin': 0,
        'description': null,
        'id': null,
        'name': null,
        'manufacturer': null,
        'model': null,
        'labels': [],
        'objects': null,
        'deviceResources': [],
        'resources': [],
        'commands': []
      }
    };
  }

  // 请求头
  head = new HttpHeaders({
    'X-Session-Token': '21232f297a57a5a743894a0e4a801fc3',
    'X-Requested-With': 'XMLHttpRequest'
  });

  imgUrl=this.ajax.imgUrl;
  saveUrl=this.ajax.saveUrl;

  defaultDevice;
  loading = false;
  showlist = true;

  devices; // 设备列表，全部设备
  currDevice; // 选中的设备

  add() {
    this.currDevice = this.defaultDevice; // 一个空设备 无id
    this.showlist = false;
  }

  // 点选一行的详情，编辑详情
  rowSelected(deviceId) {
    if (deviceId) {
      this.currDevice = this.devices.filter(d => d.id === deviceId)[0]; // 当前选中设备
      this.showlist = false;
    }
  }

  // 在列表中删除
  delete(id) {
    if (id) {
      let url = '/core-metadata/api/v1/device/id/';
      this.http.delete(url + id, {headers: this.head}).subscribe(res => {
          this.message.success('删除成功');
          this.reload();
        },
        error1 => {
          console.log(error1);
          this.message.warning('删除失败:' + error1.error);
        });
    }
  }

  // 初次加载和刷新数据
  reload() {
    this.devices = null;
    this.getDevice();
  }

  // 获取设备列表
  getDevice() {
    let url = '/core-metadata/api/v1/device';
    let head = this.head;
    this.loading = true;
    this.http.get(url, {headers: head}).subscribe(response => {
        console.log('deviceresponse:' + response);
        this.devices = response;
        this.devices.forEach(function (e) {  // 处理标签数组 时间戳
          if (e.labels instanceof Array) {
            e.labels = e.labels.join(',');
          }
        });
        this.loading = false;
      },
      error1 => {
        this.message.warning(error1);
        console.log(error1);
        this.loading = false;
      });
  }

  // 详情页面关闭事件处理
  detailClose(event) {
    if (event) {
      this.currDevice = null;
      this.reload();
      this.showlist = true;
    }
  }

  // 详情页删除设备，传入新的
  detailNext(event) {
    if (event) {
      let url = '/core-metadata/api/v1/device';
      this.http.get(url, {headers: this.head}).subscribe(response => {
          console.log('deviceresponse:' + response);
          this.devices = response;
          this.devices.forEach(function (e) {  // 处理标签数组 时间戳
            if (e.labels instanceof Array) {
              e.labels = e.labels.join(',');
            }// 防止重复处理时报错
          });
          this.currDevice = this.devices.length > 0 ? this.devices[0] : this.defaultDevice;
        },
        error1 => {
          this.message.warning(error1);
          console.log(error1);
        });
    }
  }

  ngOnInit() {
    this.reload();
  }


}
