package com.example.notes;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(NoteController.class)
class NoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private NoteService service;

    @Test
    void readsNotes() throws Exception {
        when(service.findById(7L)).thenReturn(new NoteResponse(7L, "Pipeline", "Ship it"));

        mockMvc.perform(get("/api/notes/7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.title").value("Pipeline"));
    }

    @Test
    void rejectsInvalidNote() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .post("/api/notes")
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .content("{\"title\":\" \",\"content\":\"text\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    void reportsMissingNote() throws Exception {
        when(service.findById(404L)).thenThrow(new NoteNotFoundException(404L));

        mockMvc.perform(get("/api/notes/404"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Note 404 was not found"));
    }
}
