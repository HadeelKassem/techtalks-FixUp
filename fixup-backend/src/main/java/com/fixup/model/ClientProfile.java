package com.fixup.model;

import jakarta.persistence.*;
import lombok.Data;

// @Data       → Lombok auto-generates getters, setters, equals, hashCode, toString
// @Entity     → Marks this class as a JPA entity (maps to a database table)
// @Table      → Specifies the exact table name in the database
@Data
@Entity
@Table(name = "client_profiles")
public class ClientProfile {

    // @Id                 → This field is the primary key
    // @GeneratedValue     → The DB auto-increments the id (1, 2, 3, ...)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @OneToOne  → Each ClientProfile belongs to exactly one User (and vice versa)
    // @JoinColumn → The FK column "user_id" lives in the client_profiles table
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Simple nullable columns — no annotation needed, Spring JPA maps them by name
    private String phone;
    private String address;
    private String city;
    private String profilePictureUrl;
}
