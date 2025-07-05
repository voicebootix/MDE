import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  User, 
  Bot, 
  Loader2,
  Mic
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import VoiceInterface from "../voice/VoiceInterface";

const MessageBubble = ({ message, index }) => {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <Avatar className={`w-8 h-8 flex-shrink-0 ${isUser ? 'bg-blue-500' : 'bg-violet-500'}`}>
        <AvatarFallback className="text-white">
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      <div className={`flex-1 max-w-md ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-4 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-sm' 
            : 'bg-gray-100 text-gray-900 rounded-tl-sm'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`flex items-center gap-1 mt-2 text-xs text-gray-500 ${isUser ? 'justify-end' : ''}`}>
          <span>{message.timestamp ? format(new Date(message.timestamp), 'h:mm a') : 'now'}</span>
        </div>
      </div>
    </motion.div>
  );
};

const TypingIndicator = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mb-6">
        <Avatar className="w-8 h-8 bg-violet-500"><AvatarFallback className="text-white"><Bot className="w-4 h-4" /></AvatarFallback></Avatar>
        <div className="flex-1 max-w-lg">
            <div className="inline-block p-4 rounded-2xl rounded-tl-sm bg-gray-100">
                <div className="flex gap-1.5 items-center">
                    <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
                </div>
            </div>
        </div>
    </motion.div>
);

export default function GlobalConversationPanel({ 
  conversationHistory, 
  isProcessing, 
  onSendMessage,
  userInput,
  setUserInput,
  isRecording,
  onToggleRecording,
  onTranscription
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory]);

  const handleSendMessage = () => {
    if (!userInput.trim() || isProcessing) return;
    onSendMessage(userInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg border-r border-gray-100/80 flex flex-col h-full">
      <div className="p-6 border-b border-gray-100/80">
        <h2 className="text-xl font-bold text-gray-900 display-text">AI Co-Founder Chat</h2>
        <p className="text-sm text-gray-500">Your constant partner, always on.</p>
      </div>
      
      <div className="flex-1 overflow-hidden p-6 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4 -mr-4 custom-scrollbar">
          <AnimatePresence>
            {conversationHistory.map((message, index) => (
              <MessageBubble key={`${message.timestamp}-${index}`} message={message} index={index} />
            ))}
            {isProcessing && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="flex-shrink-0 space-y-3 pt-4 border-t border-gray-200/80">
          <div className="relative">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Talk to your AI co-founder..."
              className="min-h-[100px] max-h-[250px] resize-none border-gray-300 focus:border-violet-500 focus:ring-violet-500 pr-28 bg-white"
              disabled={isProcessing}
            />
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <VoiceInterface
                isRecording={isRecording}
                onToggleRecording={onToggleRecording}
                onTranscription={onTranscription}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <Button onClick={handleSendMessage} disabled={!userInput.trim() || isProcessing} className="gap-2 bg-violet-600 hover:bg-violet-700 w-full">
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Thinking...</>
              ) : (
                <><Send className="w-4 h-4" /> Send Message</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}