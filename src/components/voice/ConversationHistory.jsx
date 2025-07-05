import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bot, Clock } from "lucide-react";
import { format } from "date-fns";

const MessageBubble = ({ message, index }) => {
  const isUser = message.role === "user";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <Avatar className={`w-8 h-8 ${isUser ? 'bg-blue-500' : 'bg-emerald-500'}`}>
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
          <Clock className="w-3 h-3" />
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

export default function ConversationHistory({ messages, isTyping }) {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {messages.map((message, index) => (
          <MessageBubble 
            key={`${message.timestamp}-${index}`} 
            message={message} 
            index={index}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
      </AnimatePresence>
      
      {messages.length === 0 && !isTyping && (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to start your conversation
          </h3>
          <p className="text-gray-600">
            Share your business idea or technical requirements to begin
          </p>
        </div>
      )}
    </div>
  );
}