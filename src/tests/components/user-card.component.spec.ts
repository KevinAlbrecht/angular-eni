import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UserCardComponent } from '~layout/ui/user-card.component';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the username', () => {
    const username = 'JohnDoe';
    fixture.componentRef.setInput('username', username);
    fixture.detectChanges();

    const usernameElement = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(usernameElement.textContent).toBe(username);
  });

  it('should emit toggleAuth when the button is clicked', () => {
    spyOn(component.toggleAuth, 'emit');
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    expect(component.toggleAuth.emit).toHaveBeenCalled();
  });

  it('should have add/remove "connected" class depending on connection status', () => {
    const tests = [
      ['', false],
      ['John', true],
      [null, false],
    ];

    for (const [username, isConnected] of tests) {
      fixture.componentRef.setInput('username', username);
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button')).nativeElement;
      expect(button.classList.contains('connected')).toBe(isConnected);
    }
  });
});
