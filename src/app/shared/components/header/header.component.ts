import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { UserProfile } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AvatarModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly router = inject(Router);

  @Input({ required: true }) isAuthenticated = false;
  @Input() user: UserProfile | null = null;
  @Output() logout = new EventEmitter<void>();

  readonly displayName = computed(() => this.user?.displayName ?? 'BookieBuddy Reader');

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  onLogout(): void {
    this.logout.emit();
  }
}
