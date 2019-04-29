import {Component, OnInit} from '@angular/core';
import {AjaxService} from '../../ajax.service';
import {NzMessageService, toBoolean} from 'ng-zorro-antd';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {unescapeIdentifier} from '@angular/compiler';

@Component({
  selector: 'app-edgex_service',
  templateUrl: './edgex_service.component.html',
  styleUrls: ['./edgex_service.component.scss']
})
export class Edgex_ServiceComponent implements OnInit {

  constructor(
    private ajax: AjaxService,
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }

  // 请求头
  head = new HttpHeaders({
    'X-Session-Token': '21232f297a57a5a743894a0e4a801fc3',
    'X-Requested-With': 'XMLHttpRequest'
  });
  selectservice;//选中的service，赋值后会打开详情界面
  deviceservices=[];
  opertionstates = ['ENABLED', 'DISABLED'];
  adminstates = ['LOCKED', 'UNLOCKED'];
  protcolData = ['TCP', 'HTTP'];
  methodData = ['POST', 'GET'];

  show:boolean = true;//显示列表主界面
  isAddnewRow:boolean;//是否是在添加新行

  addNewRow(){
    this.isAddnewRow=true;
    this.show = false;//显示卡片界面
  }
  goback(){
    this.show = true;//显示列表主界面
    this.reFresh();
  }
  //保存事件信息
  saveServiceInfo(){
    if (this.isAddnewRow) {       //增加新行
      this.addService(this.selectservice); 
    } else {                      //编辑已有行
      this.editService(this.selectservice);
    }
  }

  //编辑
  editRow(id:string) {
    this.selectservice= this.deviceservices.filter(d => d.id == id)[0];
    this.show = false;//显示卡片界面
    this.isAddnewRow=false;
  }

  //删除
  deleteRow(id:string,addrname) {
   this.deleteService(id,addrname);
  }
  //刷新
  reFresh(){
    this.loadServiceCache();
  }
   //删除订阅输出信息
   deleteService(id,addrname) {
    var deletUrl = '/core-export/api/v1/deviceservice/id/' + id;
    this.http.delete(deletUrl, {headers: this.head}).subscribe(response => {
      if (response) {
        var deladdrurl="/core-metadata/api/v1/addressable/name/" + addrname;
        this.http.delete(deladdrurl, {headers: this.head}).subscribe(response => {
          if (response) {
            this.deviceservices = this.deviceservices.filter(d => d.id != id);
            this.message.success('已删除设备任务');
          }else {
            this.message.warning('未能删除设备任务');
          }
        },
        error1 => {
          this.message.warning(error1);
        });
      } else {
        this.message.warning('未能删除设备任务');
      }
    },
    error1 => {
      this.message.warning(error1);
    })
  }
  //编辑订阅输出信息
  editService(serviceobj) {
    var addrurl =  '/core-metadata/api/v1/addressable'
    this.http.put(addrurl, JSON.stringify(serviceobj.addressable), {headers: this.head, responseType: 'text'}).subscribe(response => {
      if(response){
        let url = '/core-metadata/api/v1/deviceservice';
        this.http.put(url, JSON.stringify(serviceobj), {headers: this.head, responseType: 'text'}).subscribe(response => {
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
  addService(serviceobj) {
    var addrurl =  '/core-metadata/api/v1/addressable'
    this.http.post(addrurl, JSON.stringify(serviceobj.addressable), {headers: this.head, responseType: 'text'}).subscribe(response => {
      serviceobj.addressable.id=response;
      let url = '/core-metadata/api/v1/deviceservice';
      this.http.post(url, JSON.stringify(serviceobj), {headers: this.head, responseType: 'text'}).subscribe(response => {
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
 //加载已有的设备服务
 loadServiceCache() {
  let url = '/core-metadata/api/v1/deviceservice';
  let head = this.head;
  this.http.get(url, {headers: head}).subscribe(response => {
    this.deviceservices= JSON.parse(JSON.stringify(response));
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
    this.loadServiceCache();
  }
}
