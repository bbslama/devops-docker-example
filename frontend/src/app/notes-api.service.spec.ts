import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NotesApiService } from './notes-api.service';

describe('NotesApiService', () => {
  let service: NotesApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NotesApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('requests notes from the relative API endpoint', () => {
    service.list().subscribe((notes) => {
      expect(notes).toEqual([{ id: 3, title: 'Pipeline', content: 'Ship it' }]);
    });

    const request = httpTesting.expectOne('/api/notes');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 3, title: 'Pipeline', content: 'Ship it' }]);
  });
});
