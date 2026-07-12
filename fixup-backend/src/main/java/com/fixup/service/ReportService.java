package com.fixup.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.fixup.dto.ReportDTO;
import com.fixup.model.Report;
import com.fixup.model.User;
import com.fixup.repository.ReportRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public List<ReportDTO> getReportsForProvider(User provider) {
        return reportRepository.findByProvider(provider)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ReportDTO mapToDto(Report report) {
        ReportDTO dto = new ReportDTO();
        dto.setId(report.getId());
        dto.setReason(report.getReason());
        dto.setStatus(report.getStatus());
        dto.setReportedByName(report.getClient().getUsername());
        dto.setCreatedAt(report.getCreatedAt());
        return dto;
    }

    public ReportDTO updateReportStatus(Long reportId, Report.ReportStatus newStatus) {
    Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
    report.setStatus(newStatus);
    Report saved = reportRepository.save(report);
    return mapToDto(saved);
}

}
