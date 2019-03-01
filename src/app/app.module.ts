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
import { DeviceComponent } from './device/device';
import { NotificationComponent } from './notification/notification';
import { ExportComponent } from './export/export';
import { RuleComponent } from './rule/rule';
import { LoginComponent } from './login/login';
import { GrafanaComponent } from './grafana/grafana.component';
import { DatabaseComponent } from './database/database.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { DeviceServiceComponent } from './device-service/device-service.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { GrafanaSetupComponent } from './grafana-setup/grafana-setup.component';
import { OpcuaComponent } from './opcua/opcua.component';
import { EdgeIntComponent } from './edge-int/edge-int.component';



registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    GatewayComponent,
    DeviceComponent,
    NotificationComponent,
    ExportComponent,
    RuleComponent,
    LoginComponent,
    GrafanaComponent,
    DatabaseComponent,
    DeviceDetailComponent,
    ProfileComponent,
    DeviceServiceComponent,
    ServiceDetailComponent,
    GrafanaSetupComponent,
    OpcuaComponent,
    EdgeIntComponent,
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
