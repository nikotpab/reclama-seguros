package com.liclam.lexinsurance.dto;
import lombok.Data;

@Data
public class ConsultationRequest {
    private Long userId;
    private String type;
    private String deceasedName;
    private String docType;
    private String docNumber;
    private String deathDate;
    private String kinship;
}