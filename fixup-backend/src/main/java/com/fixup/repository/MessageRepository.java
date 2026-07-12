package com.fixup.repository;

import com.fixup.model.Conversation;
import com.fixup.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);

    List<Message> findByConversationIdOrderBySentAtAsc(Long conversationId);
}