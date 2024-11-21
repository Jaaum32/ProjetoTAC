package br.edu.utfpr.api.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReproductionDTO {
    @NotNull(message = "Animal is mandatory")
    private int animalId; // Assuming only the animal ID is needed for the DTO

    @NotNull(message = "Insemination date is mandatory")
    private LocalDate inseminationDate;

    @Size(max = 255, message = "Observations cannot exceed 255 characters")
    private String observations;

    @NotNull(message = "Pregnancy confirmation is mandatory")
    private boolean pregnancyConfirmed;
}
