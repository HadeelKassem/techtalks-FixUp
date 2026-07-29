import { useEffect, useMemo, useRef, useState } from "react";
import "./ChatPage.css";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { getMyBookings, getConversationMessages, sendChatMessage } from "../api";

function statusClass(status) {
  return (status || "").toLowerCase().replaceAll("_", "-");
}

function initialsFromName(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatTime(value) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ChatPage({ role = "PROVIDER" }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);

  const currentSenderRole = role === "CLIENT" ? "CLIENT" : "PROVIDER";

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) || null,
    [conversations, activeConversationId],
  );

  // --- Load conversations (one per booking) from the database ---
  // ServiceRequestResponseDTO only has flat clientName/providerName strings —
  // there is no nested client/provider object with a .name field.
  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      setLoadingConversations(true);
      setErrorMessage("");
      try {
        const bookings = await getMyBookings();

        const mapped = bookings
          // A conversation only makes sense once a provider is attached —
          // an unclaimed booking has no one on the other end to chat with.
          .filter((booking) => booking.providerName)
          .map((booking) => {
            const otherPartyName = role === "CLIENT" ? booking.providerName : booking.clientName;

            return {
              id: booking.id,
              name: otherPartyName || "Unknown",
              initials: initialsFromName(otherPartyName),
              service: booking.categoryName || "Service request",
              status: booking.status,
              preview: booking.notes || "",
            };
          });

        if (!cancelled) {
          setConversations(mapped);
          setActiveConversationId((current) => current ?? mapped[0]?.id ?? null);
        }
      } catch (err) {
        if (!cancelled) setErrorMessage("Could not load your conversations.");
      } finally {
        if (!cancelled) setLoadingConversations(false);
      }
    }

    loadConversations();
    return () => {
      cancelled = true;
    };
  }, [role]);

  // --- Load message history for the active conversation from the database ---
  useEffect(() => {
    if (!activeConversationId) return;
    let cancelled = false;

    async function loadMessages() {
      setLoadingMessages(true);
      setErrorMessage("");
      try {
        const data = await getConversationMessages(activeConversationId);
        if (!cancelled) {
          setMessages(
            data.map((message) => ({
              id: message.id,
              sender: message.senderRole,
              senderName: message.senderName,
              text: message.text,
              time: formatTime(message.sentAt),
            })),
          );
        }
      } catch (err) {
        if (!cancelled) setErrorMessage("Could not load messages for this conversation.");
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    }

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [activeConversationId]);

  // --- Live updates over WebSocket for the active conversation ---
  useEffect(() => {
    if (!activeConversationId) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe(`/topic/requests/${activeConversationId}/chat`, (frame) => {
          const incoming = JSON.parse(frame.body);
          setMessages((current) => {
            if (current.some((message) => message.id === incoming.id)) return current;
            return [
              ...current,
              {
                id: incoming.id,
                sender: incoming.senderRole,
                senderName: incoming.senderName,
                text: incoming.text,
                time: formatTime(incoming.sentAt),
              },
            ];
          });
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = messageInput.trim();
    if (!text || !activeConversationId) return;

    const optimisticId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: optimisticId,
      sender: currentSenderRole,
      text,
      time: formatTime(),
    };

    setMessages((current) => [...current, optimisticMessage]);
    setMessageInput("");

    try {
      const saved = await sendChatMessage(activeConversationId, { text });
      setMessages((current) =>
        current.map((message) =>
          message.id === optimisticId
            ? {
                id: saved.id,
                sender: saved.senderRole,
                senderName: saved.senderName,
                text: saved.text,
                time: formatTime(saved.sentAt),
              }
            : message,
        ),
      );
    } catch (err) {
      setErrorMessage(err.message || "Message failed to send. Please try again.");
      setMessages((current) => current.filter((message) => message.id !== optimisticId));
    }
  };

  if (loadingConversations) {
    return (
      <main className="chat-page-wrap">
        <p>Loading conversations…</p>
      </main>
    );
  }

  if (conversations.length === 0) {
    return (
      <main className="chat-page-wrap">
        <p>You have no active conversations yet.</p>
      </main>
    );
  }

  return (
    <main className="chat-page-wrap">
      <section className="chat-page-heading">
        <div>
          <p className="chat-eyebrow">LIVE COMMUNICATION</p>
          <h1>Messages</h1>
          <p>Chat with the {role === "CLIENT" ? "provider assigned to your request" : "clients connected to your jobs"}.</p>
        </div>
        {errorMessage && <span className="chat-demo-note">{errorMessage}</span>}
      </section>

      <section className="chat-layout" aria-label="Chat interface">
        <aside className="conversation-panel">
          <div className="conversation-panel-header">
            <div>
              <h2>Conversations</h2>
              <p>{conversations.length} active requests</p>
            </div>
          </div>

          <div className="conversation-list">
            {conversations.map((conversation) => {
              const active = conversation.id === activeConversationId;
              return (
                <button
                  type="button"
                  key={conversation.id}
                  className={active ? "conversation-item is-active" : "conversation-item"}
                  onClick={() => setActiveConversationId(conversation.id)}
                >
                  <span className="conversation-avatar">{conversation.initials}</span>
                  <span className="conversation-copy">
                    <span className="conversation-name-row">
                      <strong>{conversation.name}</strong>
                    </span>
                    <span className="conversation-service">{conversation.service}</span>
                    <span className="conversation-preview">{conversation.preview}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="chat-card">
          {activeConversation && (
            <>
              <header className="chat-card-header">
                <div className="chat-person">
                  <span className="chat-avatar">{activeConversation.initials}</span>
                  <div>
                    <h2>{activeConversation.name}</h2>
                  </div>
                </div>

                <div className="chat-header-actions">
                  <span className={`status-badge ${statusClass(activeConversation.status)}`}>
                    {activeConversation.status}
                  </span>
                </div>
              </header>

              <div className="chat-request-strip">
                <span>
                  <small>Current request</small>
                  <strong>{activeConversation.service}</strong>
                </span>
                <span>
                  <small>Secure chat</small>
                  <strong>Only request participants</strong>
                </span>
              </div>

              <div className="messages-area">
                {loadingMessages ? (
                  <p>Loading messages…</p>
                ) : (
                  <>
                    <div className="chat-date-divider">
                      <span>Today</span>
                    </div>
                    {messages.map((message) => {
                      const mine = message.sender === currentSenderRole;
                      return (
                        <div key={message.id} className={mine ? "message-row is-mine" : "message-row"}>
                          <div className="message-bubble">
                            <p>{message.text}</p>
                            <span>{message.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-composer" onSubmit={sendMessage}>
                <input
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  placeholder="Write a message..."
                  aria-label="Message"
                />
                <button type="submit" className="primary-button chat-send-button" disabled={!messageInput.trim()}>
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default ChatPage;