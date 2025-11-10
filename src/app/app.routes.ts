import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'books'
  },
  {
    // Handle Firebase auth handler redirects
    // When Google redirects here, we need to let Firebase process it
    // Firebase will handle the redirect, then we can navigate
    path: '__/auth/handler',
    loadComponent: () =>
      import('./features/auth/auth-handler/auth-handler.component').then(
        (m) => m.AuthHandlerComponent
      ).catch(() => {
        // Fallback if component doesn't exist - just redirect to root
        window.location.href = '/';
        return null as any;
      })
  },
  {
    path: 'login',
    title: 'BookieBuddy.ai | Login',
    loadComponent: () =>
      import('./features/auth/login.container.component').then(
        (m) => m.LoginContainerComponent
      )
  },
  {
    path: 'books',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'BookieBuddy.ai | My Library',
        loadComponent: () =>
          import('./features/books/book-list/book-list.container.component').then(
            (m) => m.BookListContainerComponent
          )
      },
      {
        path: 'new',
        title: 'BookieBuddy.ai | Add Book',
        loadComponent: () =>
          import('./features/books/book-form/book-form.container.component').then(
            (m) => m.BookFormContainerComponent
          ),
        data: { mode: 'create' }
      },
      {
        path: 'search',
        title: 'BookieBuddy.ai | Search Books',
        loadComponent: () =>
          import('./features/books/book-search/book-search.container.component').then(
            (m) => m.BookSearchContainerComponent
          )
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            title: 'BookieBuddy.ai | Book Details',
            loadComponent: () =>
              import('./features/books/book-detail/book-detail.container.component').then(
                (m) => m.BookDetailContainerComponent
              )
          },
          {
            path: 'edit',
            title: 'BookieBuddy.ai | Edit Book',
            loadComponent: () =>
              import('./features/books/book-form/book-form.container.component').then(
                (m) => m.BookFormContainerComponent
              ),
            data: { mode: 'edit' }
          }
        ]
      }
    ]
  },
  {
    path: 'dashboard',
    title: 'BookieBuddy.ai | Dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.container.component').then(
        (m) => m.DashboardContainerComponent
      )
  },
  {
    path: '**',
    redirectTo: 'books'
  }
];
