import {Component, OnInit} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';


declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) {
  }

  private name = 'admin';
  private pwd = 'admin';

  //自动登录，
  login() {
    $.ajax({
      url: '/api/v1/auth/login',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        'name': this.name,
        'password': this.pwd
      }),
      success: function (data) {
        window.sessionStorage.setItem('X_Session_Token', data);
        window.location.href = '/?X-Session-Token=' + data;
        console.log('login:' + data);
        var addr = {
          'hostIP': ''
        };
        $.ajax({
          url: '/api/v1/proxy',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(addr),
          headers: {
            'X-Session-Token': window.sessionStorage.getItem('X_Session_Token')
          },
          success: function (data) {
          }
        });
      }
    });
  }


  ngOnInit() {
    console.log(window.sessionStorage.getItem('X_Session_Token'));
    if (window.sessionStorage.getItem('X_Session_Token') == null || window.sessionStorage.getItem('X_Session_Token') == '') {
      window.location.href = '/login.html?ran=' + Math.random(); //prevent browser cache result to redirect  failed.
    }
  }
}
