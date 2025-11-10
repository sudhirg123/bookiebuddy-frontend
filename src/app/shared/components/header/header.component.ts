import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  @Input({ required: true }) isAuthenticated = false;
  @Input() user: UserProfile | null = null;
  @Output() logout = new EventEmitter<void>();

  readonly displayName = computed(() => this.user?.displayName ?? 'BookieBuddy Reader');

  onLogout(): void {
    this.logout.emit();
  }
}
