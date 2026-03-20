import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, X, Send, Loader2, Volume2, VolumeX, Bot, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "khushi";
  text: string;
  timestamp: Date;
  sources?: { components: any[]; standards: any[] };
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function KhushiAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "khushi",
      text: "Hello! I'm Khushi, your Railway RAMS AI assistant 🚂\n\nI can help you with:\n• EN/IEC standards guidance\n• SIL level assessment\n• RAMS calculations & analysis\n• Component compliance verification\n• Safety case guidance\n\nAsk me anything or use the microphone to speak!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !synthRef.current) return;
    synthRef.current.cancel();
    const plainText = text.replace(/[•\*#\n]+/g, ". ").replace(/\s+/g, " ").substring(0, 500);
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(v => v.name.includes("female") || v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Karen") || (v.name.includes("Google") && v.name.includes("US")));
    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  }, [voiceEnabled]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }
    if (recognitionRef.current) recognitionRef.current.stop();
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        setInputText(t);
        setTranscript("");
      }
    };
    recognition.onend = () => { setIsListening(false); setTranscript(""); };
    recognition.onerror = () => { setIsListening(false); setTranscript(""); };
    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const sendMessage = async (text?: string) => {
    const question = text || inputText.trim();
    if (!question || isLoading) return;

    setInputText("");
    setTranscript("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: question, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await response.json();
      const answer = data.answer || "I'm sorry, I couldn't process that request.";

      const khushiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "khushi",
        text: answer,
        timestamp: new Date(),
        sources: data.sources
      };
      setMessages(prev => [...prev, khushiMsg]);
      if (voiceEnabled) speakText(answer);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: "khushi",
        text: "I encountered an error connecting to the AI service. Please check your API key configuration.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('•') || line.startsWith('-')) {
        return <div key={i} className="flex gap-2 mt-1"><span className="text-blue-400 mt-0.5">•</span><span>{line.replace(/^[•\-]\s*/, '')}</span></div>;
      }
      if (line.startsWith('#')) {
        return <div key={i} className="font-bold text-white mt-2">{line.replace(/^#+\s*/, '')}</div>;
      }
      if (line.trim() === '') return <div key={i} className="h-1" />;
      return <div key={i}>{line}</div>;
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        title="Open Khushi AI Assistant"
      >
        <div className="relative">
          <div className="w-16 h-16 gradient-railway rounded-2xl shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300">
            <Bot className="h-7 w-7" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          <div className="absolute -top-10 right-0 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with Khushi AI
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-96 sm:w-[420px]'}`}>
      <div className="bg-gray-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="gradient-railway px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm flex items-center gap-2">
              Khushi
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              <Badge className="bg-white/20 text-white text-xs border-0 px-1.5 py-0 h-4">AI</Badge>
            </div>
            <div className="text-white/70 text-xs">Railway RAMS Expert</div>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-400 animate-pulse' : isSpeaking ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            <button onClick={() => { if (voiceEnabled && synthRef.current) synthRef.current.cancel(); setVoiceEnabled(!voiceEnabled); }} className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
              {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <button onClick={() => { setIsOpen(false); if (synthRef.current) synthRef.current.cancel(); }} className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-950">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "khushi" && (
                    <div className="w-7 h-7 gradient-railway rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-gray-800 text-gray-100 rounded-tl-sm"
                  }`}>
                    {msg.role === "khushi" ? formatText(msg.text) : msg.text}
                    {msg.sources && (msg.sources.components.length > 0 || msg.sources.standards.length > 0) && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-xs text-gray-400">
                        <div className="font-medium text-gray-300 mb-1">Sources found:</div>
                        {msg.sources.components.slice(0, 2).map((c, i) => (
                          <div key={i}>📦 {c.name}</div>
                        ))}
                        {msg.sources.standards.slice(0, 2).map((s: any, i: number) => (
                          <div key={i}>📋 {s.code}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 gradient-railway rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice transcript */}
            {(isListening || transcript) && (
              <div className="px-4 py-2 bg-gray-900 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-blue-400">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  {transcript || "Listening..."}
                </div>
              </div>
            )}

            {/* Quick suggestions */}
            <div className="px-4 py-2 bg-gray-900 flex gap-2 overflow-x-auto border-t border-white/5">
              {["What is SIL 4?", "EN 50126 RAMS", "CBTC safety requirements", "Brake SIL level"].map(q => (
                <button key={q} onClick={() => sendMessage(q)} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex-shrink-0 border border-white/5">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 pt-3 bg-gray-950 border-t border-white/8 flex gap-2 items-center">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                  isListening
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-white/5"
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask Khushi about RAMS..."
                className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 gradient-railway text-white rounded-xl flex-shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
