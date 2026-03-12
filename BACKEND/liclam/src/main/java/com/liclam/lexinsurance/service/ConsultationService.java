package com.liclam.lexinsurance.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.liclam.lexinsurance.dto.AdminConsultationDto;
import com.liclam.lexinsurance.dto.AdminStatsDto;
import com.liclam.lexinsurance.dto.ConsultationRequest;
import com.liclam.lexinsurance.dto.UpdateStatusRequest;
import com.liclam.lexinsurance.entity.Consultation;
import com.liclam.lexinsurance.entity.User;
import com.liclam.lexinsurance.repository.ConsultationRepository;
import com.liclam.lexinsurance.repository.UserRepository;
import com.liclam.lexinsurance.util.CryptoService;

@Service
public class ConsultationService {

    @Autowired private ConsultationRepository consultationRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private CryptoService cryptoService;

    @Value("${app.storage.location}")
    private String uploadDir;

 public Consultation createConsultation(ConsultationRequest req) {
        User user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Consultation cons = new Consultation();
        cons.setUser(user);
        cons.setConsultationType(req.getType());
        cons.setDocType(req.getDocType());
        cons.setDeathDate(req.getDeathDate());
        cons.setKinship(req.getKinship());
        
        cons.setDeceasedName(req.getDeceasedName());
        cons.setDocNumber(req.getDocNumber());
        
        return consultationRepo.save(cons);
    }

    public Consultation getConsultation(Long id) {
        return consultationRepo.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
    }

    public void saveSignature(Long consultationId, String base64Signature) {
        processSignature(consultationId, base64Signature, false);
    }

    public void processPayment(Long id) {
    Consultation consultation = consultationRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Consulta no encontrada"));
    consultation.setPaymentApproved(true);
    consultation.setStatus("PAID");
    consultationRepo.save(consultation);
    }

    public void saveMandateSignature(Long consultationId, String base64Signature) {
        processSignature(consultationId, base64Signature, true);
    }

    private void processSignature(Long consultationId, String base64Signature, boolean isMandate) {
        Consultation consultation = consultationRepo.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consulta no encontrada"));

        String base64Image = base64Signature.contains(",") ? base64Signature.split(",")[1] : base64Signature;
        byte[] rawImageBytes = Base64.getDecoder().decode(base64Image);
        byte[] compressedBytes = cryptoService.compress(rawImageBytes);
        byte[] encryptedBytes = cryptoService.encryptBytes(compressedBytes);

        if (isMandate) {
            consultation.setMandateSigned(true);
            consultation.setMandateSignatureData(encryptedBytes);
            consultation.setMandateSignatureTimestamp(LocalDateTime.now());
            consultation.setStatus("CLAIM_STARTED");
        } else {
            consultation.setAuthorizationSigned(true);
            consultation.setSignatureData(encryptedBytes);
            consultation.setSignatureTimestamp(LocalDateTime.now());
        }
        
        consultationRepo.save(consultation);
    }

    public void uploadDocument(Long consultationId, String docType, MultipartFile file) throws IOException {
        Consultation consultation = consultationRepo.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consulta no encontrada"));

        Path uploadPath = Paths.get(uploadDir + "/docs");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = consultationId + "_" + docType + "_" + UUID.randomUUID() + ".pdf"; 
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        switch (docType) {
            case "cedula": consultation.setDocCedulaPath(filePath.toString()); break;
            case "defuncion": consultation.setDocDefuncionPath(filePath.toString()); break;
            case "parentesco": consultation.setDocParentescoPath(filePath.toString()); break;
        }

        consultationRepo.save(consultation);
    }

    public AdminStatsDto getStats() {
        AdminStatsDto stats = new AdminStatsDto();
        stats.setTotalConsultas(consultationRepo.count());
        stats.setPendientes(consultationRepo.findAll().stream().filter(c -> "IN_PROGRESS".equals(c.getStatus())).count());
        stats.setEncontradas(consultationRepo.findAll().stream().filter(c -> "FOUND".equals(c.getStatus())).count());
        stats.setFinalizadas(consultationRepo.findAll().stream().filter(c -> "PAID".equals(c.getStatus()) || "LIQUIDATION_READY".equals(c.getStatus())).count());
        return stats;
    }

public Page<AdminConsultationDto> getAllConsultationsForAdmin(int page, int size) {
        
        Page<Object[]> rawPage = consultationRepo.findAdminResumen(PageRequest.of(page, size));
        
        return rawPage.map(row -> {
            AdminConsultationDto dto = new AdminConsultationDto();
            dto.setId((Long) row[0]);
            dto.setUserName(row[1] != null ? (String) row[1] : "Eliminado");
            
            
            dto.setDeceasedName((String) row[2]); 
            dto.setDocNumber((String) row[3]);
            
            dto.setStatus((String) row[4]);
            dto.setCreatedAt((LocalDateTime) row[5]);
            return dto;
        });
    }

  public AdminConsultationDto getConsultationDetail(Long id) {
        Consultation c = consultationRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Trámite no encontrado"));
            
        return convertToAdminDto(c);
    }

 public AdminStatsDto getAdminStats() {
        AdminStatsDto stats = new AdminStatsDto();
        stats.setTotalConsultas(consultationRepo.count());       
        
        stats.setPendientes(consultationRepo.countByStatus("IN_PROGRESS"));
        stats.setEncontradas(consultationRepo.countByStatus("FOUND"));
        
        stats.setFinalizadas(consultationRepo.findAll().stream()
            .filter(c -> "PAID".equals(c.getStatus()) || "LIQUIDATION_READY".equals(c.getStatus()))
            .count());
            
        return stats;
    }
    
    public void updateStatus(Long id, UpdateStatusRequest req) {
        
        Consultation c = consultationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Trámite no encontrado"));

        
        c.setStatus(req.getStatus());

        
        if ("LIQUIDATION_READY".equals(req.getStatus())) {
            
            
            if (req.getGrossValue() != null) {
                c.setLiquidationGrossValue(req.getGrossValue());
                c.setLiquidationCommission(req.getCommission());
                c.setLiquidationNetValue(req.getNetValue());
                c.setLiquidationDate(java.time.LocalDateTime.now());
            }
        }

        consultationRepo.save(c);
    }

    private AdminConsultationDto convertToAdminDto(Consultation c) {
      AdminConsultationDto dto = new AdminConsultationDto();
        dto.setId(c.getId());
        
        if (c.getUser() != null) {
            dto.setUserName(c.getUser().getEmail());
        } else {
            dto.setUserName("Usuario Eliminado");
        }

        dto.setDeceasedName(c.getDeceasedName()); 
        dto.setDocNumber(c.getDocNumber());
        dto.setStatus(c.getStatus());
        dto.setCreatedAt(c.getCreatedAt());

        // --- AGREGA ESTO AQUÍ (MAPEO DE LIQUIDACIÓN) ---
        // Solo enviamos datos si el estado es liquidación lista o pagado
        if ("LIQUIDATION_READY".equals(c.getStatus()) || "PAID".equals(c.getStatus())) {
            dto.setLiquidationGrossValue(c.getLiquidationGrossValue());
            dto.setLiquidationCommission(c.getLiquidationCommission());
            dto.setLiquidationNetValue(c.getLiquidationNetValue());
            dto.setLiquidationDate(c.getLiquidationDate());
        }
        
        if (c.getSignatureData() != null) {
            try {
                
                byte[] compressed = cryptoService.decryptBytes(c.getSignatureData());
                byte[] rawImage = cryptoService.decompress(compressed);
                String base64 = java.util.Base64.getEncoder().encodeToString(rawImage);
                dto.setSignatureBase64("data:image/png;base64," + base64);
            } catch (Exception e) {
                System.err.println("Error recovering signature: " + e.getMessage());
            }
        }

        return dto;
    }
}