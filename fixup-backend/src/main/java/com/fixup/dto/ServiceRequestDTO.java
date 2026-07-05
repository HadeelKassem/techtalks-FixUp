package com.fixup.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ServiceRequestDTO {

    @NotBlank(message = "Category is required")
    private Long categoryId;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Date is required")
    @Future(message = "Date must be in the future")
    private LocalDate preferredDate;

    private String notes;

}
