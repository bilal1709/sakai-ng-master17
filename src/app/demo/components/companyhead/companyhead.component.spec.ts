import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyheadComponent } from './companyhead.component';

describe('CompanyheadComponent', () => {
  let component: CompanyheadComponent;
  let fixture: ComponentFixture<CompanyheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyheadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
