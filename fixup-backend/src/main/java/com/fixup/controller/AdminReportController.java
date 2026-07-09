package com.fixup.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fixup.dto.ReportDTO;
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

    @GetMapping("/{userId}/reports")
    public ResponseEntity<List<ReportDTO>> getReportsForProvider(@PathVariable Long userId) {
        User provider = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        List<ReportDTO> reports = reportService.getReportsForProvider(provider);
        return ResponseEntity.ok(reports);
    }

}
