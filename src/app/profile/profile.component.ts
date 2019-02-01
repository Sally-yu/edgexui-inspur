import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  //请求头
  head = new HttpHeaders({
    'X-Session-Token': '21232f297a57a5a743894a0e4a801fc3',
    'X-Requested-With': 'XMLHttpRequest'
  });

  getUrl = '/core-metadata/api/v1/deviceprofile';
  profiles;
  loading = false;


  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }

  //获取属性列表，刷新
  getPro() {
    this.loading = true;
    this.http.get(this.getUrl, {headers: this.head}).subscribe(res => {
      this.profiles = res;
      this.profiles.forEach(function (e) {
        if (e.labels instanceof Array) {
          e.labels = e.labels.join(',');
        }
        e.created = (new Date(e.created)).toLocaleString();
        e.modified = (new Date(e.modified)).toLocaleString();
      });
      this.loading = false;
    }, error1 => {
      this.message.warning('获取属性列表失败:' + error1.error);
      this.loading = false;
    });
  }

  //上传文件
  upload() {

  }

  //删除
  delete(id) {
    if (id) {
      var url = this.getUrl + '/id/' + id;
      this.http.delete(url, {headers: this.head}).subscribe(res => {
        this.message.success('属性已删除');
        this.getPro();
      }, error1 => {
        this.message.warning('未能删除属性:' + error1.error);
      });
    }
  }

  ngOnInit() {
    this.getPro();
  }

}
