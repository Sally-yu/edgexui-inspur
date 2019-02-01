import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcuaComponent } from './opcua.component';

describe('OpcuaComponent', () => {
  let component: OpcuaComponent;
  let fixture: ComponentFixture<OpcuaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcuaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
