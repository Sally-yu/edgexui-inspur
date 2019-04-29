import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Opcua_ServiceComponent } from './opcua_service.component';

describe('DeviceServiceComponent', () => {
  let component: Opcua_ServiceComponent;
  let fixture: ComponentFixture<Opcua_ServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Opcua_ServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Opcua_ServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
