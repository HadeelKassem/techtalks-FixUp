package com.fixup.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "provider_profiles")
public class ProviderProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // A provider offers services under exactly one category.
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String bio;
    private String skills;
    private String serviceArea;
    private String profilePictureUrl;
    private boolean isVerified = false;
    private double avgRating = 0.0;
}