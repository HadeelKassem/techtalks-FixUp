package com.fixup.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fixup.dto.ServiceRequestDTO;
import com.fixup.dto.ServiceRequestResponseDTO;
import com.fixup.model.Category;
import com.fixup.model.ServiceRequest;
import com.fixup.model.User;
import com.fixup.repository.CategoryRepository;
import com.fixup.repository.ServiceRequestRepository;
import com.fixup.repository.UserRepository;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public ServiceRequestResponseDTO createRequest(ServiceRequestDTO dto, String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        ServiceRequest request = new ServiceRequest();
        request.setClient(client);
        request.setCategory(category);
        request.setLocation(dto.getLocation());
        request.setPreferredDate(dto.getPreferredDate());
        request.setNotes(dto.getNotes());
        request.setStatus(ServiceRequest.RequestStatus.PENDING);

        ServiceRequest saved = serviceRequestRepository.save(request);
        return mapToResponseDTO(saved);
    }

    public List<ServiceRequestResponseDTO> getMyRequests(String clientEmail) {
        User client = userRepository.findByEmail(clientEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return serviceRequestRepository.findByClient(client)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ServiceRequestResponseDTO> getIncomingRequests(String providerEmail) {
     userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return serviceRequestRepository.findByStatus(ServiceRequest.RequestStatus.PENDING)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public ServiceRequestResponseDTO updateStatus(Long requestId, String newStatus, String userEmail) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(ServiceRequest.RequestStatus.valueOf(newStatus));
        ServiceRequest updated = serviceRequestRepository.save(request);
        return mapToResponseDTO(updated);
    }

    private ServiceRequestResponseDTO mapToResponseDTO(ServiceRequest request) {
        ServiceRequestResponseDTO response = new ServiceRequestResponseDTO();
        response.setId(request.getId());
        response.setClientName(request.getClient().getName());
        response.setProviderName(request.getProvider() != null ? request.getProvider().getName() : null);
        response.setCategoryName(request.getCategory().getName());
        response.setLocation(request.getLocation());
        response.setPreferredDate(request.getPreferredDate());
        response.setNotes(request.getNotes());
        response.setStatus(request.getStatus().name());
        response.setCreatedAt(request.getCreatedAt());
        return response;
    }
}