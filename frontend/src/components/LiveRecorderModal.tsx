import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, X, AlertCircle } from 'lucide-react';
import Button from './ui/Button';

interface LiveRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordComplete: (file: File) => void;
}

const LiveRecorderModal: React.FC<LiveRecorderModalProps> = ({ isOpen, onClose, onRecordComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopRecordingAndCleanUp();
    }
  }, [isOpen]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `live_recording_${Date.now()}.webm`, { type: 'audio/webm' });
        onRecordComplete(file);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error("Error accessing microphone:", err);
      setError("Microphone access denied or not available. Please check your browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    stopRecordingAndCleanUp();
  };

  const stopRecordingAndCleanUp = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Mic size={18} className="text-blue-600" /> Live Audio Capture
          </h3>
          {!isRecording && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col items-center justify-center">
          
          {error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 w-full border border-red-100">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : (
            <>
              {/* Visualizer / Pulse Indicator */}
              <div className="relative mb-8">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'} border-4 ${isRecording ? 'border-red-100' : 'border-slate-100'} transition-colors duration-300`}>
                  <Mic size={40} />
                  {isRecording && (
                    <>
                      <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75"></div>
                      <div className="absolute -inset-4 rounded-full border border-red-200 animate-pulse opacity-50"></div>
                    </>
                  )}
                </div>
              </div>

              {/* Timer */}
              <div className={`text-4xl font-display font-bold tracking-tight mb-8 ${isRecording ? 'text-red-600' : 'text-slate-400'}`}>
                {formatTime(recordingTime)}
              </div>

              {/* Controls */}
              <div className="w-full max-w-[250px]">
                {!isRecording ? (
                  <Button 
                    className="w-full justify-center gap-2 py-3 text-base bg-blue-600 hover:bg-blue-700 shadow-md"
                    onClick={startRecording}
                  >
                    <Mic size={18} /> Start Recording
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="w-full justify-center gap-2 py-3 text-base bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm"
                    onClick={stopRecording}
                  >
                    <Square size={16} fill="currentColor" /> Stop & Analyze
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Helper Text */}
          {!isRecording && !error && (
             <p className="text-center text-slate-500 text-sm mt-6">
                Click start, speak your mind, and let AI extract the actionable intelligence.
             </p>
          )}
          {isRecording && (
             <p className="text-center text-red-500 font-medium text-sm mt-6 animate-pulse">
                Recording in progress...
             </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default LiveRecorderModal;
