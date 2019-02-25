import { Injectable } from '@angular/core';

//统一设置常用的后台请求url

@Injectable({
  providedIn: 'root'
})
export class AjaxService {

  public fileServerPort = "8090";
  public host=window.location.protocol+'//'+window.location.hostname+':'+this.fileServerPort;
  // public host='http://10.24.20.7:8090';
  public imgUrl=this.host+'/assets/img';
  public saveUrl=this.host+'/assets/img/save';
  public findUrl=this.host+'/assets/img/deviceid';
  public backUrl=this.host+'/assets/img/back';

  constructor() {
    console.log(this.host);
  }
}
