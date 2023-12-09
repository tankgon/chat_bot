import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import audioBufferToWav from "audiobuffer-to-wav";
import axios from "axios";
import { VoiceRecorder } from "capacitor-voice-recorder";
import { Mic } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { TfiLink } from "react-icons/tfi";
import { Audio } from "react-loader-spinner";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [data, setData] = useState("");
  const [mstory, setStory] = useState([]);
  const [mess, setMess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);

  const [response, setRespon] = useState("");

  const [file, setFile] = useState("");

  const chatboxRef = useRef();

  useEffect(() => {
    const chatbox = chatboxRef.current;
    chatbox.scrollTop = chatbox.scrollHeight;
  }, [mstory, loading]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "hsv-ioffice");
      data.append("cloud_name", "df2s6srdu");
      data.append("folder", "hsv-ioffice");

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/df2s6srdu${
          file.type === "image/png" ? "/image/upload" : "/upload"
        }`,
        {
          method: "post",
          body: data,
        }
      );
      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = await cloudinaryData.url;

      const res = await axios.post(
        "https://chat-gpt-server-wk4y.onrender.com/chat-with-file",
        {
          topic: mess == "" ? "Hello" : response ? response : mess,
          message: mess,
          filePath: imageUrl,
        }
      );

      setRespon(res.data.reply);
      setStory([...mstory, { me: mess, you: res.data.reply }]);
      setFile("");
    } catch (error) {
      setStory([...mstory, { me: mess, you: "Xin lỗi file quá lớn" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextUpload = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "https://chat-gpt-server-wk4y.onrender.com/chat",
        {
          topic: mess == "" ? "Hello" : response ? response : mess,
          message: mess,
        }
      );
      setRespon(res.data.reply);
      mstory.push({ me: mess, you: res.data.reply });
      setFile("");
    } catch (error) {
      setStory([
        ...mstory,
        { me: mess, you: "Xin lỗi tôi không thể trả lời câu hỏi của bạn" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      await VoiceRecorder.requestAudioRecordingPermission().then((result) => {
        setData(result.value);
      });
      await VoiceRecorder.startRecording();
      setIsRecording(true);
      console.log("Recording started.");
    } catch (error) {
      console.error("Failed to start recording:", error || data);
    }
  };

  const convertToWav = (audioBuffer) => {
    const wavBuffer = audioBufferToWav(audioBuffer);
    return new Blob([wavBuffer], { type: "audio/wav" });
  };

  const stopRecording = async () => {
    try {
      const result = await VoiceRecorder.stopRecording();
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
        const audioFile = new File([audioBlobWAV], "recordedAudio.wav");
        // playRecordedAudio(audioBlobWAV)
        const formData = new FormData();
        formData.append("file", audioFile);
        // mutation.mutate(formData);
      }
      console.log("Recording stopped. Audio data:", result.value);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  console.log(file);

  return (
    <div className="top-0">
      <div
        id="chat-container"
        className="fixed right-4 bottom-4 w-[20rem] md:w-[20rem] lg:w-[30rem]">
        <div className="bg-white shadow-md rounded-lg w-full">
          <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
            <p className="text-lg font-semibold">Admin Bot</p>
            <button
              onClick={() => {
                setStory([]);
                setPreviewImage();
                setMess("");
                setRespon("");
                setFile("");
              }}
              id="close-chat"
              className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div
            id="chatbox"
            ref={chatboxRef}
            className="p-4 h-[30rem] scroll-smooth overflow-y-auto">
            {mstory.map((items, index) => {
              return (
                <div key={index}>
                  <div className="mb-2 text-right">
                    <p className="bg-blue-500 text-white rounded-lg py-2 px-4 inline-block max-w-[20rem] text-left">
                      {items.me}
                    </p>
                  </div>
                  <div className="mb-2">
                    <p className="hide bg-gray-200 text-gray-700 rounded-lg py-2 px-4 inline-block max-w-[20rem]">
                      {items.you}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {file ? (
            <div className="p-4 flex content-center justify-between">
              {file.name}
              <button
                onClick={() => {
                  setFile("");
                }}
                id="close-chat"
                className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ) : null}

          <div className="p-4 border-t flex content-center">
            <input
              id="user-input"
              type="text"
              value={mess}
              placeholder="Type a message"
              className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setMess(e.target.value)}
            />

            <label
              htmlFor="file_input"
              id="fileLabel"
              className="w-[40px] content-center">
              <TfiLink className="m-[16px]" />
            </label>

            <input
              className="hidden block w-20 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              onChange={handleFileChange}></input>

            {!isRecording ? (
              <Button onClick={startRecording}>
                <Mic className="cursor-pointer" color="#1F336A" />
              </Button>
            ) : null}
            {isRecording ? (
              <>
                <Button onClick={stopRecording}>
                  <Audio
                    height="23"
                    width="23"
                    color="#4fa94d"
                    ariaLabel="audio-loading"
                    visible={true}
                  />
                </Button>
              </>
            ) : null}

            <button
              disabled={loading}
              onClick={() => {
                setActive(!active);
                setMess("");
                setFile("");
                file == "" ? handleTextUpload() : handleFileUpload();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300">
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
