package br.edu.utfpr.api.controller;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.domain.Sort;
// import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.edu.utfpr.api.dto.ReproductionDTO;
import br.edu.utfpr.api.model.Animal;
// import br.edu.utfpr.api.model.HealthRecord;
import br.edu.utfpr.api.model.Reproduction;
import br.edu.utfpr.api.repository.AnimalRepository;
import br.edu.utfpr.api.repository.ReproductionRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/reproduction")
@Tag(name = "Reproduction", description = "Authentication resource endpoints.")
public class ReproductionController {

    @Autowired
    private ReproductionRepository reproductionRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody @Valid ReproductionDTO dto) {
        var reproduction = new Reproduction();

        // Copiar as propriedades simples, mas sem o animalId
        BeanUtils.copyProperties(dto, reproduction, "animalId");

        // Buscar o animal correspondente
        Animal animal = animalRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new RuntimeException("Animal não encontrado com ID: " + dto.getAnimalId()));

        // Associar o animal ao objeto Reproduction
        reproduction.setAnimal(animal);

        // Se necessário, definir a data de nascimento esperada com base na data de
        // inseminação
        if (dto.getInseminationDate() != null) {
            // Exemplo de lógica: adicionar 280 dias à inseminação para estimar a data de
            // nascimento
            reproduction.setExpectedBirthDate(dto.getInseminationDate().plusDays(280));
        }

        // Salvar e retornar a reprodução criada
        try {
            Reproduction savedReproduction = reproductionRepository.save(reproduction);
            return ResponseEntity.ok(savedReproduction);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Falha ao salvar: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> get(@PathVariable int id) {
        var reproductionOpt = reproductionRepository.findById(id);

        return reproductionOpt.isPresent()
                ? ResponseEntity.ok(reproductionOpt.get())
                : ResponseEntity.notFound().build();
    }

    // @GetMapping
    // public ResponseEntity<Page<Reproduction>> getAll(
    //         @PageableDefault(page = 0, size = 5, sort = "inseminationDate", direction = Sort.Direction.ASC) Pageable pageable) {
    //     return ResponseEntity.status(206).body(reproductionRepository.findAll(pageable));
    // }

    @GetMapping
    public ResponseEntity<List<Reproduction>> getAll() {
        return ResponseEntity.ok(reproductionRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> put(@PathVariable int id, @Valid @RequestBody ReproductionDTO dto) {
        // Verificar se a reprodução com o id existe
        var reproductionOpt = reproductionRepository.findById(id);

        if (reproductionOpt.isPresent()) {
            var reproduction = reproductionOpt.get();

            // Copiar as propriedades simples, mas sem o id e animal (que será tratado
            // separadamente)
            BeanUtils.copyProperties(dto, reproduction, "id", "animalId");

            // Buscar o animal correspondente ao animalId do DTO
            Animal animal = animalRepository.findById(dto.getAnimalId())
                    .orElseThrow(() -> new RuntimeException("Animal não encontrado com ID: " + dto.getAnimalId()));

            // Associar o animal à reprodução
            reproduction.setAnimal(animal);

            // Se necessário, atualizar a data de nascimento esperada
            if (dto.getInseminationDate() != null) {
                reproduction.setExpectedBirthDate(dto.getInseminationDate().plusDays(280)); // Exemplo: 280 dias após a
                                                                                            // inseminação
            }

            try {
                // Salvar a reprodução atualizada no banco de dados
                return ResponseEntity.ok(reproductionRepository.save(reproduction));
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body("Falha ao salvar: " + ex.getMessage());
            }
        } else {
            // Se a reprodução não for encontrada, retornar 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable int id) {
        var reproductionOpt = reproductionRepository.findById(id);

        if (reproductionOpt.isPresent()) {
            try {
                reproductionRepository.delete(reproductionOpt.get());
                return ResponseEntity.ok().build();
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body("Falha ao deletar: " + ex.getMessage());
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
