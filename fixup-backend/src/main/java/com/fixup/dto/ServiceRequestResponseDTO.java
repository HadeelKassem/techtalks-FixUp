package com.fixup.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;


@Data
public class ServiceRequestResponseDTO {

private Long id;
private String clientName;
private String providerName;
private String categoryName;
private String location;
private LocalDate preferredDate;
private String notes;
private String status;
private LocalDateTime createdAt;

private boolean clientConfirmedComplete;
private boolean providerConfirmedComplete;

private boolean sharingLocation;
private Double currentLatitude;
private Double currentLongitude;
private LocalDateTime locationUpdatedAt;

}