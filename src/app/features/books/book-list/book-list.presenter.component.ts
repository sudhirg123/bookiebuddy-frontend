import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Book } from '../../../models/book.model';
import { BookCardPresenterComponent } from '../../../shared/components/book-card.presenter.component';
import { EmptyStatePresenterComponent } from '../../../shared/components/empty-state.presenter.component';

@Component({
  selector: 'app-book-list-presenter',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    BookCardPresenterComponent,
    EmptyStatePresenterComponent
  ],
  templateUrl: './book-list.presenter.component.html',
  styleUrl: './book-list.presenter.component.scss'
})
export class BookListPresenterComponent {
  @Input({ required: true }) books: Book[] = [];
  @Input() loading = false;
  @Input() heading = 'My Library';
  @Output() view = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() create = new EventEmitter<void>();

  onView(id: string): void {
    this.view.emit(id);
  }

  onEdit(id: string): void {
    this.edit.emit(id);
  }

  onDelete(id: string): void {
    this.delete.emit(id);
  }

  onCreate(): void {
    this.create.emit();
  }
}
