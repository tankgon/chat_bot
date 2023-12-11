import { Button } from "@mui/material";
import { Mic } from "lucide-react";
import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      {/* <button onClick={SpeechRecognition.startListening}>Start</button> */}
      <Button onClick={SpeechRecognition.startListening}>
        <Mic className="cursor-pointer" color="#1F336A" />
      </Button>
      {/* <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button> */}
      <p>{transcript}</p>
    </div>
  );
};
export default Dictaphone;
