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

    // CLIENT - create booking
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

        return mapToResponseDTO(serviceRequestRepository.save(request));
    }

    // CLIENT - cancel booking
    public ServiceRequestResponseDTO cancelRequest(Long id, String clientEmail) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!request.getClient().getEmail().equals(clientEmail)) {
            throw new RuntimeException("Not authorized");
        }

        request.setStatus(ServiceRequest.RequestStatus.CANCELLED);
        return mapToResponseDTO(serviceRequestRepository.save(request));
    }

    // CLIENT - mark complete
   public ServiceRequestResponseDTO clientCompleteRequest(Long id, String clientEmail) {
    ServiceRequest request = serviceRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (!request.getClient().getEmail().equals(clientEmail)) {
        throw new RuntimeException("Not authorized");
    }

    request.setClientConfirmedComplete(true);

    if (request.isProviderConfirmedComplete()) {
        request.setStatus(ServiceRequest.RequestStatus.COMPLETED);
    }

    return mapToResponseDTO(serviceRequestRepository.save(request));
}

    // PROVIDER - accept booking
    public ServiceRequestResponseDTO acceptRequest(Long id, String providerEmail) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User provider = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        request.setProvider(provider);
        request.setStatus(ServiceRequest.RequestStatus.ACCEPTED);
        return mapToResponseDTO(serviceRequestRepository.save(request));
    }

    // PROVIDER - deny booking
    public ServiceRequestResponseDTO denyRequest(Long id, String providerEmail) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        request.setStatus(ServiceRequest.RequestStatus.CANCELLED);
        return mapToResponseDTO(serviceRequestRepository.save(request));
    }

    // PROVIDER - mark complete
    public ServiceRequestResponseDTO providerCompleteRequest(Long id, String providerEmail) {
    ServiceRequest request = serviceRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    request.setProviderConfirmedComplete(true);

    if (request.isClientConfirmedComplete()) {
        request.setStatus(ServiceRequest.RequestStatus.COMPLETED);
    }

    return mapToResponseDTO(serviceRequestRepository.save(request));
}

    // BOTH - get one booking by id
    public ServiceRequestResponseDTO getById(Long id) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToResponseDTO(request);
    }

    // BOTH - get my bookings
    public List<ServiceRequestResponseDTO> getMyRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return serviceRequestRepository.findByClient(user)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
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

        response.setClientConfirmedComplete(request.isClientConfirmedComplete());
        response.setProviderConfirmedComplete(request.isProviderConfirmedComplete());

        return response;
    }
}