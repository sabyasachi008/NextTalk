'use client';

import { Message } from '@app/types';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';

import { useAuth, useChatScroll, useClient } from '@/lib';
import { Paths } from '@/constants';
import styles from './chat.module.css';

interface ChatFormControls extends HTMLFormControlsCollection {
  message: HTMLInputElement;
}

interface ChatFormElement extends HTMLFormElement {
  readonly elements: ChatFormControls;
}

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const inputMessageRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const { image, name, logout } = useAuth();
  const { client } = useClient();
  const chatRef = useChatScroll(messages);
  const router = useRouter();

  // Listen for messages and typing events
  useEffect(() => {
    if (!client) return;

    const onMessage = (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    const onTyping = ({ name: typingName }: { name: string }) => {
      setTypingUsers((prev) => new Set(prev).add(typingName));
    };

    const onStopTyping = ({ name: typingName }: { name: string }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(typingName);
        return next;
      });
    };

    client.on('message', onMessage);
    client.on('typing', onTyping);
    client.on('stopTyping', onStopTyping);

    return () => {
      client.off('message', onMessage);
      client.off('typing', onTyping);
      client.off('stopTyping', onStopTyping);
    };
  }, [client]);

  // Emit typing/stopTyping with debounce
  const handleTyping = useCallback(() => {
    if (!client || !name) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      client.emit('typing', { name });
    }

    // Reset the stop-typing timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      client.emit('stopTyping', { name });
    }, 2000);
  }, [client, name]);

  const handleSubmit = (event: FormEvent<ChatFormElement>) => {
    event.preventDefault();
    const value = event.currentTarget.elements.message.value.trim();
    if (!value) return;

    client?.emit('message', {
      user: { name, image },
      message: value,
    });

    // Stop typing indicator on send
    if (isTypingRef.current) {
      isTypingRef.current = false;
      client?.emit('stopTyping', { name });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }

    if (inputMessageRef.current) inputMessageRef.current.value = '';
  };

  const handleLogout = () => {
    // Stop any typing indicator
    if (isTypingRef.current && client) {
      client.emit('stopTyping', { name });
    }
    logout();
    router.push(Paths.login);
  };

  // Build typing indicator text
  const typingText = (() => {
    const users = Array.from(typingUsers);
    if (users.length === 0) return null;
    if (users.length === 1) return `${users[0]} is typing`;
    if (users.length === 2) return `${users[0]} and ${users[1]} are typing`;
    return `${users[0]} and ${users.length - 1} others are typing`;
  })();

  return (
    <section className={styles.chatContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerAvatar}>
          {name ? name.charAt(0).toUpperCase() : '?'}
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.headerName}>ChatApp</div>
          <div className={styles.headerStatus}>
            {typingText ? (
              <span className={styles.typingIndicator}>
                <span className={styles.typingDots}>
                  <span></span><span></span><span></span>
                </span>
                {typingText}
              </span>
            ) : (
              <>
                <span className={styles.onlineDot}></span>
                {messages.length > 0
                  ? `${new Set(messages.map(m => m.user.name)).size} participant(s)`
                  : 'Waiting for messages...'}
              </>
            )}
          </div>
        </div>
        <button
          className={styles.logoutButton}
          onClick={handleLogout}
          title='Logout'
        >
          ⎋ Logout
        </button>
      </header>

      {/* Messages */}
      <div className={styles.messagesArea} ref={chatRef}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateInner}>
              <div className={styles.emptyStateIcon}>🔒</div>
              <p className={styles.emptyStateText}>
                Messages are end-to-end encrypted.<br />
                Send a message to start the conversation.
              </p>
            </div>
          </div>
        )}

        {messages.map(({ date, user, message: msgText }, idx) => {
          const isOwn = user.name === name;
          return (
            <div
              className={`${styles.messageRow} ${isOwn ? styles.messageRowOwn : styles.messageRowOther}`}
              key={`${user.name}-${idx}`}
            >
              {!isOwn && (
                <div className={styles.msgAvatar}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={user.image} alt={user.name} />
                </div>
              )}
              <div className={`${styles.bubble} ${isOwn ? styles.bubbleOwn : styles.bubbleOther}`}>
                {!isOwn && (
                  <div className={styles.bubbleSender}>{user.name}</div>
                )}
                <div className={styles.bubbleText}>{msgText}</div>
                <div className={styles.bubbleMeta}>
                  <span className={styles.bubbleTime}>
                    {moment(date).format('h:mm a')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form className={styles.inputArea} onSubmit={handleSubmit}>
        <input
          className={styles.messageInput}
          type='text'
          name='message'
          ref={inputMessageRef}
          placeholder='Type a message'
          autoComplete='off'
          autoFocus
          onChange={handleTyping}
        />
        <button type='submit' className={styles.sendButton} aria-label='Send message'>
          ➤
        </button>
      </form>
    </section>
  );
};

export default ChatBox;