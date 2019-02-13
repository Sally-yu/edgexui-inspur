import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrls: ['./notification.scss']
})
export class NotificationComponent implements OnInit {

  notifications;
  subscriptions;
  end=(new Date()).valueOf();//默认当前时间的毫秒unix时间戳
  count=50;//默认要显示的通知数

  //请求头
  head = new HttpHeaders({
    'X-Session-Token': '21232f297a57a5a743894a0e4a801fc3',
    'X-Requested-With': 'XMLHttpRequest'
  });

  notiUrl='/support-notification/api/v1/notification/end/' + this.end + '/'+this.count;
  subsUrl='/support-notification/api/v1/subscription';

  testNotis=[
    {
      "created": 1546390656686,
      "modified": 0,
      "origin": 0,
      "id": "5c2c0c80ccea560001043f4c",
      "slug": "device-change-1546390656683",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-POST",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546390656826,
      "modified": 0,
      "origin": 0,
      "id": "5c2c0c80ccea560001043f4d",
      "slug": "device-change-1546390656825",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-POST",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546390657011,
      "modified": 0,
      "origin": 0,
      "id": "5c2c0c81ccea560001043f4e",
      "slug": "device-change-1546390657010",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-POST",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890138,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89a",
      "slug": "device-change-1546495890135",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890318,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89b",
      "slug": "device-change-1546495890317",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890519,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89c",
      "slug": "device-change-1546495890519",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890623,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89d",
      "slug": "device-change-1546495890623",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890674,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89e",
      "slug": "device-change-1546495890673",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890785,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89f",
      "slug": "device-change-1546495890785",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818158,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bca9",
      "slug": "device-change-1546511818151",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818342,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcaa",
      "slug": "device-change-1546511818341",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818535,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcab",
      "slug": "device-change-1546511818535",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818645,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcac",
      "slug": "device-change-1546511818644",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818730,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcad",
      "slug": "device-change-1546511818730",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818889,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcae",
      "slug": "device-change-1546511818888",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546821364629,
      "modified": 0,
      "origin": 0,
      "id": "5c329ef4ccea560001c2aa99",
      "slug": "device-change-1546821364627",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546821364940,
      "modified": 0,
      "origin": 0,
      "id": "5c329ef4ccea560001c2aa9a",
      "slug": "device-change-1546821364940",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546390656826,
      "modified": 0,
      "origin": 0,
      "id": "5c2c0c80ccea560001043f4d",
      "slug": "device-change-1546390656825",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-POST",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546390657011,
      "modified": 0,
      "origin": 0,
      "id": "5c2c0c81ccea560001043f4e",
      "slug": "device-change-1546390657010",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-POST",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890138,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89a",
      "slug": "device-change-1546495890135",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890318,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89b",
      "slug": "device-change-1546495890317",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890519,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89c",
      "slug": "device-change-1546495890519",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890623,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89d",
      "slug": "device-change-1546495890623",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890674,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89e",
      "slug": "device-change-1546495890673",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890785,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89f",
      "slug": "device-change-1546495890785",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818158,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bca9",
      "slug": "device-change-1546511818151",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818342,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcaa",
      "slug": "device-change-1546511818341",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818535,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcab",
      "slug": "device-change-1546511818535",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818645,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcac",
      "slug": "device-change-1546511818644",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818730,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcad",
      "slug": "device-change-1546511818730",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818889,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcae",
      "slug": "device-change-1546511818888",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546821364629,
      "modified": 0,
      "origin": 0,
      "id": "5c329ef4ccea560001c2aa99",
      "slug": "device-change-1546821364627",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546821364940,
      "modified": 0,
      "origin": 0,
      "id": "5c329ef4ccea560001c2aa9a",
      "slug": "device-change-1546821364940",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546390656826,
      "modified": 0,
      "origin": 0,
      "id": "5c2c0c80ccea560001043f4d",
      "slug": "device-change-1546390656825",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-POST",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546390657011,
      "modified": 0,
      "origin": 0,
      "id": "5c2c0c81ccea560001043f4e",
      "slug": "device-change-1546390657010",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-POST",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890138,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89a",
      "slug": "device-change-1546495890135",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890318,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89b",
      "slug": "device-change-1546495890317",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890519,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89c",
      "slug": "device-change-1546495890519",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890623,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89d",
      "slug": "device-change-1546495890623",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890674,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89e",
      "slug": "device-change-1546495890673",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546495890785,
      "modified": 0,
      "origin": 0,
      "id": "5c2da792ccea56000133f89f",
      "slug": "device-change-1546495890785",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818158,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bca9",
      "slug": "device-change-1546511818151",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818342,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcaa",
      "slug": "device-change-1546511818341",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818535,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcab",
      "slug": "device-change-1546511818535",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818645,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcac",
      "slug": "device-change-1546511818644",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: GS1-AC-Drive01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818730,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcad",
      "slug": "device-change-1546511818730",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546511818889,
      "modified": 0,
      "origin": 0,
      "id": "5c2de5caccea560001c2bcae",
      "slug": "device-change-1546511818888",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: KMC.BAC-121036CE01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546821364629,
      "modified": 0,
      "origin": 0,
      "id": "5c329ef4ccea560001c2aa99",
      "slug": "device-change-1546821364627",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
    {
      "created": 1546821364940,
      "modified": 0,
      "origin": 0,
      "id": "5c329ef4ccea560001c2aa9a",
      "slug": "device-change-1546821364940",
      "sender": "edgex-core-metadata",
      "category": "SW_HEALTH",
      "severity": "NORMAL",
      "content": "Device update: JC.RR5.NAE9.ConfRoom.Padre.Island01-PUT",
      "description": "Metadata device notice",
      "status": "NEW",
      "labels": [
        "metadata"
      ]
    },
  ];

  constructor(
    private http:HttpClient
  ) { }

  getNoti(){
    // this.http.get(this.notiUrl,{headers:this.head}).subscribe(res=>{
    //   this.notifications=res;
    // });

    this.notifications=this.testNotis;
    this.notifications.sort((a,b)=>{return b.created-a.created});

    let self=this;
    this.notifications.forEach(function (e) {      //处理标签，时间戳
      e.labels = e.labels.join(',');
      e.created = (new Date(e.created)).toLocaleString();
      e.modified = (new Date(e.modified)).toLocaleString();
      e.index=self.notifications.indexOf(e);
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
