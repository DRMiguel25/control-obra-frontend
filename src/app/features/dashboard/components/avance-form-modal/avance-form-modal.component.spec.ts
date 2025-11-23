import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvanceFormModalComponent } from './avance-form-modal.component';

describe('AvanceFormModalComponent', () => {
  let component: AvanceFormModalComponent;
  let fixture: ComponentFixture<AvanceFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvanceFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvanceFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
