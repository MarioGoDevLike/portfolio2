import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { scroller } from "react-scroll";
import { BsMicFill, BsStopFill } from "react-icons/bs";
import { SCROLL_DURATION, SCROLL_OFFSET } from "../../constants";
import {
  cancelListening,
  getSpeechRecognition,
  listenOnce,
  requestPortfolioAnswer,
  speakNarration,
} from "../../services/tourApi";

const SUGGESTIONS = [
  "What are Mario's experiences?",
  "Tell me about his mobile work",
  "How can I contact Mario?",
];

const goToSection = (id) => {
  scroller.scrollTo(id, {
    smooth: true,
    duration: SCROLL_DURATION,
    offset: SCROLL_OFFSET,
  });
};

const VoiceAskPanel = () => {
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [partial, setPartial] = useState("");
  const [question, setQuestion] = useState("");
  const [typed, setTyped] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);
  const cancelSpeechRef = useRef(() => {});

  useEffect(() => {
    setSupported(Boolean(getSpeechRecognition()));
    return () => {
      cancelListening();
      cancelSpeechRef.current();
    };
  }, []);

  const stopVoice = () => {
    cancelListening();
    cancelSpeechRef.current();
    setListening(false);
    setSpeaking(false);
  };

  const ask = async (text) => {
    const cleaned = String(text || "").trim();
    if (!cleaned) return;

    stopVoice();
    setError(null);
    setQuestion(cleaned);
    setPartial("");
    setAnswer("");
    setThinking(true);

    try {
      const result = await requestPortfolioAnswer(cleaned);
      setAnswer(result.answer);
      setThinking(false);

      const goContact =
        result.navigateTo === "contact" ||
        result.topic === "contact" ||
        /contact|hire|email|reach|get in touch|talk to|message/i.test(cleaned);

      if (goContact) {
        // Keep the AI panel open; just take the page to Contact.
        goToSection("contact");
      }

      setSpeaking(true);
      const { promise, cancel } = speakNarration(result.answer, {
        enabled: true,
      });
      cancelSpeechRef.current = cancel;
      await promise;
    } catch (err) {
      if (err.code !== "CANCELLED") {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setThinking(false);
      setSpeaking(false);
    }
  };

  const startListening = async () => {
    if (listening || thinking || speaking) return;
    setError(null);
    setPartial("");
    setListening(true);

    try {
      const transcript = await listenOnce({
        lang: "en-US",
        timeoutMs: 14000,
        onPartial: (text) => setPartial(text),
      });
      setListening(false);
      setPartial(transcript);
      await ask(transcript);
    } catch (err) {
      setListening(false);
      if (err.code !== "CANCELLED") {
        setError(err.message || "Could not hear you");
      }
    }
  };

  const busy = listening || thinking || speaking;

  return (
    <div className="voice-ask">
      <p className="voice-ask__copy">
        Ask anything about Mario or this portfolio — by voice or text. Answers
        stay on-topic and reply out loud.
      </p>

      <div className="voice-ask__mic-wrap">
        <motion.button
          type="button"
          className={`voice-ask__mic ${listening ? "is-listening" : ""} ${speaking ? "is-speaking" : ""}`}
          onClick={() => {
            if (listening) {
              cancelListening();
              setListening(false);
              return;
            }
            if (speaking) {
              cancelSpeechRef.current();
              setSpeaking(false);
              return;
            }
            startListening();
          }}
          disabled={!supported || thinking}
          whileTap={{ scale: 0.96 }}
          aria-label={
            listening ? "Stop listening" : speaking ? "Stop speaking" : "Ask with voice"
          }
        >
          {listening || speaking ? (
            <BsStopFill size={22} />
          ) : (
            <BsMicFill size={22} />
          )}
        </motion.button>
        <p className="voice-ask__status">
          {listening
            ? "Listening… ask your question"
            : thinking
              ? "Thinking…"
              : speaking
                ? "Speaking answer…"
                : supported
                  ? "Tap the mic and ask"
                  : "Voice input needs Chrome — type below instead"}
        </p>
      </div>

      {(partial || question) && (
        <div className="voice-ask__bubble voice-ask__bubble--you">
          <span className="voice-ask__who">You</span>
          <p>{partial || question}</p>
        </div>
      )}

      {answer && (
        <div className="voice-ask__bubble voice-ask__bubble--ai">
          <span className="voice-ask__who">AI Concierge</span>
          <p>{answer}</p>
        </div>
      )}

      {error && <p className="voice-ask__error">{error}</p>}

      <div className="voice-ask__suggestions">
        {SUGGESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            className="voice-ask__chip"
            disabled={busy}
            onClick={() => ask(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <form
        className="voice-ask__form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!typed.trim() || busy) return;
          const q = typed.trim();
          setTyped("");
          ask(q);
        }}
      >
        <input
          className="voice-ask__input"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="Or type a question…"
          disabled={busy}
        />
        <button
          type="submit"
          className="voice-ask__send"
          disabled={busy || !typed.trim()}
        >
          Ask
        </button>
      </form>
    </div>
  );
};

export default VoiceAskPanel;
