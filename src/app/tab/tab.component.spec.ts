import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabComponent } from './tab.component';

describe('TabComponent', () => {
  let component: TabComponent<any>;
  let fixture: ComponentFixture<TabComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
