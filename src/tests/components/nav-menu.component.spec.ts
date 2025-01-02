import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavMenuComponent } from '../../app/layout/ui/nav-menu.component';
import { provideRouter } from '@angular/router';

describe('NavMenuComponent', () => {
  let fixture: ComponentFixture<NavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavMenuComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavMenuComponent);
    fixture.detectChanges();
  });

  it('should have "Board" link', () => {
    const boardLink = fixture.nativeElement.querySelector('a[routerLink=""]');
    expect(boardLink).toBeTruthy();
    expect(boardLink.textContent).toContain('Board');
  });

  it('should have "Admin" link when isAdmin is true', () => {
    fixture.componentRef.setInput('isAdmin', true);
    fixture.detectChanges();

    const adminLink = fixture.nativeElement.querySelector('a[href="/admin"]');
    expect(adminLink).toBeTruthy();
    expect(adminLink.textContent).toContain('Admin');
    expect(adminLink.classList).not.toContain('disabled');
  });

  it('should have disabled "Admin" link when isAdmin is false', () => {
    fixture.componentRef.setInput('isAdmin', false);
    fixture.detectChanges();

    const adminLink = fixture.nativeElement.querySelector('a[href="/admin"]');
    expect(adminLink).toBeFalsy();
  });
});
