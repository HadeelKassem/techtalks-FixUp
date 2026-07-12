package com.fixup.repository;

import com.fixup.model.Conversation;
import com.fixup.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    List<Conversation> findByClient(User client);

    List<Conversation> findByProvider(User provider);

    Optional<Conversation> findByClientAndProvider(User client, User provider);
}