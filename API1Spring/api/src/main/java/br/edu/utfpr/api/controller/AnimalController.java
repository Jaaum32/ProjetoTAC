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

import br.edu.utfpr.api.dto.AnimalDTO;
import br.edu.utfpr.api.model.Animal;
import br.edu.utfpr.api.repository.AnimalRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/animal")
@Tag(name = "Animal", description = "Authentication resource endpoints.")
public class AnimalController {

    @Autowired
    private AnimalRepository animalRepository;

    @PostMapping
    public Animal create(@RequestBody @Valid AnimalDTO dto) {
        var animal = new Animal();
        BeanUtils.copyProperties(dto, animal);
        return animalRepository.save(animal);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> get(@PathVariable int id) {
        var animalOpt = animalRepository.findById(id);

        return animalOpt.isPresent()
                ? ResponseEntity.ok(animalOpt.get())
                : ResponseEntity.notFound().build();
    }

    // @GetMapping
    // public ResponseEntity<Page<Animal>> getAll(
    // /*@PageableDefault(page = 0, size = 5, sort = "name", direction =
    // Sort.Direction.ASC) Pageable pageable)*/ {
    // return
    // ResponseEntity.status(206).body(animalRepository.findAll(/*pageable*/));
    // }

    @GetMapping
    public ResponseEntity<List<Animal>> getAll() {
        return ResponseEntity.ok(animalRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> put(@PathVariable int id, @Valid @RequestBody AnimalDTO dto) {
        var animalOpt = animalRepository.findById(id);

        if (animalOpt.isPresent()) {
            var animal = animalOpt.get();
            BeanUtils.copyProperties(dto, animal, "id", "reproductionHistory", "healthHistory");

            var animalToUpdate = new Animal();
            BeanUtils.copyProperties(dto, animalToUpdate);
            animalToUpdate.setId(animalOpt.get().getId());
            try {
                return ResponseEntity.ok().body(animalRepository.save(animalToUpdate));
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body("Falha ao salvar: " + ex.getMessage());
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable int id) {
        var animalOpt = animalRepository.findById(id);

        if (animalOpt.isPresent()) {
            try {
                animalRepository.delete(animalOpt.get());
                return ResponseEntity.ok().build();
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body("Falha ao deletar: " + ex.getMessage());
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}