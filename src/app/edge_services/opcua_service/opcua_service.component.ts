import {Component, OnInit} from '@angular/core';
import {AjaxService} from '../../ajax.service';
import {NzMessageService, toBoolean} from 'ng-zorro-antd';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {unescapeIdentifier} from '@angular/compiler';

declare var $:any;
@Component({
  selector: 'app-opcua_service',
  templateUrl: './opcua_service.component.html',
  styleUrls: ['./opcua_service.component.scss']
})
export class Opcua_ServiceComponent implements OnInit {
  // 请求头
  head = new HttpHeaders({
    'X-Session-Token': '21232f297a57a5a743894a0e4a801fc3',
    'X-Requested-With': 'XMLHttpRequest'
    
  });
  show:boolean = true;//显示列表主界面
  servername:string;
  removestate:boolean=false;//判断是否显示删除数据库按钮
  addstate:boolean=false;//判断是否显示添加数据库按钮
  isemptyofmongo=false;//判断数据库中是否有配置数据
  opcTypes = ['DA', 'UA'];
  collectFrq = [
    '100', '300', '500', '800', '1000', '1500'
  ];
  servernames = ["opcda://10.25.11.197/KEPware.KEPServerEx.V4"];
  influxlist = [];//时序数据库数组列表信息
  opcconfiginfo={ 
                "id" :"",
                "servername": "",
                "serveraddress": "10.25.11.197", 
                "serverlocation": "305", 
                "description":"",
                "opcstate":   "false",
                "opctype":    "DA",
                "opchost":    "10.25.11.197",
                "serverurl":  "",
                "interval":     "100",
                "savestrategy":  "单机版部署",
                 "servergroup":   [],
                 "login":         []               
               }    
  dataSet = [];//opc客户端数组列表信息            
  getopcUrl=this.ajax.getopcUrl;
  updateopcUrl=this.ajax.updateopcUrl;
  opchandleUrl=this.ajax.opchandleUrl;
  insertopcUrl=this.ajax.insertopcUrl;
  getinfluxUrl=this.ajax.getinfluxUrl; 
  deleteopcUrl=this.ajax.deleteopcUrl;
  influxhandleUrl=this.ajax.influxhandleUrl;

  isAddnewRow:boolean;//是否是在添加新行
  indexOfdataSet:number;//数组索引号

  constructor(
    private ajax: AjaxService,
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }
  //为a标签禁止 or 开启 点击事件
  attrDisability(id:string,state){
    if(state){
      $("#"+id).attr("disabled",false).css("pointer-events","auto"); 
      $("#"+id).css({ opacity: 1});
    }else{
      $("#"+id).attr("disabled",true).css("pointer-events","none");
      $("#"+id).css({ opacity: 0.2});
    }
  }
 // //启动
 startOPCServer(id:string,serveraddress:string) {
    this.attrDisability(id,false);
    var saveobj=this.dataSet.filter(d => d.serveraddress === serveraddress);
    var servername=JSON.parse(saveobj[0].servergroup)[0];
    var influx=this.influxlist.filter(d => d.servername === servername)
    console.log(JSON.stringify(influx));
    var opcaction = 'startcollect';
    var data = new FormData();
    data.append('opctype', saveobj[0].opctype);
    data.append('opcip', saveobj[0].opchost)
    data.append('serverurl', saveobj[0].serverurl);
    data.append('frequency', saveobj[0].interval);
    data.append('opcaction', opcaction);
    data.append('inhost', influx[0].serveraddress);
    data.append('inport', influx[0].serverport);
    data.append('username', influx[0].username);
    data.append('password', influx[0].password);
    data.append('database', influx[0].database);
    console.log(data);
    var opcHandleUrl="http://"+serveraddress+this.opchandleUrl;
    var influxHandleUrl="http://"+serveraddress+this.influxhandleUrl;
    this.http.post(influxHandleUrl, data, {responseType: 'text'}).subscribe(res => {
      var state=res.search("连接错误") != -1 ;
      if(state){
        this.message.info(res);
        this.attrDisability(id,true);
      }else{
        this.http.post(opcHandleUrl, data, {responseType: 'text'}).subscribe(res => {
              if (res.indexOf('Error') > -1 || res.indexOf('Exception') > -1) {   //后端代码内部报错也返回200，会在请求成功的结果中
                this.message.warning('启动失败');
                this.attrDisability(id,true);
              } else {
                this.message.success(res);
                saveobj[0].opcstate="true";
                this.updateOpcconfiglist(saveobj[0]);//应设置状态变化
              }
            }, error1 => {
              this.attrDisability(id,true);
              this.message.warning('启动失败', error1.error);
            });
      }
  
    }, error1 => {
      this.message.warning('数据库连接出错');
      this.attrDisability(id,true);
    });
   
  }

  //停止
  stopOPCServer(serveraddress:string) {
    $(this).removeAttr("onclick");
    var saveobj=this.dataSet.filter(d => d.serveraddress === serveraddress);
    var opcaction = 'stopcollect';
    var data = new FormData();
    data.append('opcaction', opcaction);
    var opcHandleUrl="http://"+serveraddress+this.opchandleUrl;
    this.http.post(opcHandleUrl, data, {responseType: 'text'}).subscribe(res => {
      if (res.indexOf('Error') > -1 || res.indexOf('Exception') > -1) {   //后端代码内部报错也返回200，会在请求成功的结果中
        this.message.warning('停止失败');
      } else {
        saveobj[0].opcstate="false";
        this.updateOpcconfiglist(saveobj[0]);//应设置状态变化
        this.message.success(res);
      }
      console.log(res);
    }, error1 => {
      this.message.warning('停止失败', error1.error);
      console.log(error1.error);
    });
  }

  addNewOpcRow(){
    this.opcconfiginfo={ 
      "id" :"",
      "servername": "",
      "serveraddress": "", 
      "serverlocation": "", 
      "description":"",
      "opcstate":   "false",
      "opctype":    "DA",
      "opchost":    "",
      "serverurl":  "",
      "interval":     "100",
      "savestrategy":  "单机版部署",
       "servergroup":   [],
       "login":         []               
     };    
    this.isAddnewRow=true;
    this.show = false;//显示卡片界面
  }
  goback(){
    this.show = true;//显示列表主界面
    this.reFresh();
  }
  //保存opc及数据存储策略配置信息
  saveOpcconfig(){
    var repeats=this.dataSet.filter(d => d.serveraddress === this.opcconfiginfo.serveraddress);
    var saveobj={ "id":"", "servername": "","serveraddress": "", "serverlocation": "", 
    "description":"", "opcstate": "", "opctype": "", "opchost": "","serverurl":  "",
    "interval": "","savestrategy":"","servergroup": "","login": ""                
     };           
    if (this.isAddnewRow) {       //增加新行
      if (repeats.length!==0) {   //检查IP地址唯一性
        this.message.create("error", `服务器IP与已存在重复`);
      } else {
        saveobj=this.toSaveableobj(saveobj,this.opcconfiginfo);
        this.dataSet.push(saveobj);
        this.addOpcconfiglist(saveobj);
      }
    } else {                      //编辑已有行
      if (repeats.length>1) {     //检查IP地址唯一性
        this.message.create("error", `服务器IP与已存在重复`);
      } else {
        this.dataSet[this.indexOfdataSet]=this.toSaveableobj(this.dataSet[this.indexOfdataSet],this.opcconfiginfo);
        this.updateOpcconfiglist(this.dataSet[this.indexOfdataSet]);
      }
    }
  }

  //编辑
  editRow(serveraddress:string) {
    var saveobj=this.dataSet.filter(d => d.serveraddress === serveraddress);
    if(this.toBoolean(this.opcconfiginfo.opcstate)){
      this.message.info('该服务在启动状态下禁止编辑');
      return 0;
    }else{
      this.opcconfiginfo=this.toEditableobj(this.opcconfiginfo,saveobj[0]);
      this.servernames[0]=this.opcconfiginfo.serverurl;
      if(this.opcconfiginfo.login.length>0){
        this.removestate=true;
      }
      if(this.opcconfiginfo.servergroup.length<this.influxlist.length){
        this.addstate=true;
      }  
      this.indexOfdataSet=this.dataSet.indexOf(saveobj[0]);
      this.show = false;//显示卡片界面
      this.isAddnewRow=false;
    }  
  }

  //删除
  deleteRow(serveraddress:string) {

    this.dataSet = this.dataSet.filter(d => d.serveraddress !== serveraddress);
    this.delOpcconfiglist(serveraddress);
  }
  //刷新
  reFresh(){
    this.getOpcconfiglist();
  }

  
  addInput() {//集群部署时添加从数据库
    var number;
    if(this.opcconfiginfo.login==null){
      number=2;
      this.removestate=false;
    }else{
      this.removestate=true;
      number = this.opcconfiginfo.login.length + 2;
    }
    this.opcconfiginfo.login.push({"name":"从数据库"+number,"id":number});
    if((this.opcconfiginfo.login.length+2)<this.influxlist.length){
      this.addstate=true;
    }
    else{
      this.addstate=false;
    }
  }
  removeInput() {//集群部署时删除从数据库
      let i = this.opcconfiginfo.login.length-1;
      this.opcconfiginfo.servergroup.splice(i-1, 1);
      this.opcconfiginfo.login.splice(i, 1);
      if(i>0){
        this.removestate=true;
      }else{
        this.removestate=false;
      }
      if((this.opcconfiginfo.login.length+2)<this.influxlist.length){
        this.addstate=true;
      }
      else{
        this.addstate=false;
      }
  }
  //将字符串转为bool变量
  toBoolean(state:string){
    return eval(state.toLowerCase());
  }
  isNotSelected(servername,node){//判断下拉选项是否已被选中，排除已选项
    if(servername===node){
      return true;
    }else{
      return this.opcconfiginfo.servergroup.indexOf(node) === -1;
    }
  }
  strategyChange(strategy){//时序数据库策略发生改变时
    this.opcconfiginfo.servergroup.length=0;
    if(strategy==="集群版部署" && this.influxlist.length>2){
      this.addstate=true;
    }
  }

  //查找服务器名称
  search() {
    var data = new FormData();
    var opcHandleUrl;
    data.append('opcip',  this.opcconfiginfo.opchost);
    data.append('opctype', this.opcconfiginfo.opctype);
    data.append('opcaction', 'recognition');
    opcHandleUrl="http://"+this.opcconfiginfo.opchost+this.opchandleUrl;
    this.http.post(opcHandleUrl, data, {responseType: 'text'}).subscribe(res => {
      console.log(res);
      this.opcconfiginfo.serverurl = res;
      // this.message.success('查找服务端名称成功');
      // this.runornot(true);
      this.getServerName(res.replace('[', '').replace(']', '').replace('"', '').split(','));
    }),error1=>{
      this.message.warning(error1.error);
    };
  }

  //查找服务器名称
  getServerName(data) {
    var servers = [];
    this.opcconfiginfo.serverurl = '';
    this.servernames = [];
    if (!data) {
      // servers.push({ "text": "未找到Server", "id": "NoServer" });
    }
    var self = this;
    data.forEach(function (e) {
      if (self.opcconfiginfo.opctype === 'DA' || self.opcconfiginfo.opctype === 'UA') {
        self.servernames = [...self.servernames, e.replace('"', '')];
      } else {
        self.message.info('未定义的类型');
      }
    });
    this.opcconfiginfo.serverurl = this.servernames[0];
    console.log(this.servernames);
  }


  //获取influx数据库配置信息列表
  getDatabaselist(){
    this.http.get(this.getinfluxUrl)
    .subscribe(data => {
      this.influxlist=JSON.parse(JSON.stringify(data));
    });
  }
  getOpcconfiglist(){
    this.http.get(this.getopcUrl)
      .subscribe(data => {
        this.dataSet=JSON.parse(JSON.stringify(data));
      });
  }
  addOpcconfiglist(opcconfiginfo){
    this.http.post(this.insertopcUrl,opcconfiginfo)
      .subscribe(res => {
        this.goback();//显示列表主界面
      });
  }
  updateOpcconfiglist(opcconfiginfo){
    this.http.post(this.updateopcUrl,opcconfiginfo)
      .subscribe(res => {
        this.goback();//显示列表主界面
      });
  }
  delOpcconfiglist(serveraddress:string){
    console.log(serveraddress);
    this.http.post(this.deleteopcUrl,{"serveraddress":serveraddress}).
    subscribe(res => {
      this.goback();//显示列表主界面
    });
  } 
  //将数据库取出对象转化为可编辑对象
  toEditableobj(reobj,obj){
    Object.keys(obj).forEach(function(key){
      if(key==="servergroup"|| key==="login"){
        reobj[key]=JSON.parse(obj[key]);
      }else{
        reobj[key]=obj[key];
      }
    });
    return reobj;
  }
  //将可编辑对象转化为可存储到mongo对象
  toSaveableobj(reobj,obj){
    Object.keys(obj).forEach(function(key){
      if(key==="servergroup"|| key==="login"){
        reobj[key]=JSON.stringify(obj[key]);
      }else{
        reobj[key]=obj[key];
      }
    });
    return reobj;
  }
  ngOnInit() {
    this.getDatabaselist();
    this.getOpcconfiglist();
  }
}
