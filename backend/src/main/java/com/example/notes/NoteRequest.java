package com.example.notes;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NoteRequest(
        @NotBlank @Size(max = 120) String title,
        @NotBlank @Size(max = 10000) String content) {
}
