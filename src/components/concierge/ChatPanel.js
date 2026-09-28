import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiArrowRight,
  HiArrowUp,
  HiMap,
  HiMicrophone,
  HiSparkles,
  HiSpeakerWave,
  HiStop,
  HiTrash,
  HiXMark,
} from "react-icons/hi2";
import { MAX_QUESTION, askAssistant, getSpeechRecognition, listen, speak } from "../../services/assistantApi";

const EASE = [0.22, 1, 0.36, 1];
const STORAGE_KEY = "concierge.chat";
const HISTORY_SENT = 8;
const HISTORY_STORED = 30;

const SUGGESTIONS = ["What does Mario build?", "Show me his mobile apps", "How can I hire him?"];

const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

function loadMessages() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* ─── State ──────────────────────────────────────── */

/**
 * Conversation state. Lives above the panel so the thread survives closing
 * and reopening; mirrored to sessionStorage for the length of the visit.
 */
export function useAssistantChat() {
  const [messages, setMessages] = useState(loadMessages);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);

  const messagesRef = useRef(messages);
  const requestRef = useRef(0);
  const cancelSpeechRef = useRef(() => {});
  messagesRef.current = messages;

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-HISTORY_STORED)));
    } catch {
      /* storage unavailable — thread just won't persist */
    }
  }, [messages]);

  useEffect(() => () => cancelSpeechRef.current(), []);

  const stopSpeaking = useCallback(() => {
    cancelSpeechRef.current();
    setSpeakingId(null);
  }, []);

  const readAloud = useCallback((message) => {
    cancelSpeechRef.current();
    const speech = speak(message.text);
    cancelSpeechRef.current = speech.cancel;
    setSpeakingId(message.id);
    speech.promise.then(() => setSpeakingId((id) => (id === message.id ? null : id)));
  }, []);

  /** Asks the question, given the history that precedes it. */
  const request = useCallback(
    async (question, history, { spoken }) => {
      const requestId = ++requestRef.current;
      setPending(true);
      setError(null);
      try {
        const result = await askAssistant(
          question,
          history.slice(-HISTORY_SENT).map(({ role, text }) => ({ role, text }))
        );
        if (requestId !== requestRef.current) return;
        const reply = { id: uid(), role: "assistant", text: result.answer, link: result.link };
        setMessages((list) => [...list, reply]);
        if (spoken) readAloud(reply);
      } catch (err) {
        if (requestId === requestRef.current) setError({ message: err.message, question, spoken });
      } finally {
        if (requestId === requestRef.current) setPending(false);
      }
    },
    [readAloud]
  );

  const send = useCallback(
    (text, { spoken = false } = {}) => {
      const question = text.trim();
      if (!question || pending) return;
      stopSpeaking();
      const history = messagesRef.current;
      setMessages((list) => [...list, { id: uid(), role: "user", text: question }]);
      request(question, history, { spoken });
    },
    [pending, request, stopSpeaking]
  );

  /** Re-asks the failed question; it is already the last message in the thread. */
  const retry = useCallback(() => {
    if (!error || pending) return;
    request(error.question, messagesRef.current.slice(0, -1), { spoken: error.spoken });
  }, [error, pending, request]);

  const clear = useCallback(() => {
    requestRef.current += 1;
    stopSpeaking();
    setPending(false);
    setError(null);
    setMessages([]);
  }, [stopSpeaking]);

  return { messages, pending, error, speakingId, send, retry, clear, readAloud, stopSpeaking };
}

/* ─── View ───────────────────────────────────────── */

const IconButton = ({ label, onClick, children, className = "" }) => (
  <button type="button" className={`cc-icon-btn ${className}`} onClick={onClick} aria-label={label} title={label}>
    {children}
  </button>
);

const Message = ({ message, speaking, onSpeak, onStopSpeaking, onLink }) => {
  const isUser = message.role === "user";
  return (
    <motion.li
      className={`cc-msg ${isUser ? "cc-msg--user" : "cc-msg--ai"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <p className="cc-msg__text">{message.text}</p>
      {!isUser && (message.link || canSpeak) && (
        <div className="cc-msg__actions">
          {message.link && (
            <button type="button" className="cc-msg__link" onClick={() => onLink(message.link)}>
              {message.link.label}
              <HiArrowRight aria-hidden="true" />
            </button>
          )}
          {canSpeak && (
            <IconButton
              label={speaking ? "Stop reading" : "Read aloud"}
              onClick={() => (speaking ? onStopSpeaking() : onSpeak(message))}
              className={`cc-icon-btn--sm${speaking ? " is-active" : ""}`}
            >
              {speaking ? <HiStop aria-hidden="true" /> : <HiSpeakerWave aria-hidden="true" />}
            </IconButton>
          )}
        </div>
      )}
    </motion.li>
  );
};

const ChatPanel = ({ chat, onClose, onStartTour, onLink }) => {
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const inputRef = useRef(null);
  const threadRef = useRef(null);
  const cancelListenRef = useRef(() => {});
  const canListen = Boolean(getSpeechRecognition());

  const { messages, pending, error, speakingId } = chat;
  const empty = messages.length === 0 && !pending;

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
    return () => cancelListenRef.current();
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, pending, error]);

  const submit = (e) => {
    e.preventDefault();
    if (!draft.trim() || pending) return;
    chat.send(draft);
    setDraft("");
  };

  const toggleListening = async () => {
    if (listening) {
      cancelListenRef.current();
      return;
    }
    chat.stopSpeaking();
    setVoiceError("");
    setDraft("");
    setListening(true);
    const session = listen({ onPartial: setDraft });
    cancelListenRef.current = session.cancel;
    try {
      const transcript = await session.promise;
      setDraft("");
      chat.send(transcript, { spoken: true });
    } catch (err) {
      if (err.code !== "CANCELLED") setVoiceError(err.message);
    } finally {
      setListening(false);
      cancelListenRef.current = () => {};
    }
  };

  return (
    <motion.section
      id="concierge-panel"
      className="cc-panel"
      role="dialog"
      aria-label="Ask about Mario"
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <header className="cc-panel__head">
        <span className="cc-orb" aria-hidden="true">
          <HiSparkles />
        </span>
        <div className="cc-panel__title">
          <h2>Ask about Mario</h2>
          <p>AI assistant</p>
        </div>
        <div className="cc-panel__actions">
          {!empty && (
            <IconButton label="Take the site tour" onClick={onStartTour}>
              <HiMap aria-hidden="true" />
            </IconButton>
          )}
          {!empty && (
            <IconButton label="Clear conversation" onClick={chat.clear}>
              <HiTrash aria-hidden="true" />
            </IconButton>
          )}
          <IconButton label="Close" onClick={onClose}>
            <HiXMark aria-hidden="true" />
          </IconButton>
        </div>
      </header>

      <div className="cc-thread" ref={threadRef} aria-live="polite">
        {empty ? (
          <div className="cc-empty">
            <p>Hi! Ask me anything about Mario's work, skills, or how to hire him.</p>
            <div className="cc-chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="cc-chip" onClick={() => chat.send(s)}>
                  {s}
                </button>
              ))}
            </div>
            <button type="button" className="cc-tour-cta" onClick={onStartTour}>
              <HiMap aria-hidden="true" />
              <span>Take a 1-minute tour of the site</span>
              <HiArrowRight aria-hidden="true" className="cc-tour-cta__arrow" />
            </button>
          </div>
        ) : (
          <ol className="cc-messages">
            {messages.map((m) => (
              <Message
                key={m.id}
                message={m}
                speaking={speakingId === m.id}
                onSpeak={chat.readAloud}
                onStopSpeaking={chat.stopSpeaking}
                onLink={onLink}
              />
            ))}
            <AnimatePresence>
              {pending && (
                <motion.li
                  key="typing"
                  className="cc-msg cc-msg--ai cc-typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  aria-label="Thinking"
                >
                  <span />
                  <span />
                  <span />
                </motion.li>
              )}
            </AnimatePresence>
          </ol>
        )}

        {error && (
          <div className="cc-error" role="alert">
            <span>{error.message}</span>
            <button type="button" onClick={chat.retry}>
              Retry
            </button>
          </div>
        )}
      </div>

      <form className="cc-composer" onSubmit={submit}>
        <input
          ref={inputRef}
          className="cc-composer__input"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (voiceError) setVoiceError("");
          }}
          placeholder={listening ? "Listening…" : "Ask a question…"}
          maxLength={MAX_QUESTION}
          readOnly={listening}
          aria-label="Your question"
          enterKeyHint="send"
        />
        {canListen && (
          <IconButton
            label={listening ? "Stop listening" : "Ask with your voice"}
            onClick={toggleListening}
            className={listening ? "is-listening" : ""}
          >
            {listening ? <HiStop aria-hidden="true" /> : <HiMicrophone aria-hidden="true" />}
          </IconButton>
        )}
        <button
          type="submit"
          className="cc-composer__send"
          disabled={!draft.trim() || pending || listening}
          aria-label="Send"
          title="Send"
        >
          <HiArrowUp aria-hidden="true" />
        </button>
      </form>
      {voiceError && <p className="cc-voice-error">{voiceError}</p>}
    </motion.section>
  );
};

export default ChatPanel;
