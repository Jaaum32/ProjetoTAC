package br.edu.utfpr.api.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HealthRecordDTO {
    @NotNull
    private int animalId;

    @NotNull
    private LocalDate date;

    @NotBlank
    private String treatment;

    @NotBlank
    private String responsible;
}
