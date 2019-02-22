import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {NzMessageService, NzModalRef, NzModalService, UploadFile} from 'ng-zorro-antd';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss']
})
export class DeviceDetailComponent implements OnInit {


  @Input() device;
  @Input() head;

  @Output() result: EventEmitter<any> = new EventEmitter();
  @Output() deleteOne: EventEmitter<any> = new EventEmitter();

  srvUrl = '/core-metadata/api/v1/deviceservice'; // 获取服务url
  addUrl = '/core-metadata/api/v1/addressable'; // 获取addressable url
  proUrl = '/core-metadata/api/v1/deviceprofile'; // 获取profile url
  // imgUrl = window.location.protocol + window.location.host + '/assets/img'; //部署后 在本机的启动
  imgUrl = 'http://10.24.20.7:8090/assets/img';//go后台上传服务url
  saveUrl='http://10.24.20.7:8090/assets/img/save';//go后台保存图片地址到数据库连接

  fileList = [
    {
      uid: -1,
      name: '308TCR.png',
      status: 'done',
      url: this.imgUrl +'/'+'308TCR.png'   //go后台文件服务url  注意斜杠/
    }
  ];
  previewImage = '';
  previewVisible = false;

  avaServices; // 已注册的服务，全部服务
  avaProfiles; // 已有的全部profile
  avaAddress; // 已有的全部addressable
  testSevices = [
    {
      'created': 1546390652116,
      'modified': 1546390652116,
      'origin': 1546390652044,
      'description': '',
      'id': '5c2c0c7c9f8fc200015417a0',
      'name': 'edgex-device-virtual',
      'lastConnected': 0,
      'lastReported': 0,
      'operatingState': 'ENABLED',
      'labels': [
        'virtual'
      ],
      'addressable': {
        'created': 1546390652032,
        'modified': 0,
        'origin': 1546390651579,
        'id': '5c2c0c7c9f8fc2000154179f',
        'name': 'edgex-device-virtual',
        'protocol': 'HTTP',
        'method': 'POST',
        'address': 'edgex-device-virtual',
        'port': 49990,
        'path': '/api/v1/callback',
        'publisher': null,
        'user': null,
        'password': null,
        'topic': null,
        'baseURL': 'HTTP://edgex-device-virtual:49990',
        'url': 'HTTP://edgex-device-virtual:49990/api/v1/callback'
      },
      'adminState': 'UNLOCKED'
    },
    {
      'created': 1546409649408,
      'modified': 1546409649408,
      'origin': 1546409649405,
      'description': '',
      'id': '5c2c56b19f8fc200015417cf',
      'name': 'edgex-device-mqtt',
      'lastConnected': 0,
      'lastReported': 0,
      'operatingState': 'ENABLED',
      'labels': [],
      'addressable': {
        'created': 1546409649404,
        'modified': 0,
        'origin': 1546409649402,
        'id': '5c2c56b19f8fc200015417ce',
        'name': 'edgex-device-mqtt',
        'protocol': 'HTTP',
        'method': 'POST',
        'address': 'localhost',
        'port': 49982,
        'path': '/api/v1/callback',
        'publisher': null,
        'user': null,
        'password': null,
        'topic': null,
        'baseURL': 'HTTP://localhost:49982',
        'url': 'HTTP://localhost:49982/api/v1/callback'
      },
      'adminState': 'UNLOCKED'
    },
    {
      'created': 1547715025256,
      'modified': 1547715025256,
      'origin': 1547715025246,
      'description': '',
      'id': '5c4041d19f8fc20001386fe1',
      'name': 'device-random',
      'lastConnected': 0,
      'lastReported': 0,
      'operatingState': 'ENABLED',
      'labels': [],
      'addressable': {
        'created': 1547715025243,
        'modified': 0,
        'origin': 1547715025228,
        'id': '5c4041d19f8fc20001386fe0',
        'name': 'device-random',
        'protocol': 'HTTP',
        'method': 'POST',
        'address': 'device-random',
        'port': 49988,
        'path': '/api/v1/callback',
        'publisher': null,
        'user': null,
        'password': null,
        'topic': null,
        'baseURL': 'HTTP://device-random:49988',
        'url': 'HTTP://device-random:49988/api/v1/callback'
      },
      'adminState': 'UNLOCKED'
    }
  ];

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
  ) {
  }

  // 新增
  add() {
    this.device = {
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

  // 保存关闭，http申请保存
  save() {
    this.beforeSave();
    const url = '/core-metadata/api/v1/device';
    if (this.device.id) {// 编辑保存
      this.http.put(url, JSON.stringify(this.device), {headers: this.head, responseType: 'text'}).subscribe(res => {
        this.message.success('保存成功');
        // 重新加载当前设备
        this.http.get(url + '/name/' + this.device.name, {headers: this.head}).subscribe(res => {
          this.device = res;
        }, error1 => {
          console.log(error1.error);
        });

      }, error1 => {
        console.log(error1);
        this.message.info('保存失败:' + error1.error);
      });
    } else {// 新增保存
      this.http.post(url, JSON.stringify(this.device), {headers: this.head, responseType: 'text'}).subscribe(res => {
          this.message.success('保存成功');
          // 重新加载当前设备
          this.http.get(url + '/name/' + this.device.name, {headers: this.head}).subscribe(res => {
            this.device = res;
          }, error1 => {
            console.log(error1.error);
          });
        },
        error1 => {// 新增保存失败，换编辑保存
          if (error1.statusText == 'Conflict') {
            this.message.info('设备已存在');
          } else {
            this.message.warning('保存失败' + error1.error);
          }
        });
    }
  }

  // 关闭
  close() {
    this.device = null;
    this.result.emit(true);
  }

  // 删除
  delete() {
    if (this.device.id) {
      console.log(this.device);
      const url = '/core-metadata/api/v1/device/id/';
      this.http.delete(url + this.device.id, {headers: this.head}).subscribe(res => {
          if (res) {
            this.message.success('删除成功');
            this.deleteOne.emit(true); // 发射消息，删除之后显示个新的device
          }
        },
        error1 => {
          console.log(error1);
          this.message.warning('删除失败:' + error1.error);
        });
    }
  }

  // 替换服务名称后，替换对应的服务对象
  beforeSave() {
    if (this.device.service instanceof Array) {
      this.device.service = this.avaServices.filter(s => s.name === this.device.service.name)[0];
    }// 修改服务后替换
    if (this.device.addressable instanceof Array) {
      this.device.addressable = this.avaAddress.filter(a => a.name === this.device.addressable.name)[0];
    }// 修改寻址后替换
    if (this.device.profiles instanceof Array) {
      this.device.profiles = this.avaProfiles.filter(p => p.name === this.device.profiles.name)[0];
    }// 修改配置后替换
    if (typeof (this.device.labels) == 'string') {
      this.device.labels = this.device.labels.split(','); // 以英文逗号分隔为数组
    }
    this.device.modified = (new Date()).valueOf(); // 更新修改时间
    let imgkv={        //关联设备和图像
      'deviceid':this.device.id,
      'imgurl':this.fileList.length>0?this.fileList[0].name:''
    }
    this.http.post(this.saveUrl,imgkv).subscribe(res=>{
      console.log("save img in mongodb");
    })
    console.log(this.device);
  }

  // 获取所有可用设备服务
  getServices() {
    // this.avaServices=this.testSevices;
    this.http.get(this.srvUrl, {headers: this.head}).subscribe(response => {
      this.avaServices = response;
    });
    console.log(this.avaServices);
  }

  // 获取可用profile
  getProfiles() {
    this.http.get(this.proUrl, {headers: this.head}).subscribe(response => {
      this.avaProfiles = response;
    });
    console.log(this.avaProfiles);
  }

  // 获取全部addresable
  getAddress() {
    this.http.get(this.addUrl, {headers: this.head}).subscribe(response => {
      this.avaAddress = response;
    });
    console.log(this.avaAddress);
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
    console.log(this.fileList[0].status);
  }

  uploadChg(event){
    // console.log(event.file);
    console.log(event.fileList);
    // console.log(event.event);
  }

  getImg(){
    let j={
      'deviceid':this.device.id
    }
    this.http.post(this.imgUrl+'/deviceid',j).subscribe(res=>{
      this.fileList[0].name=res["Status"];  //返回信息在status中
      this.fileList[0].url=this.imgUrl+'/'+res["Status"];
    });
  }

  ngOnInit() {
    this.getServices();
    this.getAddress();
    this.getProfiles();
  }

}
