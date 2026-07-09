package com.fixup.dto;

import com.fixup.model.User;

import lombok.Data;

@Data
public class UpdateUserStatusRequest {
    
    private User.UserStatus status;


}
