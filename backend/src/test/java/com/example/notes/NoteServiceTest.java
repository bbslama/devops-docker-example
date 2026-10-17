package com.example.notes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class NoteServiceTest {

    @Mock
    private NoteRepository repository;

    @InjectMocks
    private NoteService service;

    @Test
    void createsAndReturnsNote() {
        Note note = new Note("Pipeline", "Build and ship");
        when(repository.save(org.mockito.ArgumentMatchers.any(Note.class))).thenReturn(note);

        NoteResponse response = service.create(new NoteRequest("Pipeline", "Build and ship"));

        assertThat(response.title()).isEqualTo("Pipeline");
        assertThat(response.content()).isEqualTo("Build and ship");
        verify(repository).save(org.mockito.ArgumentMatchers.any(Note.class));
    }
}
