import React, { useState, useRef } from 'react';
import { FaMicrophone, FaMicrophoneAltSlash } from 'react-icons/fa'; // Importing microphone icons

const SpeechToText = ({ text, setText }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null); 
  const lastResultTimeRef = useRef(null); 
  const GAP_THRESHOLD = 100000; 

  const handleStartRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true; 
    recognition.maxAlternatives = 1; 
    recognition.continuous = true; 

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      let result = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        result += event.results[i][0].transcript;
      }
      
      const currentTime = new Date().getTime();

   
      setText(result);
      setTranscript(result);

     e
      lastResultTimeRef.current = currentTime;
    };

    recognition.onend = () => {
      
      if (isRecording) {
        setIsRecording(false); 
      }
    };

    recognitionRef.current = recognition; 
        recognition.start();
  };

  const handleStopRecording = () => {
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        style={{
          fontSize: '24px',
          padding: '10px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: isRecording ? 'red' : 'black',

        }}
      >
        {isRecording ? (
          <FaMicrophoneAltSlash />
        ) : (
          <FaMicrophone />
        )}
      </button>
    </div>
  );
};

export default SpeechToText;
