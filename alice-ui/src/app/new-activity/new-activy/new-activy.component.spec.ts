import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewActivyComponent } from './new-activy.component';

describe('NewActivyComponent', () => {
  let component: NewActivyComponent;
  let fixture: ComponentFixture<NewActivyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewActivyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewActivyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
