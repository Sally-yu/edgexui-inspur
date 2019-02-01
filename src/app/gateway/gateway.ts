import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.html',
  styleUrls: ['./gateway.scss']
})
export class GatewayComponent implements OnInit {

  constructor() { }


  allChecked = false;
  disabledButton = true;
  checkedNumber = 0;
  displayData: Array<{ name: string; age: number; address: string; checked: boolean }> = [];
  operating = false;
  gateWays = [];
  indeterminate = false;

  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean }>): void {
    this.displayData = $event;
  }

  refreshStatus(): void {
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.gateWays.some(value => value.checked);
    this.checkedNumber = this.gateWays.filter(value => value.checked).length;
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  operateData(): void {
    this.operating = true;
    setTimeout(_ => {
      this.gateWays.forEach(value => value.checked = false);
      this.refreshStatus();
      this.operating = false;
    }, 1000);
  }

  ngOnInit(): void {
    for (let i = 1; i < 20; i++) {
      this.gateWays.push({
        id:  '0000'+i,
        name   : '测试用网关'+'0000'+i,
        description    : '测试用网关'+'0000'+i,
        ip: '192.168.1.1',
        createdTime: '2019-01-01 12:02:33'
      });
    }
  }


}
