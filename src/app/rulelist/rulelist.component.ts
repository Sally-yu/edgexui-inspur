import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd';
import {AjaxService} from '../ajax.service';

@Component({
  selector: 'app-rulelist',
  templateUrl: './rulelist.component.html',
  styleUrls: ['./rulelist.component.scss']
})
export class RulelistComponent implements OnInit {

  currWork;
  workSpc;
  showList = true;
  listUrl = this.ajax.workUrl;

  nullWorkSpc = {
    'name':'',
    'key': '',
    'class': 'GraphLinksModel',
    'linkDataArray': [],
    'nodeDataArray': []
  };

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private ajax: AjaxService
  ) {
  }

  getWorkSpc() {
    var data = {
      opt: 'all',
      workspace: {}
    };
    this.http.post(this.listUrl, data).subscribe(res => {
      this.workSpc = res;
    }, error1 => {
      this.message.info(error1);
      console.log(error1);
    });
  }

  // 详情页面关闭事件处理
  detailClose(event) {
    if (event) {
      this.currWork = null;
      this.getWorkSpc();
      this.showList = true;
    }
  }

  // 详情页删除设备，传入新的
  detailNext(event) {
    if (event) {
      var data = {
        opt: 'all',
        workspace: {}
      };
      this.http.post(this.listUrl, data).subscribe(response => {
          console.log('workspc:' + response);
          this.workSpc = response;
          this.workSpc.forEach(function (e) {  // 处理标签数组 时间戳
            if (e.labels instanceof Array) {
              e.labels = e.labels.join(',');
            }// 防止重复处理时报错
          });
          this.currWork = this.currWork.length > 0 ? this.currWork[0] : [];
        },
        error1 => {
          this.message.warning(error1);
          console.log(error1);
        });
    }
  }

  // 点选一行编辑，跳转到编辑页面;key传null为新增跳转
  rowSelected(key) {
    if (key) {
      this.currWork = this.workSpc.filter(d => d.key === key)[0]; // 当前选中设备
      this.showList = false;
      this.currWork.linkDataArray.forEach(d => {
        // console.log(d.points);
      });
      // console.log(this.currWork);
    }
    else if(key==null){
      this.currWork = JSON.parse(JSON.stringify(this.nullWorkSpc)); // 深复制，包括子对象，防止使用后改变
      this.showList = false;
    }
  }

  // 在列表中删除
  delete(key) {
    this.http.post(this.listUrl, {opt: 'delete', workspace: {key: key}}).subscribe(res => {
        this.message.success('删除成功');
        this.getWorkSpc();
      },
      error1 => {
        // console.log(error1);
        this.message.warning('删除失败:' + error1.error);
      });
  }

  //预览不可编辑
  preview(key){
    if(key){

    }
  }

  ngOnInit() {
    this.getWorkSpc();
  }

}
