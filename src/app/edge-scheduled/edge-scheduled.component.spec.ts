import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeScheduledComponent } from './edge-scheduled.component';

describe('EdgeScheduledComponent', () => {
  let component: EdgeScheduledComponent;
  let fixture: ComponentFixture<EdgeScheduledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdgeScheduledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdgeScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
