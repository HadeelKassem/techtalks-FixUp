package com.fixup.dto;

import lombok.Data;

@Data
public class PublicProviderDto {

    private Long id;
    private String name;
    private String bio;
    private String skills;
    private String serviceArea;
    private boolean isVerified;
    private double avgRating;
}