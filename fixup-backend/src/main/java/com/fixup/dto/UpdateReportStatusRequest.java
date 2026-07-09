package com.fixup.dto;

import com.fixup.model.Report;

import lombok.Data;

@Data
public class UpdateReportStatusRequest {

    private Report.ReportStatus status;

}
