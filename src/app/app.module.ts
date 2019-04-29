import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN, en_US } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';

//配置angular
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import { GatewayComponent } from './gateway/gateway';
import { DeviceComponent } from './device_register/device_register.component';
import { NotificationComponent } from './edge_notification/notification.component';
import { ExportComponent } from './cloud_subscribe/cloud_subscribe.component';
import { RuleComponent } from './device_topolist/device_topo/device_topo.component';
import { LoginComponent } from './login/login';
import { AnalysisUIComponent } from './edge_analysis/analysis-ui/analysis-ui.component';
import { DatabaseComponent } from './database_management/database_management.component';
import { DeviceDetailComponent } from './device_management/device-detail/device-detail.component';
import { ProfileComponent } from './device_management/device_config/device_config.component';
import { Edgex_ServiceComponent } from './edge_services/edgex_service/edgex_service.component';
import { Opcua_ServiceComponent } from './edge_services/opcua_service/opcua_service.component';
import { EdgeIntComponent } from './edge_intelligent/edge-int.component';
import { RulelistComponent } from './device_topolist/device_topolist.component';
import { AnalysisListComponent } from './edge_analysis/analysis-list/analysis-list.component';
import { EdgeScheduledComponent } from './edge-scheduled/edge-scheduled.component';



registerLocaleData(zh);

@NgModule({
  declarations: [
    RuleComponent,
    AppComponent,
    GatewayComponent,
    DeviceComponent,
    NotificationComponent,
    ExportComponent,
    LoginComponent,
    DatabaseComponent,
    AnalysisUIComponent,
    DatabaseComponent,
    DeviceDetailComponent,
    ProfileComponent,
    Edgex_ServiceComponent,
    Opcua_ServiceComponent,
    EdgeIntComponent,
    RulelistComponent,
    AnalysisListComponent,
    EdgeScheduledComponent,
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DragDropModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
