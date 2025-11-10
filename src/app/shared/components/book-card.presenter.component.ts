import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Book } from '../../models/book.model';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

@Component({
  selector: 'app-book-card-presenter',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    SafeHtmlPipe
  ],
  templateUrl: './book-card.presenter.component.html',
  styleUrl: './book-card.presenter.component.scss'
})
export class BookCardPresenterComponent {
  @Input({ required: true }) book!: Book;
  @Input() showActions = true;
  @Output() view = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onView(): void {
    this.view.emit(this.book.id);
  }

  onEdit(): void {
    this.edit.emit(this.book.id);
  }

  onDelete(): void {
    this.delete.emit(this.book.id);
  }
}
