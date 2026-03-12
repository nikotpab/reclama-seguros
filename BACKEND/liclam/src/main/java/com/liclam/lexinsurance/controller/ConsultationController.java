package com.liclam.lexinsurance.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.liclam.lexinsurance.dto.ConsultationRequest;
import com.liclam.lexinsurance.dto.SignatureRequest;
import com.liclam.lexinsurance.entity.Consultation;
import com.liclam.lexinsurance.repository.ConsultationRepository;
import com.liclam.lexinsurance.service.ConsultationService;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    @Autowired private ConsultationService consultationService;
    @Autowired private ConsultationRepository consultationRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createConsultation(@RequestBody ConsultationRequest req) {
        try {
            Consultation created = consultationService.createConsultation(req);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultation(@PathVariable Long id) {
        return ResponseEntity.ok(consultationService.getConsultation(id));
    }

    @PostMapping("/{id}/sign")
    public ResponseEntity<?> uploadSignature(@PathVariable Long id, @RequestBody SignatureRequest req) {
        try {
            consultationService.saveSignature(id, req.getBase64Signature());
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Firma guardada correctamente."));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(java.util.Collections.singletonMap("error", "Error guardando firma: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<?> processPayment(@PathVariable Long id) {
    try {
        consultationService.processPayment(id);
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Pago exitoso"));
        } catch (Exception e) {
        return ResponseEntity.internalServerError()
            .body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<?> uploadDocument(@PathVariable Long id, 
                                            @RequestParam("type") String type, 
                                            @RequestParam("file") MultipartFile file) {
        try {
            consultationService.uploadDocument(id, type, file);
            return ResponseEntity.ok(Map.of("message", "Documento subido."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error subiendo archivo"));
        }
    }

    @PostMapping("/{id}/sign-mandate")
    public ResponseEntity<?> signMandate(@PathVariable Long id, @RequestBody SignatureRequest req) {
        try {
            consultationService.saveMandateSignature(id, req.getBase64Signature());
            return ResponseEntity.ok(Map.of("message", "Mandato firmado."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

   @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserConsultations(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(consultationRepository.findByUser_Id(userId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

}