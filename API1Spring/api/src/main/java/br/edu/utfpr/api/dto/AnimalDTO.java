package br.edu.utfpr.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnimalDTO {
    
    @NotBlank(message = "Tag ID is mandatory")
    private String tagId;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Breed is mandatory")
    private String breed;

    @NotNull(message = "Age is mandatory")
    @Min(value = 0, message = "Age must be a positive value")
    private int age;

    @NotNull(message = "Weight is mandatory")
    @Positive(message = "Weight must be a positive value")
    private double weight;

    @NotBlank(message = "Reproductive Status is mandatory")
    private String reproductiveStatus;

}
