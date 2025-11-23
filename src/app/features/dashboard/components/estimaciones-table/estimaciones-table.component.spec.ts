import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimacionesTableComponent } from './estimaciones-table.component';

describe('EstimacionesTableComponent', () => {
  let component: EstimacionesTableComponent;
  let fixture: ComponentFixture<EstimacionesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimacionesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimacionesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
