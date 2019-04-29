import {Component, OnInit, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {AjaxService} from '../ajax.service';

@Component({
  selector: 'app-edge-scheduled',
  templateUrl: './edge-scheduled.component.html',
  styleUrls: ['./edge-scheduled.component.scss']
})
export class EdgeScheduledComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private ajax: AjaxService,
  ) {}
  defaultevent = {
    "created": 0,
    "modified": 0,
    "origin": 0,
    "name": "readTemperature",
    "schedule": "mqtt-5sec-schedule",
    "addressable": {
      "id":null,
      "created": 0,
      "modified": 0,
      "origin": 0,
      "name": "addressable-readTemperature",
      "protocol": "HTTP",
      "method": "GET",
      "address": "",
      "port": 49982,
      "path": "/api/v1/device/name/MQTT-test-device/gettemperature",
      "publisher": "",
      "user": "",
      "password": "",
      "topic": ""
    },
    "parameters": "",
    "service": "edgex-device-mqtt-go"
  };
  schedulevents=[];
  eventUrl = '/core-export/api/v1/scheduleevent';
  // 请求头
  head = new HttpHeaders({
    'X-Session-Token': '21232f297a57a5a743894a0e4a801fc3',
    'X-Requested-With': 'XMLHttpRequest'
  });
  schedulerlist = [];
  devicelist = [];
  devicename;
  commandcache;
  commandlist=[];
  commandname;
  deviceservicelist = [];
  methodData = ['POST', 'GET'];
  selectevent;
  show:boolean = true;//显示列表主界面
  isAddnewRow:boolean;//是否是在添加新行

  addNewRow(){
    this.selectevent=this.defaultevent;
    this.isAddnewRow=true;
    this.show = false;//显示卡片界面
  }
  goback(){
    this.show = true;//显示列表主界面
    this.reFresh();
  }
  //保存事件信息
  saveEventInfo(){
    this.selectevent.path="/api/v1/device/name/"+this.devicename+"/"+this.commandname
    if (this.isAddnewRow) {       //增加新行
      this.addEvent(this.selectevent); 
    } else {                      //编辑已有行
      this.editEvent(this.selectevent);
    }
  }

  //编辑
  editRow(id:string) {
    this.selectevent= this.schedulevents.filter(d => d.id == id)[0];
    var path =this.selectevent.addressable.path;
    //var path="/api/v1/device/name/MQTT-test-device/gettemperature"
    var arrPath=path.split("/");
    this.devicename=arrPath[5];
    this.commandname=arrPath[6];
    this.show = false;//显示卡片界面
    this.isAddnewRow=false;
  }

  //删除
  deleteRow(id:string,addrname) {
   this.deleteEvent(id,addrname);
  }
  //刷新
  reFresh(){
    this.loadEventCache();
  }
   //删除订阅输出信息
   deleteEvent(id,addrname) {
    var deletUrl = '/core-export/api/v1/scheduleevent/id/' + id;
    this.http.delete(deletUrl, {headers: this.head}).subscribe(response => {
      if (response) {
        var deladdrurl="/core-metadata/api/v1/addressable/name/" + addrname;
        this.http.delete(deladdrurl, {headers: this.head}).subscribe(response => {
          if (response) {
            this.schedulevents = this.schedulevents.filter(d => d.id != id);
            this.message.success('已删除事件');
          }else {
            this.message.warning('未能删除事件');
          }
        },
        error1 => {
          this.message.warning(error1);
        });
      } else {
        this.message.warning('未能删除事件');
      }
    },
    error1 => {
      this.message.warning(error1);
    })
  }
  //编辑订阅输出信息
  editEvent(eventobj) {
    var addrurl =  '/core-metadata/api/v1/addressable'
    this.http.put(addrurl, JSON.stringify(eventobj.addressable), {headers: this.head, responseType: 'text'}).subscribe(response => {
      if(response){
        let url = '/core-metadata/api/v1/scheduleevent';
        this.http.put(url, JSON.stringify(eventobj), {headers: this.head, responseType: 'text'}).subscribe(response => {
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
      }else{
        this.message.warning('编辑失败');
      } 
      },
      error1 => {
        this.message.warning(error1);
    }); 
}
  //新增订阅输出信息
  addEvent(eventobj) {
    var addrurl =  '/core-metadata/api/v1/addressable'
    this.http.post(addrurl, JSON.stringify(eventobj.addressable), {headers: this.head, responseType: 'text'}).subscribe(response => {
      eventobj.addressable.id=response;
      let url = '/core-metadata/api/v1/scheduleevent';
      this.http.post(url, JSON.stringify(eventobj), {headers: this.head, responseType: 'text'}).subscribe(response => {
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
      var devices = JSON.parse(JSON.stringify(response));
      ////console.log(JSON.stringify(response));
      devices.forEach(d => {
        this.devicelist.push(d.name);
      });
    },
    error1 => {
      this.message.warning(error1);
    });
}
 //加载已有的命令信息
 loadCommandCache() {
  let url = '/core-metadata/api/v1/command';
  let head = this.head;
  this.http.get(url, {headers: head}).subscribe(response => {
     this.commandcache = response;
     ////console.log(JSON.stringify(response));
     this.commandcache.forEach(d => {
        this.commandlist.push(d.name);
      });
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
     //console.log(JSON.stringify(response));
     service.forEach(d => {
        this.deviceservicelist.push(d.name);
      });
    },
    error1 => {
      this.message.warning(error1);
    });
}
 //加载已有的任务
 loadSchedulerCache() {
  let url = '/core-metadata/api/v1/schedule';
  let head = this.head;
  this.http.get(url, {headers: head}).subscribe(response => {
     var schedules =JSON.parse(JSON.stringify(response));
     //console.log(JSON.stringify(response));
     schedules.forEach(d => {
        this.schedulerlist.push(d.name);
      });
    },
    error1 => {
      this.message.warning(error1);
    });
}
 //加载已有的任务事件
 loadEventCache() {
  let url = '/core-metadata/api/v1/scheduleevent';
  let head = this.head;
  this.http.get(url, {headers: head}).subscribe(response => {
     this.schedulevents=JSON.parse(JSON.stringify(response));
     //console.log(JSON.stringify(response));
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
    this.loadCommandCache();
    this.loadDeviceCache();
    this.loadSchedulerCache();
    this.loadServiceCache();
    this.loadEventCache();
  }

}
