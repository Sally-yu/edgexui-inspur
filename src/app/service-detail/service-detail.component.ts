import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {

  //请求头
  head = new HttpHeaders({
    'X-Session-Token': '21232f297a57a5a743894a0e4a801fc3',
    'X-Requested-With': 'XMLHttpRequest'
  });

  @Input() service;
  @Output() closed: EventEmitter<any> = new EventEmitter();
  @Output() deleteOne: EventEmitter<any> = new EventEmitter();

  avaAddressable;
  adminstats = ['UNLOCKED', 'LOCKED'];

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }

  //新增
  add() {
    this.service =  {
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
  }

  //保存，分新增和编辑
  save() {
    this.beforeSave();
    var url = '/core-metadata/api/v1/deviceservice';
    if (this.service.id) {//有id，修改保存
      this.http.put(url, JSON.stringify(this.service), {headers: this.head}).subscribe(res => {
        this.message.success('保存成功');
        //重新加载当前服务
        this.http.get(url + '/name/' + this.service.name, {headers: this.head}).subscribe(res => {
          this.service = res;
        }, error1 => {
          console.log(error1.error);
        });
      }, error1 => {
        this.message.warning('服务未保存' + error1.error);
      });
    } else if (!this.service.id) {//无id，新增保存
      this.http.post(url, JSON.stringify(this.service), {headers: this.head, responseType: 'text'}).subscribe(res => {
        //重新加载当前服务
        this.message.success('保存成功');this.http.get(url + '/name/' + this.service.name, {headers: this.head}).subscribe(res => {
          this.service = res;
        }, error1 => {
          console.log(error1.error);
        });
      }, error1 => {
        if (error1.statusText == 'Conflict') {
          this.message.info('服务已存在');
        } else {
          this.message.warning('保存失败' + error1.error);
        }
      });
    }
  }

  //删除
  delete() {
    if (this.service.id) {
      var url = '/core-metadata/api/v1/deviceservice/name/';
      this.http.delete(url + this.service.name, {headers: this.head}).subscribe(res => {
        this.message.success('删除成功');
        this.deleteOne.emit(true); //发射一个消息，已删除
      }, error1 => {
        this.message.warning('未能删除服务' + this.service.name + ':' + error1.error);
      });
    }
  }

  //返回关闭
  close() {
    this.service = null;
    this.closed.emit(true);
  }

  //获取寻址
  getAddressable() {
    // this.avaAddressable=this.testAdd;
    var url = '/core-metadata/api/v1/addressable';
    this.http.get(url, {headers: this.head}).subscribe(res => {
      this.avaAddressable = res;
    }, error1 => {
      console.log(error1.error);
      this.message.warning('未能获取寻址信息:' + error1.error);
    });
  }

  //保存前，调整数据
  beforeSave() {
    if (typeof (this.service.labels) == 'string') {
      this.service.labels = this.service.labels.split(',');//以英文逗号分隔为数组
    }
    this.service.modified = (new Date()).valueOf();//更新修改时间
    this.service.operatingState = this.service.operatingState ? 'ENABLED' : 'DISABLED';
  }

  ngOnInit() {
    this.getAddressable();
  }

}
