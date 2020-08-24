import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendInfoComponent } from './sendInfo.component';

describe('SendInfoComponent', () => {
  let component: SendInfoComponent;
  let fixture: ComponentFixture<SendInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
