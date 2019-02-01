import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';

declare var $:any;
@Component({
  selector: 'app-export',
  templateUrl: './export.html',
  styleUrls: ['./export.scss'],
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

  defaultReg = {
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
    'filter': {},
    'encryption': {},
    'enable': true,
    'destination': 'MQTT_TOPIC'
  };
  selectedReg;//默认无id，用于新增或编辑
  exportReg;//显示输出信息

  registrations;//全部注册
  ip;//查看地址
  public chartData=[];//存储log信息

  wsClinet:WebSocket;//websocket协议

  showNewTab = false;//设备编辑侧边栏

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }



  //查看地址
  viewIp(id) {
    if (id) {
      this.ip = this.registrations.filter(d => d.id === id);
    }
  }

  //新增设备注册
  newReg() {
    this.selectedReg = this.defaultReg;
    this.openReg();

  }

  //编辑设备注册
  editReg(id) {
    if (id) {
      this.selectedReg = this.registrations.filter(d => d.id === id)[0];
      this.openReg();
    }
  }

  //保存按钮
  submitReg() {
    var type = this.selectedReg.id ? 'edit' : 'new';
    if (type == 'new') {
      this.http.post(this.regUrl, JSON.stringify(this.selectedReg), {headers: this.head, responseType: 'text'}).subscribe(response => {
        if (response) {
          this.closeReg();
          // this.registrations = [...this.registrations, this.selectedReg];
          this.getReg();
          this.message.success('保存成功');
        }
      });
    } else if (type == 'edit') {
      this.http.put(this.regUrl, JSON.stringify(this.selectedReg), {headers: this.head}).subscribe(response => {
        if (response) {
          this.closeReg();
          this.registrations = this.registrations.filter(d => d.id != this.selectedReg.id);
          this.registrations = [...this.registrations, this.selectedReg];
          this.message.success('保存成功');
        }
      });
    } else {
    }
  }

  //删除设备注册
  deleteReg(id) {
    if (id) {
      var deletUrl = '/core-export/api/v1/registration/id/' + id;
      this.http.delete(deletUrl, {headers: this.head}).subscribe(response => {
        if (response) {
          this.registrations = this.registrations.filter(d => d.id != id);
          this.message.success('已删除设备');
        } else {
          this.message.warning('未能删除设备');
        }
      });
    }
  }

  //取消删除
  cancelDelete() {
    this.message.info('操作已取消');
  }

  //打开新增，编辑使用的侧边栏
  openReg() {
    this.showNewTab = true;
  }

  //关闭设备编辑侧边栏面板，新增，
  closeReg() {
    this.showNewTab = false;
  }

  //请求获取已有设备注册
  getReg() {
    this.http.get(this.regUrl, {headers: this.head}).subscribe(response => {
      console.log(response);
      if (response) {
        this.registrations = response;
      }
    });
  }

  //查看某一设备的输出
  viewExport(id) {
    if(id){
      this.exportReg=this.registrations.filter(d=>d.id===id)[0];
      this.wsReceive();
    }
    else{
      this.message.warning('请选择有效的设备输出');
    }
  }

  //websokcet协议。收到结果
  wsReceive() {
    // var wsUrl = "ws://localhost:4000/ws?X-Session-Token=21232f297a57a5a743894a0e4a801fc3";
    var wsUrl="ws://" + document.location.hostname + ":4000/ws?X-Session-Token=" + window.sessionStorage.getItem("X_Session_Token");
    this.wsClinet=new WebSocket(wsUrl);
    const data=this.exportReg;
    console.log(JSON.stringify(this.exportReg.addressable));

    this.wsClinet.onopen=function () {
      $.ajax({
        url: '/api/v1/exportshow',
        type: 'POST',
        contentType: 'application/json',
        headers:{"X-Session-Token":"21232f297a57a5a743894a0e4a801fc3"},
        data: JSON.stringify(data.addressable),
        success: function () {
          console.log('Post已送达');
        }
      });
    };
    let self=this;

    this.wsClinet.onmessage=function (event) {
      self.pushChartData(event);
    }
  }

  //添加log信息
  pushChartData(event) {
    console.log(event.data);
    this.chartData=[...this.chartData,event.data];
    console.log('chartData:'+this.chartData);
  }

  ngOnInit() {
    this.selectedReg = this.defaultReg;
    this.getReg();

  }
}
