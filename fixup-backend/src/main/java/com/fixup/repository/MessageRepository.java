package com.fixup.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fixup.model.Message;


public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByServiceRequestIdOrderBySentAtAsc(Long serviceRequestId);
}