package com.liclam.lexinsurance.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "consultations")
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String consultationType;     
    private String docType;
    private String deathDate;
    private String kinship;

    private boolean authorizationSigned;
    
    @Column(name = "signature_data")
    private byte[] signatureData;
    
    private LocalDateTime signatureTimestamp;

    private boolean paymentApproved;
    
    private boolean mandateSigned;
    
    @Column(name = "mandate_signature_data")
    private byte[] mandateSignatureData;

    @Column(name = "liquidation_gross_value")
    private BigDecimal liquidationGrossValue; 

    @Column(name = "liquidation_commission")
    private BigDecimal liquidationCommission; 

    @Column(name = "liquidation_net_value")
    private BigDecimal liquidationNetValue;   

    @Column(name = "liquidation_date")
    private LocalDateTime liquidationDate;
    
    private LocalDateTime mandateSignatureTimestamp;

    private String docCedulaPath;
    private String docDefuncionPath;
    private String docParentescoPath;

    private String status; 
    private LocalDateTime createdAt;

    private String deceasedName;
    private String docNumber;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = "IN_PROGRESS";
        }
    }
}