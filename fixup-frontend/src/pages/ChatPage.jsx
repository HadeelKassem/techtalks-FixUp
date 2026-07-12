import { useEffect, useMemo, useRef, useState } from "react";
import "./ChatPage.css";

const conversations = [
  {
    id: 1,
    name: "Sarah Haddad",
    initials: "SH",
    service: "Emergency Plumbing Repair",
    status: "In Progress",
    online: true,
    unread: 2,
    messages: [
      { id: 1, sender: "client", text: "Hello, are you still coming today?", time: "10:18 AM" },
      { id: 2, sender: "provider", text: "Yes. I am finishing another job and should arrive in around 25 minutes.", time: "10:20 AM" },
      { id: 3, sender: "client", text: "Perfect, thank you. Please message me when you are close.", time: "10:21 AM" },
    ],
  },
  {
    id: 2,
    name: "Karim Mansour",
    initials: "KM",
    service: "Pipe Installation",
    status: "Accepted",
    online: false,
    unread: 0,
    messages: [
      { id: 1, sender: "client", text: "I uploaded a photo of the washing machine area.", time: "Yesterday" },
      { id: 2, sender: "provider", text: "I received it. I will bring the correct fittings.", time: "Yesterday" },
    ],
  },
  {
    id: 3,
    name: "Maya Khoury",
    initials: "MK",
    service: "Bathroom Repair",
    status: "Completed",
    online: true,
    unread: 0,
    messages: [
      { id: 1, sender: "client", text: "Thank you, everything is working well now.", time: "Jun 25" },
      { id: 2, sender: "provider", text: "You are welcome. Please contact me if you need anything else.", time: "Jun 25" },
    ],
  },
];

function statusClass(status) {
  return (status || "").toLowerCase().replaceAll(" ", "-");
}

function ChatPage({ role = "PROVIDER" }) {
  const [activeConversationId, setActiveConversationId] = useState(conversations[0].id);
  const [conversationMessages, setConversationMessages] = useState(() =>
    Object.fromEntries(conversations.map((conversation) => [conversation.id, conversation.messages])),
  );
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) || conversations[0],
    [activeConversationId],
  );

  const messages = conversationMessages[activeConversation.id] || [];
  const currentSender = role === "CLIENT" ? "client" : "provider";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();
    const text = messageInput.trim();
    if (!text) return;

    const newMessage = {
      id: Date.now(),
      sender: currentSender,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversationMessages((current) => ({
      ...current,
      [activeConversation.id]: [...(current[activeConversation.id] || []), newMessage],
    }));
    setMessageInput("");
  };

  return (
    <main className="chat-page-wrap">
      <section className="chat-page-heading">
        <div>
          <p className="chat-eyebrow">LIVE COMMUNICATION</p>
          <h1>Messages</h1>
          <p>Chat with the {role === "CLIENT" ? "provider assigned to your request" : "clients connected to your jobs"}.</p>
        </div>
        <span className="chat-demo-note">Frontend preview</span>
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
              const latest = conversationMessages[conversation.id]?.at(-1);
              const active = conversation.id === activeConversation.id;
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
                      <small>{latest?.time}</small>
                    </span>
                    <span className="conversation-service">{conversation.service}</span>
                    <span className="conversation-preview">{latest?.text}</span>
                  </span>
                  {conversation.unread > 0 && <span className="unread-count">{conversation.unread}</span>}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="chat-card">
          <header className="chat-card-header">
            <div className="chat-person">
              <span className="chat-avatar">{activeConversation.initials}</span>
              <div>
                <h2>{activeConversation.name}</h2>
                <p>
                  <span className={activeConversation.online ? "presence-dot online" : "presence-dot"} />
                  {activeConversation.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            <div className="chat-header-actions">
              <span className={`status-badge ${statusClass(activeConversation.status)}`}>
                {activeConversation.status}
              </span>
              <button type="button" className="secondary-button compact" title="Live location will be added next">
                View location
              </button>
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
            <div className="chat-date-divider"><span>Today</span></div>
            {messages.map((message) => {
              const mine = message.sender === currentSender;
              return (
                <div key={message.id} className={mine ? "message-row is-mine" : "message-row"}>
                  <div className="message-bubble">
                    <p>{message.text}</p>
                    <span>{message.time}</span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form className="message-composer" onSubmit={sendMessage}>
            <button type="button" className="attachment-button" aria-label="Attach a file" title="Attachments will be connected later">
              +
            </button>
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
        </div>
      </section>
    </main>
  );
}

export default ChatPage;
