import { Component } from '@angular/core';
import {AjaxService} from './ajax.service';
import {ajax} from 'rxjs/ajax';

declare var $:any;
// @ts-ignore
// @ts-ignore
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Edge-Access';   //页面标题

  tabs = ['欢迎'];
  ajax= new AjaxService;
  imgUrl=this.ajax.imgUrl;
  logoPath=this.imgUrl+'/'+'logo-big.png';
  framePath=this.imgUrl+'/'+'framework.png';
  content='欢迎';
  collapsed=false;

  //切换菜单展开
  toggleColl(){
    this.collapsed=!this.collapsed;
  }

  logout(){
    // var loc = window.location;
    // var href= (loc.protocol + '//' + loc.hostname + ':48081/api/v1/deviceprofile') ;
    // window.location.href=href;
  }

  visible = false;
  drawerTitle='User';
  open(func:string): void {
    this.drawerTitle=func;
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

}
