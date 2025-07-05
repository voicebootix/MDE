import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Volume2, Settings, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceInterface({ 
  isRecording, 
  onToggleRecording, 
  onTranscription 
}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.continuous = true;
      recognition.interimResults = false; // We only care about final results
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          onTranscription(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Ensure the parent state is synced
        if (isRecording) {
          onToggleRecording(false);
        }
      };

    } else {
      setIsSupported(false);
    }
  }, [isRecording, onToggleRecording, onTranscription]);

  const handleToggle = async () => {
    if (!isSupported) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      onToggleRecording(false);
    } else {
      try {
        // Check for microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // We don't need to use the stream directly, just requesting it checks for permission.
        // Modern browsers handle this permission prompt automatically.
        stream.getTracks().forEach(track => track.stop()); // Close the track immediately after permission check
        setIsPermissionGranted(true);
        recognitionRef.current?.start();
        onToggleRecording(true);
      } catch (err) {
        console.error('Microphone permission denied:', err);
        setIsPermissionGranted(false);
        alert("Microphone access is required for voice input. Please grant permission in your browser settings.");
      }
    }
  };

  if (!isSupported) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-2 text-center">
          <p className="text-xs text-orange-600">
            Voice input not supported in this browser.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleToggle}
        className={`w-12 h-12 rounded-full p-0 transition-all duration-300 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200' 
            : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
        }`}
      >
        {isRecording ? (
          <MicOff className="w-5 h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </Button>
      
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-red-600"
          >
            Recording...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}