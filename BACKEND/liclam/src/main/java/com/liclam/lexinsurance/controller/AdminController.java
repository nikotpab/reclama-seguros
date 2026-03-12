package com.liclam.lexinsurance.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.liclam.lexinsurance.dto.AdminConsultationDto;
import com.liclam.lexinsurance.dto.AdminStatsDto;
import com.liclam.lexinsurance.dto.UpdateStatusRequest;
import com.liclam.lexinsurance.entity.Consultation;
import com.liclam.lexinsurance.service.ConsultationService;

@RestController
@RequestMapping("/api/admin") 
public class AdminController {

    @Autowired
    private ConsultationService consultationService;

    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultationDetail(@PathVariable Long id) {
        return ResponseEntity.ok(consultationService.getConsultation(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        return ResponseEntity.ok(consultationService.getAdminStats());
    }

    
    @GetMapping("/consultations")
    public ResponseEntity<Page<AdminConsultationDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(consultationService.getAllConsultationsForAdmin(page, size));
    }

    
    @GetMapping("/consultations/{id}")
    public ResponseEntity<AdminConsultationDto> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(consultationService.getConsultationDetail(id));
    }

    
    
    @PutMapping("/consultations/{id}/status") 
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id, 
            @RequestBody UpdateStatusRequest req 
    ) {
        
        consultationService.updateStatus(id, req);
        
        return ResponseEntity.ok(Map.of("message", "Estado actualizado correctamente"));
    }
}