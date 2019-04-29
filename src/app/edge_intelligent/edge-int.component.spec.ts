import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeIntComponent } from './edge-int.component';

describe('EdgeIntComponent', () => {
  let component: EdgeIntComponent;
  let fixture: ComponentFixture<EdgeIntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdgeIntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdgeIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
