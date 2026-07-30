package com.fixup.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reviewresponsedto{

    private Long id;
    private String clientName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}