import { Injectable } from '@angular/core';

//统一设置常用的后台请求url

@Injectable({
  providedIn: 'root'
})
export class AjaxService {

  public fileServerPort = "8090";
  // public host=window.location.protocol+'//'+window.location.hostname+':'+this.fileServerPort;
  public host='http://10.24.20.7:8090';
  public imgUrl=this.host+'/assets/img';
  public saveUrl=this.host+'/assets/img/save';
  public findUrl=this.host+'/assets/img/deviceid';
  public backUrl=this.host+'/assets/img/back';
  public workUrl=this.host+'/workspace';
  public uploadUrl=this.host+'/assets/upload';//上传保存自定义svg文件
  public cusUrl=this.host+'/assets/img/cussvg';//get保存自定义svg文件
  public updateCus=this.host+'/assets/updateCus'; //保存自定义svg关联信息到数据库
  public findName=this.host+'/workspace/findname';//查找同名布局是否已存在
  constructor() {
    console.log(this.host);
  }

}
