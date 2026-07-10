package com.fixup.dto;

import java.time.LocalDateTime;

import com.fixup.model.Report;

import lombok.Data;

@Data
public class ReportDTO {

    private Long id;
    private String reason;
    private Report.ReportStatus status;
    private String reportedByName; // who filed it (the client)
    private LocalDateTime createdAt;

}
