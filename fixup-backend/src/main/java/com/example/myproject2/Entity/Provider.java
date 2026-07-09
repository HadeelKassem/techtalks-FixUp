package com.example.myproject2.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private Double ratingAvg;

    private String location;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}