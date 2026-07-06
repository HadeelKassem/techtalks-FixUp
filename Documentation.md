
FixUp — Sprint 1 Feature Report

# Member: Hadi Ibrahim

## 1-Feature
Booking system  allows clients to Book services, providers to accept or deny them, and both sides to confirm job completion.
## 2-Files Created or Modified
●ServiceRequestDTO.java
●ServiceRequestResponseDTO.java
●ServiceRequestRepository.java
●UserRepository.java
●CategoryRepository.java
●ServiceRequestService.java
●ServiceRequestController.java
●ServiceRequest.java (modified — added clientConfirmedComplete and providerConfirmedComplete fields)
## 3-Implementation
●Controller (ServiceRequestController): Exposes the /api/bookings endpoints and delegates all logic to the service layer — it doesn't perform business logic itself.
●Service (ServiceRequestService): Contains the core business logic: creating a booking, validating status transitions (e.g. a request can't be accepted if it's already completed), and handling two-sided completion confirmation.
●Repositories: ServiceRequestRepository, UserRepository, and CategoryRepository extend Spring Data JPA's JpaRepository to talk to the Data Base.
●DTOs: ServiceRequestDTO ( requests) and ServiceRequestResponseDTO ( responses) keep the API's request/response shape separate from the database entity.
●Completion logic: A ServiceRequest only moves to COMPLETED once both clientConfirmedComplete and providerConfirmedComplete are true.
## 4-Database Changes
Added two new boolean columns to the service_request table:
●client_confirmed_complete (default false)
●provider_confirmed_complete (default false)
## 5-API Endpoints (backend)
●POST /api/bookings — Client creates a new booking
●GET /api/bookings/my — Get all bookings belonging to the logged-in user
●GET /api/bookings/{id} — Get a single booking by ID
●PUT /api/bookings/{id}/accept — Provider accepts the request
●PUT /api/bookings/{id}/deny — Provider denies the request
●PUT /api/bookings/{id}/cancel — Client cancels the request
●PUT /api/bookings/{id}/complete — Client confirms job completion
●PUT /api/bookings/{id}/complete-provider — Provider confirms job completion

## 6-Challenges
●I came into this task with foundational Java knowledge but no prior experience with Spring Boot, REST APIs, JPA/Hibernate, or how a multi-layer backend (Controller → Service → Repository) actually works. Every part of this feature — DTOs, annotations, repository interfaces, status lifecycle logic — was a completely new concept I had to learn from scratch before I could write a single working line.
●Understanding why the code needed to be structured a certain way (e.g. why DTOs are separate from the entity, why logic lives in the Service and not the Controller) took as much effort as writing the code itself.
●Designing the two-sided completion logic (clientConfirmedComplete / providerConfirmedComplete) required first understanding the original single-status approach, then reasoning through why it wasn't enough — that this needed both parties' confirmation instead of one side being able to unilaterally close out a job.
