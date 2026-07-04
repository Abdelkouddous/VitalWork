import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
  Email,
  MarkEmailRead,
  CheckCircle,
  Info,
  Warning,
  Error as ErrorIcon,
  Send,
  Chat,
  Notifications,
  ArrowBack,
} from "@mui/icons-material";
import Wrapper from "../../assets/wrappers/InboxWrapper";

function InboxJobSeeker() {
  const [activeTab, setActiveTab] = useState("messages");

  return (
    <Wrapper>
      {/* Tab Bar */}
      <div className="tabs-bar">
        <button
          onClick={() => setActiveTab("messages")}
          className={`tab-btn ${activeTab === "messages" ? "active" : ""}`}
        >
          <Chat fontSize="small" />
          Messages
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`tab-btn ${activeTab === "notifications" ? "active" : ""}`}
        >
          <Notifications fontSize="small" />
          Notifications
        </button>
      </div>

      {activeTab === "messages" ? <MessagesPanel /> : <NotificationsPanel />}
    </Wrapper>
  );
}

// ─── Messages Panel (LinkedIn-style) ──────────────────────────────────────────

function MessagesPanel() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await customFetch.get("/healthcare-professionals/me");
        setCurrentUser(data.jobSeeker);
      } catch {
        // silent
      }
    };
    fetchUser();
  }, []);

  // Socket connection
  useEffect(() => {
    const isDev = import.meta.env.MODE === "development";
    const socketURL = isDev ? "http://localhost:5100" : "/";
    const newSocket = io(socketURL);
    setSocket(newSocket);

    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data.message]);
      // Update conversation list last message
      setConversations((prev) =>
        prev.map((c) =>
          c._id === data.conversationId
            ? {
                ...c,
                lastMessage: {
                  content: data.message.content,
                  createdAt: data.message.createdAt,
                  senderModel: data.message.senderModel,
                },
              }
            : c
        )
      );
    });

    return () => newSocket.disconnect();
  }, []);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await customFetch.get("/healthcare-professionals/conversations");
        setConversations(data.conversations || []);
      } catch {
        toast.error("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConv) return;
    const fetchMessages = async () => {
      setMsgLoading(true);
      try {
        const { data } = await customFetch.get(
          `/healthcare-professionals/messages/${activeConv._id}`
        );
        setMessages(data.messages || []);
        // Join socket room
        socket?.emit("join_chat", activeConv._id);
        // Reset unread count in local state
        setConversations((prev) =>
          prev.map((c) =>
            c._id === activeConv._id ? { ...c, unreadCount: 0 } : c
          )
        );
      } catch {
        toast.error("Failed to load messages");
      } finally {
        setMsgLoading(false);
      }
    };
    fetchMessages();
  }, [activeConv?._id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    try {
      const { data } = await customFetch.post("/healthcare-professionals/messages/send", {
        content: newMessage,
        receiverId: activeConv.employerId?._id,
        jobId: activeConv.jobId?._id,
      });

      socket?.emit("send_message", {
        conversationId: activeConv._id,
        message: data.message,
      });

      setMessages((prev) => [...prev, data.message]);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConv._id
            ? {
                ...c,
                lastMessage: {
                  content: newMessage,
                  createdAt: new Date().toISOString(),
                  senderModel: "JobSeeker",
                },
              }
            : c
        )
      );
      setNewMessage("");
    } catch (error) {
      toast.error(
        error?.response?.data?.msg || "Failed to send message"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-16">
        <Chat
          style={{ fontSize: 64 }}
          className="mx-auto mb-4 text-[var(--grey-400)]"
        />
        <h3 className="text-xl font-semibold text-[var(--text-secondary-color)] mb-2">
          No conversations yet
        </h3>
        <p className="text-[var(--text-secondary-color)]">
          When an employer accepts your application, you'll be able to chat
          with them here.
        </p>
      </div>
    );
  }

  return (
    <div className="chat-layout">
      {/* ── Left Panel: Conversation List ── */}
      <div
        className={`${
          activeConv ? "hidden md:flex" : "flex"
        } conversations-panel`}
      >
        <div className="panel-header">
          <h3>Messaging</h3>
        </div>
        <div className="conv-list">
          {conversations.map((conv) => {
            const employer = conv.employerId;
            const job = conv.jobId;
            const isActive = activeConv?._id === conv._id;
            const lastMsg = conv.lastMessage;

            return (
              <button
                key={conv._id}
                onClick={() => setActiveConv(conv)}
                className={`conv-item ${isActive ? "active" : ""}`}
              >
                {/* Avatar */}
                <div className="avatar">
                  {employer?.name?.charAt(0)?.toUpperCase() || "E"}
                </div>

                {/* Content */}
                <div className="conv-info">
                  <div className="conv-meta">
                    <span className="conv-name">
                      {employer?.name} {employer?.lastName}
                    </span>
                    {lastMsg?.createdAt && (
                      <span className="conv-time">
                        {new Date(lastMsg.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <p className="conv-subtitle">
                    {job?.position} — {job?.company}
                  </p>
                  {lastMsg && (
                    <p className="conv-preview">
                      {lastMsg.senderModel === "JobSeeker" ? "You: " : ""}
                      {lastMsg.content}
                    </p>
                  )}
                </div>

                {/* Unread Badge */}
                {conv.unreadCount > 0 && (
                  <span className="badge">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right Panel: Active Conversation ── */}
      <div
        className={`${
          activeConv ? "flex" : "hidden md:flex"
        } chat-panel`}
      >
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <button
                onClick={() => setActiveConv(null)}
                className="back-btn md:hidden"
              >
                <ArrowBack />
              </button>
              <div className="avatar">
                {activeConv.employerId?.name?.charAt(0)?.toUpperCase() || "E"}
              </div>
              <div>
                <h3 className="chat-title">
                  {activeConv.employerId?.name}{" "}
                  {activeConv.employerId?.lastName}
                </h3>
                <p className="chat-subtitle">
                  {activeConv.jobId?.position} — {activeConv.jobId?.company}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="messages-container">
              {msgLoading ? (
                <div className="loading-state">
                  <div className="loading"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="empty-state">
                  <p>No messages yet — start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSender =
                    msg.sender?._id === currentUser?._id ||
                    msg.sender === currentUser?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`message-wrapper ${
                        isSender ? "my-message" : "other-message"
                      }`}
                    >
                      <div className="message-bubble">
                        <p>{msg.content}</p>
                        <span className="message-time">
                          {msg.createdAt &&
                            new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSend} className="chat-input-form">
              <input
                type="text"
                className="chat-input"
                placeholder="Write a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="send-btn"
              >
                <Send fontSize="small" />
              </button>
            </form>
          </>
        ) : (
          <div className="empty-state" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Chat style={{ fontSize: 56 }} className="text-[var(--grey-300)] mb-4" />
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the left to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Notifications Panel (Preserved from original) ───────────────────────────

function NotificationsPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    try {
      const res = await customFetch.get("/healthcare-professionals/notifications");
      setItems(res.data.notifications || []);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await customFetch.patch(`/healthcare-professionals/notifications/${id}/read`, null);
      setItems((list) =>
        list.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      toast.success("Marked as read");
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const markAllRead = async () => {
    try {
      const unreadIds = items
        .filter((item) => !item.read)
        .map((item) => item._id);
      await Promise.all(
        unreadIds.map((id) =>
          customFetch.patch(`/healthcare-professionals/notifications/${id}/read`, null)
        )
      );
      setItems((list) => list.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type.toLowerCase()) {
      case "success":
      case "accepted":
        return <CheckCircle className="text-green-500" />;
      case "warning":
        return <Warning className="text-yellow-500" />;
      case "error":
      case "rejected":
        return <ErrorIcon className="text-red-500" />;
      default:
        return <Info className="text-blue-500" />;
    }
  };

  const getNotificationStyle = (type) => {
    switch (type.toLowerCase()) {
      case "success":
      case "accepted":
        return "status-success";
      case "warning":
        return "status-warning";
      case "error":
      case "rejected":
        return "status-error";
      default:
        return "status-info";
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "unread") return !item.read;
    if (filter === "read") return item.read;
    return true;
  });

  const unreadCount = items.filter((item) => !item.read).length;

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div>
          <h4>
            {unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "All caught up!"}
          </h4>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="mark-all-btn">
            <MarkEmailRead />
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="notif-tabs">
        {[
          { key: "all", label: "All", count: items.length },
          { key: "unread", label: "Unread", count: unreadCount },
          { key: "read", label: "Read", count: items.length - unreadCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`notif-tab-btn ${filter === tab.key ? "active" : ""}`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="notif-list">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <Email style={{ fontSize: 56 }} className="text-[var(--grey-300)] mb-4" />
            <h3>
              {filter === "unread"
                ? "No unread notifications"
                : filter === "read"
                ? "No read notifications"
                : "No notifications yet"}
            </h3>
            <p>
              {filter === "all" &&
                "Notifications will appear here when you receive them"}
            </p>
          </div>
        ) : (
          filteredItems.map((notification) => (
            <div
              key={notification._id}
              className={`notif-card ${
                !notification.read ? "unread" : "read"
              } ${getNotificationStyle(notification.type)}`}
            >
              <div className="notif-content">
                <div className="icon-wrapper">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notif-info">
                  <h5>
                    {notification.type}
                    {!notification.read && <span className="unread-dot"></span>}
                  </h5>
                  <p>{notification.message}</p>
                  <span className="notif-time">
                    {new Date(
                      notification.createdAt || Date.now()
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {!notification.read && (
                <button
                  className="mark-read-btn"
                  onClick={() => markRead(notification._id)}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredItems.length > 0 && (
        <div className="mt-6 text-center text-[var(--text-secondary-color)] text-sm">
          Showing {filteredItems.length} of {items.length} notifications
        </div>
      )}
    </div>
  );
}

export default InboxJobSeeker;
