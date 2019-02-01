import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class dataHandler {

  constructor() { }


  dateHandle(res){
    res.forEach(function (e) {
      var date = new Date(e.created);
      var date1=new Date(e.modified);
      var localeString = date.toLocaleString();
      var localeString1=date1.toLocaleString();
      e.created=localeString;
      e.modified=localeString1;
    });
  }


}
