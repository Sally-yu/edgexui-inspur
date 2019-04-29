import {Component, OnInit, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {AjaxService} from '../ajax.service';


@Component({
  selector: 'app-device_register',
  templateUrl: './device_register.component.html',
  styleUrls: ['./device_register.component.scss']
})

export class DeviceComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private ajax: AjaxService,
  ) {}
  defaultdevice = {
    'created': 0,
    'modified': 0,
    'origin': 0,
    'description': null,
    'id': null,
    'name': null,
    'adminState': 'UNLOCKED',
    'operatingState': 'ENABLED',
    'addressable': {
      'id': null,
      'created': 0,
      'modified': 0,
      'origin': 0,
      'name': null,
      'protocol': 'OTHER',
      'method': null,
      'address': null,
      'port': 1883,
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
      'name': null,
    },
    'profile': {
      'name': null,
    }
  };
  // 请求头
  head = new HttpHeaders({
    'X-Session-Token': '21232f297a57a5a743894a0e4a801fc3',
    'X-Requested-With': 'XMLHttpRequest'
  });
  opertionstates = ['ENABLED', 'DISABLED'];
  adminstates = ['LOCKED', 'UNLOCKED'];
  deviceservicelist = [];
  profilelist = [];
  protcolData = ['TCP', 'HTTP'];
  methodData = ['POST', 'GET'];
  selectdevice={};
  show:boolean = true;//显示列表主界面
  isAddnewRow:boolean;//是否是在添加新行
  devices=[]; // 设备列表，全部设备
 
  addNewRow(){
    this.selectdevice=this.defaultdevice;
    this.isAddnewRow=true;
    this.show = false;//显示卡片界面
  }
  goback(){
    this.show = true;//显示列表主界面
    this.reFresh();
  }
  //保存事件信息
  saveDeviceInfo(){
    
    if (this.isAddnewRow) {       //增加新行
     this.addDevice(this.selectdevice)
    } else {                      //编辑已有行
      this.editDevice(this.selectdevice)
    }
  }

  //编辑
  editRow(id:string) {
    this.selectdevice= this.devices.filter(d => d.id == id)[0];
    this.show = false;//显示卡片界面
    this.isAddnewRow=false;
  }

  //删除
  deleteRow(id:string,addrname) {
    this.deleteDevice(id,addrname);
  }
  //刷新
  reFresh(){
    this.loadDeviceCache();
  }
  //删除订阅输出信息
  deleteDevice(id,addrname) {
    var delseviceUrl = '/core-metadata/api/v1/device/id/' + id;
    this.http.delete(delseviceUrl, {headers: this.head}).subscribe(response => {
      if (response) {
        var deladdrurl="/core-metadata/api/v1/addressable/name/" + addrname;
        this.http.delete(deladdrurl, {headers: this.head}).subscribe(response => {
          if (response) {
            this.devices = this.devices.filter(d => d.id != id);
            this.message.success('已删除设备');
          }else {
            this.message.warning('未能删除设备寻址信息');
          }
        },
        error1 => {
          this.message.warning(error1);
        });
      } else {
        this.message.warning('未能删除设备');
      }
    },
    error1 => {
      this.message.warning(error1);
    });
  }
  //编辑设备信息
  editDevice(deviceobj) {
    var addrurl =  '/core-metadata/api/v1/addressable'
    var deviceurl = '/core-metadata/api/v1/device';
    this.http.put(addrurl, JSON.stringify(deviceobj.addressable), {headers: this.head, responseType: 'text'}).subscribe(response => {
     if(response){
      this.http.put(deviceurl, JSON.stringify(deviceobj), {headers: this.head, responseType: 'text'}).subscribe(response => {
        if (response) {
          this.goback();
          this.message.success('保存成功');
        }else{
          this.message.warning('编辑失败');
        }
      },
      error1 => {
        this.message.warning(error1);
      });
     }
    },
    error1 => {
      this.message.warning(error1);
    });   
  }
  //新增设备信息
  addDevice(deviceobj) {
    var addrurl =  '/core-metadata/api/v1/addressable'
    var deviceurl = '/core-metadata/api/v1/device';
    this.http.post(addrurl, JSON.stringify(deviceobj.addressable), {headers: this.head, responseType: 'text'}).subscribe(response => {
      deviceobj.addressable.id=response;
      this.http.post(deviceurl, JSON.stringify(deviceobj), {headers: this.head, responseType: 'text'}).subscribe(response => {
          this.goback();
          this.message.success('保存成功');
      },
        error1 => {
          this.message.warning(error1);
      });
    },
    error1 => {
      this.message.warning(error1);
    });
    
  }
  //加载已有的设备信息
  loadDeviceCache() {
  let url = '/core-metadata/api/v1/device';
  let head = this.head;
  this.http.get(url, {headers: head}).subscribe(response => {
      //console.log("device:"+JSON.stringify(response));
      this.devices = JSON.parse(JSON.stringify(response));
    },
    error1 => {
      this.message.warning(error1);
    });
  }

  //加载已有的设备服务
  loadServiceCache() {
  let url = '/core-metadata/api/v1/deviceservice';
  let head = this.head;
  this.http.get(url, {headers: head}).subscribe(response => {
    var service = JSON.parse(JSON.stringify(response));
    //console.log("services:"+JSON.stringify(response));
    service.forEach(d => {
        this.deviceservicelist.push(d.name);
      });
    },
    error1 => {
      this.message.warning(error1);
    });
  }
//加载已有的配置文件
loadProfileCache() {
  let url = '/core-metadata/api/v1/deviceprofile';
  let head = this.head;
  this.http.get(url, {headers: head}).subscribe(response => {
    var profile = JSON.parse(JSON.stringify(response));
    //console.log("profile:"+JSON.stringify(response));
    profile.forEach(d => {
        this.profilelist.push(d.name);
      });
    },
    error1 => {
      this.message.warning(error1);
    });
  }
  
  //取消删除
  cancelDelete() {
  this.message.info('操作已取消');
  }
  ngOnInit() {
    this.loadDeviceCache();
    this.loadServiceCache();
    this.loadProfileCache();
  }

}
