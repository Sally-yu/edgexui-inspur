import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifications;
  subscriptions;
  end=(new Date()).valueOf();//默认当前时间的毫秒unix时间戳
  count=20;//默认要显示的通知数

  //请求头
  head = new HttpHeaders({
    'X-Session-Token': '21232f297a57a5a743894a0e4a801fc3',
    'X-Requested-With': 'XMLHttpRequest'
  });

  notiUrl='/support-notification/api/v1/notification/end/' + this.end + '/'+this.count;
  subsUrl='/support-notification/api/v1/subscription';



  constructor(
    private http:HttpClient
  ) { }

  getNoti(){
    this.http.get(this.notiUrl,{headers:this.head}).subscribe(res=>{
      this.notifications=res;
      this.notifications.sort((a,b)=>{return b.created-a.created});

      let self=this;
      this.notifications.forEach(function (e) {      //处理标签，时间戳
        e.labels = e.labels.join(',');
        e.created = (new Date(e.created)).toLocaleString();
        e.modified = (new Date(e.modified)).toLocaleString();
        e.index=self.notifications.indexOf(e);
      });
    });
  }

  getSubs(){
    this.http.get(this.subsUrl,{headers:this.head}).subscribe(res=>{
      this.subscriptions=res;
    })
  }

  ngOnInit() {
    this.getNoti();
  }

}
