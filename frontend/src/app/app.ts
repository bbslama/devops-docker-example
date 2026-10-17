import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note, NoteInput } from './note';
import { NotesApiService } from './notes-api.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly notesApi = inject(NotesApiService);

  readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    content: ['', [Validators.required, Validators.maxLength(10000)]],
  });

  notes: Note[] = [];
  loading = true;
  saving = false;
  error = '';
  editingId: number | null = null;

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.loading = true;
    this.error = '';
    this.notesApi.list().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load notes. Please try again.';
        this.loading = false;
      },
    });
  }

  edit(note: Note): void {
    this.editingId = note.id;
    this.form.setValue({ title: note.title, content: note.content });
    this.error = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form.reset();
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving) {
      return;
    }

    const input: NoteInput = this.form.getRawValue();
    this.saving = true;
    this.error = '';
    const request = this.editingId === null
      ? this.notesApi.create(input)
      : this.notesApi.update(this.editingId, input);

    request.subscribe({
      next: (note) => {
        if (this.editingId === null) {
          this.notes = [...this.notes, note].sort((left, right) => left.id - right.id);
        } else {
          this.notes = this.notes.map((existing) => existing.id === note.id ? note : existing);
        }
        this.saving = false;
        this.cancelEdit();
      },
      error: (response: HttpErrorResponse) => {
        this.error = response.status === 0
          ? 'The notes service is unavailable. Please try again.'
          : 'Could not save the note. Please check the values and try again.';
        this.saving = false;
      },
    });
  }

  delete(note: Note): void {
    this.error = '';
    this.notesApi.delete(note.id).subscribe({
      next: () => {
        this.notes = this.notes.filter((existing) => existing.id !== note.id);
        if (this.editingId === note.id) {
          this.cancelEdit();
        }
      },
      error: () => {
        this.error = 'Could not delete the note. Please try again.';
      },
    });
  }
}
