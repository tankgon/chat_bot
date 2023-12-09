import { FormatResponse } from "@/types";
import audioBufferToWav from "audiobuffer-to-wav";
import { AxiosResponse } from "axios";
import {
  GenericResponse,
  RecordingData,
  VoiceRecorder,
} from "capacitor-voice-recorder";
import { Mic } from "lucide-react";
import { useState } from "react";
import { Audio } from "react-loader-spinner";

interface AudioRecorderProps {
  mutation: UseMutationResult<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AxiosResponse<FormatResponse<any>, any>,
    unknown,
    FormData,
    unknown
  >;
  disabled: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  disabled,
  mutation,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>("");
  const startRecording = async (): Promise<void> => {
    try {
      await VoiceRecorder.requestAudioRecordingPermission().then(
        (result: GenericResponse) => {
          setData(result.value);
        }
      );
      await VoiceRecorder.startRecording();
      setIsRecording(true);
      console.log("Recording started.");
    } catch (error) {
      console.error("Failed to start recording:", error || data);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertToWav = (audioBuffer: any) => {
    const wavBuffer = audioBufferToWav(audioBuffer);
    return new Blob([wavBuffer], { type: "audio/wav" });
  };
  const stopRecording = async (): Promise<void> => {
    try {
      const result: RecordingData = await VoiceRecorder.stopRecording();
      setIsRecording(false);
      if (result.value) {
        const binaryData = atob(result.value?.recordDataBase64);
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryData.length; i++) {
          view[i] = binaryData.charCodeAt(i);
        }
        const audioContext = new window.AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const audioBlobWAV = convertToWav(audioBuffer);
        // const audioBlob = new Blob([arrayBuffer], { type: "audio/aac" });
        const audioFile = new File([audioBlobWAV], "recordedAudio.wav", {
          type: mimeType,
        });
        // playRecordedAudio(audioBlobWAV)
        const formData = new FormData();
        formData.append("file", audioFile);
        mutation.mutate(formData);
      }
      console.log("Recording stopped. Audio data:", result.value);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  return (
    <>
      {!isRecording ? (
        <button
          disabled={disabled || mutation.isLoading}
          onClick={startRecording}
          type="button">
<Mic className="cursor-pointer" color="#1F336A" />
        </button>
      ) : null}
      {isRecording ? (
        <>
          <Audio
            height="23"
            width="23"
            color="#4fa94d"
            ariaLabel="audio-loading"
            visible={true}
          />
          <button
            className="bg-red-500 px-2 py-0.5 text-white rounded-md"
            disabled={disabled || mutation.isLoading}
            onClick={stopRecording}
            type="button">
            Stop
          </button>
        </>
      ) : null}
    </>
  );
};