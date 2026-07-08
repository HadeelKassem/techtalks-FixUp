package com.fixup.dto;

import lombok.Data;


// We dont expose our JPA entities directly in API responses (sensitive fields  cause circular JSON serialization loops)
//instead =>we copy only the fields we want to share into a DTO
@Data
public class ClientProfileDto {

    // Basic user info (comes from the User entity)
    private Long userId;
    private String name;
    private String email;

    // Profile-specific info (comes from the ClientProfile entity)
    private String phone;
    private String address;
    private String city;
    private String profilePictureUrl;
}
