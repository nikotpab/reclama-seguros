package com.liclam.lexinsurance.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AdminConsultationDto {
    private Long id;
    private String userName;
    private String deceasedName;
    private String docNumber;
    private String status;
    private LocalDateTime createdAt;
    private String signatureBase64;

    
    private BigDecimal liquidationGrossValue; 
    private BigDecimal liquidationCommission; 
    private BigDecimal liquidationNetValue;   
    private LocalDateTime liquidationDate;    
}