package com.fixup.repository;

import com.fixup.model.Category;
import com.fixup.model.ServiceRequest;
import com.fixup.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByClient(User client);
    List<ServiceRequest> findByProvider(User provider);
    List<ServiceRequest> findByStatus(ServiceRequest.RequestStatus status);
    List<ServiceRequest> findByClientAndStatus(User client, ServiceRequest.RequestStatus status);

    // Unclaimed requests (no provider yet) in a given category and status —
    // this is the "available jobs" feed for providers.
    List<ServiceRequest> findByProviderIsNullAndStatusAndCategory(
            ServiceRequest.RequestStatus status, Category category);
}