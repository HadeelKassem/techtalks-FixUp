package com.fixup.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.fixup.dto.LocationUpdateRequest;
import com.fixup.dto.ServiceRequestDTO;
import com.fixup.dto.ServiceRequestResponseDTO;
import com.fixup.model.Category;
import com.fixup.model.ProviderProfile;
import com.fixup.model.Role;
import com.fixup.model.ServiceRequest;
import com.fixup.model.User;
import com.fixup.repository.CategoryRepository;
import com.fixup.repository.ProviderProfileRepository;
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

    @Autowired
    private ProviderProfileRepository providerProfileRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

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

        ServiceRequestResponseDTO response = mapToResponseDTO(serviceRequestRepository.save(request));

        // Let any provider currently viewing the "available jobs" feed for
        // this category know a new request just came in.
        messagingTemplate.convertAndSend("/topic/categories/" + category.getId() + "/requests", response);

        return response;
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

        // Guard against two providers accepting the same request in a race.
        if (request.getProvider() != null) {
            throw new RuntimeException("This request has already been accepted by another provider");
        }

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

    // BOTH - get my bookings.
    // CLIENT sees requests they created; PROVIDER sees requests they've
    // accepted/completed. This was previously calling findByClient for
    // everyone, which meant a provider's "my bookings" was always empty.
    public List<ServiceRequestResponseDTO> getMyRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ServiceRequest> requests = (user.getRole() == Role.PROVIDER)
                ? serviceRequestRepository.findByProvider(user)
                : serviceRequestRepository.findByClient(user);

        return requests.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // PROVIDER - pending requests in this provider's category that no
    // provider has claimed yet. This is the "available jobs" feed that
    // powers the Accept/Deny buttons on the provider dashboard.
    public List<ServiceRequestResponseDTO> getAvailableRequests(String providerEmail) {
        User user = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProviderProfile profile = providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));

        if (profile.getCategory() == null) {
            // No category on file — nothing to show rather than erroring,
            // so the dashboard doesn't break for providers created before
            // categories existed.
            return List.of();
        }

        return serviceRequestRepository
                .findByProviderIsNullAndStatusAndCategory(ServiceRequest.RequestStatus.PENDING, profile.getCategory())
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private ServiceRequestResponseDTO mapToResponseDTO(ServiceRequest request) {
        ServiceRequestResponseDTO response = new ServiceRequestResponseDTO();
        response.setId(request.getId());
        response.setClientName(request.getClient().getUsername());
        response.setProviderName(request.getProvider() != null ? request.getProvider().getUsername() : null);
        response.setCategoryName(request.getCategory().getName());
        response.setLocation(request.getLocation());
        response.setPreferredDate(request.getPreferredDate());
        response.setNotes(request.getNotes());
        response.setStatus(request.getStatus().name());
        response.setCreatedAt(request.getCreatedAt());

        response.setClientConfirmedComplete(request.isClientConfirmedComplete());
        response.setProviderConfirmedComplete(request.isProviderConfirmedComplete());

        response.setSharingLocation(request.isSharingLocation());
        response.setCurrentLatitude(request.getCurrentLatitude());
        response.setCurrentLongitude(request.getCurrentLongitude());
        response.setLocationUpdatedAt(request.getLocationUpdatedAt());

        return response;
    }

    // PROVIDER - start sharing location
public ServiceRequestResponseDTO startSharingLocation(Long id, String providerEmail) {
    ServiceRequest request = serviceRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (request.getProvider() == null || !request.getProvider().getEmail().equals(providerEmail)) {
        throw new RuntimeException("Not authorized");
    }

    request.setSharingLocation(true);
    return mapToResponseDTO(serviceRequestRepository.save(request));
}

// PROVIDER - stop sharing location
public ServiceRequestResponseDTO stopSharingLocation(Long id, String providerEmail) {
    ServiceRequest request = serviceRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (request.getProvider() == null || !request.getProvider().getEmail().equals(providerEmail)) {
        throw new RuntimeException("Not authorized");
    }

    request.setSharingLocation(false);
    return mapToResponseDTO(serviceRequestRepository.save(request));
}

// PROVIDER - send periodic location update
public ServiceRequestResponseDTO updateLocation(Long id, LocationUpdateRequest locationUpdate, String providerEmail) {
    ServiceRequest request = serviceRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (request.getProvider() == null || !request.getProvider().getEmail().equals(providerEmail)) {
        throw new RuntimeException("Not authorized");
    }

    if (!request.isSharingLocation()) {
        throw new RuntimeException("Location sharing is not active for this booking");
    }

    request.setCurrentLatitude(locationUpdate.getLatitude());
    request.setCurrentLongitude(locationUpdate.getLongitude());
    request.setLocationUpdatedAt(LocalDateTime.now());

   ServiceRequestResponseDTO response = mapToResponseDTO(serviceRequestRepository.save(request));

    messagingTemplate.convertAndSend("/topic/requests/" + id + "/location", response);

    return response;
}

}