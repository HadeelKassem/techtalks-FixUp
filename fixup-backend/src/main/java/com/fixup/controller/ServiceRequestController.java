package com.fixup.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fixup.dto.LocationUpdateRequest;
import com.fixup.dto.ServiceRequestDTO;
import com.fixup.dto.ServiceRequestResponseDTO;
import com.fixup.service.ServiceRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    // CLIENT - create booking
    @PostMapping
    public ResponseEntity<ServiceRequestResponseDTO> createRequest(
            @Valid @RequestBody ServiceRequestDTO dto,
            Authentication authentication) {
        return ResponseEntity.status(201).body(
                serviceRequestService.createRequest(dto, authentication.getName()));
    }

    // CLIENT - cancel booking
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ServiceRequestResponseDTO> cancel(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(
                serviceRequestService.cancelRequest(id, authentication.getName()));
    }

    // CLIENT - complete booking
    @PutMapping("/{id}/complete")
    public ResponseEntity<ServiceRequestResponseDTO> clientComplete(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(
                serviceRequestService.clientCompleteRequest(id, authentication.getName()));
    }

    // PROVIDER - accept booking
    @PutMapping("/{id}/accept")
    public ResponseEntity<ServiceRequestResponseDTO> accept(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(
                serviceRequestService.acceptRequest(id, authentication.getName()));
    }

    // PROVIDER - deny booking
    @PutMapping("/{id}/deny")
    public ResponseEntity<ServiceRequestResponseDTO> deny(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(
                serviceRequestService.denyRequest(id, authentication.getName()));
    }

    // PROVIDER - complete booking
    @PutMapping("/{id}/complete-provider")
    public ResponseEntity<ServiceRequestResponseDTO> providerComplete(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(
                serviceRequestService.providerCompleteRequest(id, authentication.getName()));
    }

    // BOTH - get one booking
    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestResponseDTO> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(serviceRequestService.getById(id));
    }

    // BOTH - get my bookings
    @GetMapping("/my")
    public ResponseEntity<List<ServiceRequestResponseDTO>> getMyRequests(
            Authentication authentication) {
        return ResponseEntity.ok(
                serviceRequestService.getMyRequests(authentication.getName()));
    }

    // PROVIDER - start sharing location
@PutMapping("/{id}/location/start")
public ResponseEntity<ServiceRequestResponseDTO> startSharingLocation(
        @PathVariable Long id,
        Authentication authentication) {
    return ResponseEntity.ok(
            serviceRequestService.startSharingLocation(id, authentication.getName()));
}

// PROVIDER - stop sharing location
@PutMapping("/{id}/location/stop")
public ResponseEntity<ServiceRequestResponseDTO> stopSharingLocation(
        @PathVariable Long id,
        Authentication authentication) {
    return ResponseEntity.ok(
            serviceRequestService.stopSharingLocation(id, authentication.getName()));
}

        // PROVIDER - send periodic location update
        @PutMapping("/{id}/location")
          public ResponseEntity<ServiceRequestResponseDTO> updateLocation(
        @PathVariable Long id,
        @RequestBody LocationUpdateRequest locationUpdate,
        Authentication authentication) {
    return ResponseEntity.ok(
            serviceRequestService.updateLocation(id, locationUpdate, authentication.getName()));
}

}