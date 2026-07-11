package com.fixup.dto;

import com.fixup.model.UserStatus;

import lombok.Data;

@Data
public class UpdateUserStatusRequest{
  private UserStatus status; 
}