package br.edu.utfpr.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.utfpr.api.model.HealthRecord;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Integer>{

}
