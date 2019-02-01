import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaSetupComponent } from './grafana-setup.component';

describe('GrafanaSetupComponent', () => {
  let component: GrafanaSetupComponent;
  let fixture: ComponentFixture<GrafanaSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrafanaSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrafanaSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
