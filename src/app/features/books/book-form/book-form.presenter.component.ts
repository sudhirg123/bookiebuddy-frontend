import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GoogleBook } from '../../../models/google-book.model';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-book-form-presenter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    ButtonModule,
    DatePickerModule,
    SelectModule,
    InputTextModule,
    RatingModule,
    ProgressSpinnerModule,
    SafeHtmlPipe
  ],
  templateUrl: './book-form.presenter.component.html',
  styleUrl: './book-form.presenter.component.scss'
})
export class BookFormPresenterComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() genres: string[] = [];
  @Input() googleResults: GoogleBook[] = [];
  @Input() saving = false;
  @Input() selectedDescription: string | null = null;
  @Input() searching = false;

  @Output() submitForm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();
  @Output() googleBookSelected = new EventEmitter<GoogleBook>();

  completeSearch(event: { query: string }): void {
    this.search.emit(event.query);
  }

  onSelectGoogleBook(event: { originalEvent: Event; value: GoogleBook }): void {
    this.googleBookSelected.emit(event.value);
  }

  trackById(_index: number, book: GoogleBook): string {
    return book.id;
  }

  getGenreOptions(): Array<{ label: string; value: string }> {
    return this.genres.map((genre) => ({ label: genre, value: genre }));
  }
}
