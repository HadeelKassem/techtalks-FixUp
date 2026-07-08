package com.fixup.model;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "client_profiles")
public class ClientProfile {

   

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

 
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    
    private String phone;
    private String address;
    private String city;
    private String profilePictureUrl;
}
