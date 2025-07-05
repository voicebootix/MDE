import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  User, 
  Bot, 
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import VoiceInterface from "./VoiceInterface";

const MessageBubble = ({ message, index }) => {
  const isUser = message.role === "user";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <Avatar className={`w-8 h-8 flex-shrink-0 ${isUser ? 'bg-blue-500' : 'bg-emerald-500'}`}>
        <AvatarFallback className="text-white">
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex-1 max-w-lg ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-4 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-sm' 
            : 'bg-gray-100 text-gray-900 rounded-tl-sm'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        <div className={`flex items-center gap-1 mt-2 text-xs text-gray-500 ${
          isUser ? 'justify-end' : ''
        }`}>
          <span>
            {message.timestamp ? format(new Date(message.timestamp), 'h:mm a') : 'now'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex gap-3 mb-6"
  >
    <Avatar className="w-8 h-8 bg-emerald-500">
      <AvatarFallback className="text-white">
        <Bot className="w-4 h-4" />
      </AvatarFallback>
    </Avatar>
    
    <div className="flex-1 max-w-lg">
      <div className="inline-block p-4 rounded-2xl rounded-tl-sm bg-gray-100">
        <div className="flex gap-1">
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export default function ConversationPanel({ 
  conversationHistory, 
  isProcessing, 
  onSendMessage,
  isRecording,
  onToggleRecording,
  onTranscription,
  userInput,
  setUserInput
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm flex flex-col h-full">
      <CardHeader className="border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-600" />
            Live Conversation
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-6 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4 -mr-4">
          <AnimatePresence>
            {conversationHistory.map((message, index) => (
              <MessageBubble 
                key={`${message.timestamp}-${index}`} 
                message={message} 
                index={index}
              />
            ))}
            
            {isProcessing && <TypingIndicator />}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 space-y-3 pt-4 border-t">
          <div className="relative">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe your business idea, or use the mic to speak..."
              className="min-h-[80px] max-h-[200px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-24"
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
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Your AI Co-Founder is listening...
            </p>
            <Button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isProcessing}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}