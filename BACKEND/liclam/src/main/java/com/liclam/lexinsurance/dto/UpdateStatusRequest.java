package com.liclam.lexinsurance.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class UpdateStatusRequest {
    private String status;
    private BigDecimal grossValue; 
    private BigDecimal commission; 
    private BigDecimal netValue;   
}