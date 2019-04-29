import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisUIComponent } from './analysis-ui.component';

describe('AnalysisUIComponent', () => {
  let component: AnalysisUIComponent;
  let fixture: ComponentFixture<AnalysisUIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisUIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
