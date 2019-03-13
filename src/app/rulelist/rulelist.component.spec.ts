import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulelistComponent } from './rulelist.component';

describe('RulelistComponent', () => {
  let component: RulelistComponent;
  let fixture: ComponentFixture<RulelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
