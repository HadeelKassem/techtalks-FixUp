package com.fixup.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fixup.dto.ReportDTO;
import com.fixup.dto.UpdateReportStatusRequest;
import com.fixup.model.User;
import com.fixup.repository.UserRepository;
import com.fixup.service.ReportService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminReportController {

    private final ReportService reportService;
    private final UserRepository userRepository;

   @GetMapping("/providers/{userId}/reports")
    public ResponseEntity<List<ReportDTO>> getReportsForProvider(@PathVariable Long userId) {
        User provider = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        List<ReportDTO> reports = reportService.getReportsForProvider(provider);
        return ResponseEntity.ok(reports);
    }

    @PatchMapping("/reports/{reportId}/status")
    public ResponseEntity<ReportDTO> updateReportStatus(
            @PathVariable Long reportId,
            @RequestBody UpdateReportStatusRequest request) {
        ReportDTO updated = reportService.updateReportStatus(reportId, request.getStatus());
        return ResponseEntity.ok(updated);
    }

}
