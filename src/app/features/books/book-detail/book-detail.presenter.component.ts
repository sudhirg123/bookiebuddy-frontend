import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Book } from '../../../models/book.model';
import { RatingDisplayPresenterComponent } from '../../../shared/components/rating-display.presenter.component';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-book-detail-presenter',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RatingDisplayPresenterComponent,
    SafeHtmlPipe
  ],
  templateUrl: './book-detail.presenter.component.html',
  styleUrl: './book-detail.presenter.component.scss'
})
export class BookDetailPresenterComponent {
  @Input({ required: true }) book!: Book;
  @Input() googleDescription?: string | null;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onEdit(): void {
    this.edit.emit(this.book.id);
  }

  onDelete(): void {
    this.delete.emit(this.book.id);
  }
}
