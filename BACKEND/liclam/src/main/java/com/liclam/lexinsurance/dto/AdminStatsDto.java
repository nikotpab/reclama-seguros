package com.liclam.lexinsurance.dto;
import lombok.Data;

@Data
public class AdminStatsDto {
    private long totalConsultas;
    private long pendientes;
    private long encontradas;
    private long finalizadas;
}