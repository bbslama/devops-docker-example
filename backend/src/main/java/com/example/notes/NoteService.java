package com.example.notes;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NoteService {

    private final NoteRepository repository;

    public NoteService(NoteRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> findAll() {
        return repository.findAllByOrderByIdAsc().stream()
                .map(NoteResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public NoteResponse findById(Long id) {
        return NoteResponse.from(findNote(id));
    }

    @Transactional
    public NoteResponse create(NoteRequest request) {
        return NoteResponse.from(repository.save(new Note(request.title(), request.content())));
    }

    @Transactional
    public NoteResponse update(Long id, NoteRequest request) {
        Note note = findNote(id);
        note.update(request.title(), request.content());
        return NoteResponse.from(note);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(findNote(id));
    }

    private Note findNote(Long id) {
        return repository.findById(id).orElseThrow(() -> new NoteNotFoundException(id));
    }
}
