import styled from "styled-components";

const Wrapper = styled.div`
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--border-color);

  .inbox-container {
    display: flex;
    gap: 1.5rem;
    height: calc(100vh - 250px);
    min-height: 550px;
  }

  /* Tabs Bar styling */
  .tabs-bar {
    display: flex;
    gap: 1rem;
    border-bottom: 2px solid var(--border-color);
    margin-bottom: 2rem;
  }

  .tab-btn {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-secondary-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: var(--transition);
    margin-bottom: -2px;

    &:hover {
      color: var(--text-color);
    }

    &.active {
      color: var(--primary-500);
      border-bottom-color: var(--primary-500);
    }
  }

  /* Messages Layout */
  .chat-layout {
    display: flex;
    width: 100%;
    border-radius: var(--border-radius);
    overflow: hidden;
    border: 1px solid var(--border-color);
    background: var(--background-color);
  }

  /* Left Panel: Conversations */
  .conversations-panel {
    width: 320px;
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    background: var(--background-secondary-color);
  }

  .panel-header {
    padding: 1.25rem;
    border-bottom: 1px solid var(--border-color);
    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-color);
    }
  }

  .conv-list {
    flex: 1;
    overflow-y: auto;
  }

  .conv-item {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 1.25rem;
    display: flex;
    gap: 0.75rem;
    align-items: start;
    cursor: pointer;
    transition: var(--transition);

    &:hover {
      background: var(--background-color);
    }

    &.active {
      background: var(--background-color);
      border-left: 4px solid var(--primary-500);
      padding-left: 1rem; /* Adjust padding to compensate border width */
    }
  }

  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: var(--primary-500);
    color: var(--white);
    display: grid;
    place-items: center;
    font-weight: 600;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .conv-info {
    flex: 1;
    min-w: 0;
  }

  .conv-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .conv-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .conv-time {
    font-size: 0.75rem;
    color: var(--text-secondary-color);
  }

  .conv-subtitle {
    font-size: 0.8rem;
    color: var(--text-secondary-color);
    margin: 0 0 0.25rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .conv-preview {
    font-size: 0.8rem;
    color: var(--text-secondary-color);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .badge {
    background: var(--primary-500);
    color: var(--white);
    border-radius: 50%;
    padding: 0.15rem 0.4rem;
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 1.25rem;
    text-align: center;
    align-self: center;
  }

  /* Right Panel: Chat Area */
  .chat-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--background-color);
  }

  .chat-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--background-secondary-color);
  }

  .back-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      color: var(--text-color);
    }
  }

  .chat-title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .chat-subtitle {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-secondary-color);
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--background-secondary-color);
  }

  .message-wrapper {
    display: flex;
    width: 100%;
    &.my-message {
      justify-content: flex-end;
    }
    &.other-message {
      justify-content: flex-start;
    }
  }

  .message-bubble {
    max-width: 70%;
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius);
    position: relative;
    box-shadow: var(--shadow-1);
    
    p {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;
      word-break: break-word;
    }

    .message-time {
      display: block;
      font-size: 0.7rem;
      margin-top: 0.25rem;
      text-align: right;
    }
  }

  .my-message .message-bubble {
    background: var(--primary-500);
    color: var(--white);
    border-bottom-right-radius: 0;

    .message-time {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .other-message .message-bubble {
    background: var(--background-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-bottom-left-radius: 0;

    .message-time {
      color: var(--text-secondary-color);
    }
  }

  .chat-input-form {
    padding: 1rem;
    border-top: 1px solid var(--border-color);
    background: var(--background-secondary-color);
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .chat-input {
    flex: 1;
    padding: 0.75rem 1.2rem;
    border-radius: 2rem;
    border: 1px solid var(--border-color);
    background: var(--background-color);
    color: var(--text-color);
    font-size: 0.9rem;
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--primary-500);
    }
  }

  .send-btn {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: none;
    background: var(--primary-500);
    color: var(--white);
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: var(--transition);

    &:hover {
      background: var(--primary-600);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  /* Notifications Layout */
  .notifications-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .notifications-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    h4 {
      margin: 0;
      color: var(--text-secondary-color);
      font-size: 0.95rem;
    }
  }

  .mark-all-btn {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-color);
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: var(--transition);

    &:hover {
      background: var(--background-color);
      border-color: var(--text-color);
    }
  }

  .notif-tabs {
    display: flex;
    gap: 0.5rem;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 1.5rem;
  }

  .notif-tab-btn {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    color: var(--text-secondary-color);
    cursor: pointer;
    transition: var(--transition);

    &:hover {
      color: var(--text-color);
    }

    &.active {
      color: var(--primary-500);
      border-bottom-color: var(--primary-500);
      font-weight: 600;
    }
  }

  .notif-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .notif-card {
    padding: 1.25rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    transition: var(--transition);
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 1rem;

    &:hover {
      box-shadow: var(--shadow-2);
      transform: translateY(-2px);
    }

    &.unread {
      background: var(--background-color);
      border-left-width: 5px;
    }

    &.read {
      background: var(--background-secondary-color);
      opacity: 0.8;
      border-left-width: 5px;
    }

    /* Status-specific left borders and icon background tints */
    &.status-success {
      border-left-color: #10b981;
      .icon-wrapper {
        color: #10b981;
        background: rgba(16, 185, 129, 0.1);
      }
    }
    
    &.status-warning {
      border-left-color: #f59e0b;
      .icon-wrapper {
        color: #f59e0b;
        background: rgba(245, 158, 11, 0.1);
      }
    }

    &.status-error {
      border-left-color: #ef4444;
      .icon-wrapper {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
      }
    }

    &.status-info {
      border-left-color: #3b82f6;
      .icon-wrapper {
        color: #3b82f6;
        background: rgba(59, 130, 246, 0.1);
      }
    }
  }

  .notif-content {
    display: flex;
    gap: 1rem;
    flex: 1;
  }

  .icon-wrapper {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .notif-info {
    h5 {
      margin: 0 0 0.25rem 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-color);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-secondary-color);
      line-height: 1.4;
    }
  }

  .unread-dot {
    width: 0.5rem;
    height: 0.5rem;
    background: var(--primary-500);
    border-radius: 50%;
    display: inline-block;
  }

  .notif-time {
    display: block;
    font-size: 0.75rem;
    color: var(--text-secondary-color);
    margin-top: 0.5rem;
  }

  .mark-read-btn {
    background: var(--background-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    padding: 0.35rem 0.75rem;
    border-radius: var(--border-radius);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;

    &:hover {
      background: var(--background-secondary-color);
      border-color: var(--text-color);
    }
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    h3 {
      font-size: 1.2rem;
      color: var(--text-color);
      margin-bottom: 0.5rem;
    }
    p {
      color: var(--text-secondary-color);
      font-size: 0.9rem;
      margin: 0;
    }
  }

  .loading-state {
    display: grid;
    place-items: center;
    padding: 3rem;
  }
`;

export default Wrapper;
