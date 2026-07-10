package com.fixup.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "providers")
public class Provider extends User {

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double ratingAvg = 0.0;

    private String location;
}