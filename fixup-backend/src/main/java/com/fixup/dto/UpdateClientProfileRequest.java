package com.fixup.dto;

import lombok.Data;

// This DTO is what the frontend SENDS to us in the request body (PUT/PATCH)
//control over what the client is allowed to change => cant change the email
@Data
public class UpdateClientProfileRequest {

    private String name;          // allow updating name
    private String phone;
    private String address;
    private String city;
    private String profilePictureUrl;
}
