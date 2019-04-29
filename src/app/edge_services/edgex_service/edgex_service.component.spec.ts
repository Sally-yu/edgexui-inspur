import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Edgex_ServiceComponent } from './edgex_service.component';

describe('Edgex_ServiceComponent', () => {
  let component: Edgex_ServiceComponent;
  let fixture: ComponentFixture<Edgex_ServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Edgex_ServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Edgex_ServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
