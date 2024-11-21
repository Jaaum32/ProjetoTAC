package br.edu.utfpr.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.utfpr.api.model.Animal;

public interface AnimalRepository extends JpaRepository<Animal, Integer>{

}
