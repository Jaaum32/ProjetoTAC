package br.edu.utfpr.api.model;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "tb_reproductions")
public class Reproduction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "animal_id", nullable = false)
    @ToString.Exclude
    private Animal animal;

    @Column(name = "insemination_date", nullable = false)
    @Temporal(TemporalType.DATE)
    private LocalDate inseminationDate;

    @Column(name = "expected_birth_date")
    @Temporal(TemporalType.DATE)
    private LocalDate expectedBirthDate;

    @Column
    private String observations;

    @Column(name = "pregnancy_confirmation", nullable = false)
    private boolean pregnancyConfirmed;
}
