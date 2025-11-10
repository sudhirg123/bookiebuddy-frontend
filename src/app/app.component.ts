import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './core/services/auth.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly authService = inject(AuthService);

  readonly user = computed(() => this.authService.user());
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());

  async signOut(): Promise<void> {
    await this.authService.logout();
  }
}
