import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Note, NoteInput } from './note';

@Injectable({ providedIn: 'root' })
export class NotesApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/notes';

  list(): Observable<Note[]> {
    return this.http.get<Note[]>(this.endpoint);
  }

  create(note: NoteInput): Observable<Note> {
    return this.http.post<Note>(this.endpoint, note);
  }

  update(id: number, note: NoteInput): Observable<Note> {
    return this.http.put<Note>(`${this.endpoint}/${id}`, note);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
