package com.liclam.lexinsurance.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.liclam.lexinsurance.entity.Consultation;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    
    List<Consultation> findByUser_Id(Long userId);
    long countByStatus(String status);
    
@Query("SELECT c.id, u.email, c.deceasedName, c.docNumber, c.status, c.createdAt " +
           "FROM Consultation c LEFT JOIN c.user u ORDER BY c.createdAt DESC")
    Page<Object[]> findAdminResumen(Pageable pageable);
}