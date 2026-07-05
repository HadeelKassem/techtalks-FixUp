package com.fixup.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;


@Data
public class ServiceRequestResponseDTO {

private Long id;
private String ClientName;
private String ProviderName;
private String CategoryName;
private String location;
private LocalDate preferredDate;
private String notes;
private String status;
private LocalDateTime createdAt;

}