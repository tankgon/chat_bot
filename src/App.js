import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { TfiLink } from "react-icons/tfi";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(true);

  const [mstory, setStory] = useState([]);
  const [mess, setMess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);

  const [response, setRespon] = useState("");

  const [file, setFile] = useState();

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
  // console.log(file);

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

      const res = await axios.post("http://192.168.1.03:8080/chat-with-file", {
        topic: mess == "" ? "Hello" : response ? response : mess,
        message: mess,
        filePath: imageUrl,
      });

      setRespon(res.data.reply);
      setStory([...mstory, { me: mess, you: res.data.reply }]);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextUpload = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://192.168.1.03:8080/chat", {
        topic: mess == "" ? "Hello" : response ? response : mess,
        message: mess,
      });
      setRespon(res.data.reply);
      mstory.push({ me: mess, you: res.data.reply });
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="chat-container" className="fixed right-4 bottom-4 w-[30rem]">
      <div className="bg-white shadow-md rounded-lg w-full">
        <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
          <p className="text-lg font-semibold">Admin Bot</p>
          <button
            onClick={() => {
              setStory([]);
              setPreviewImage();
              setMess("");
              setRespon("");
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

          <button
            disabled={loading}
            onClick={() => {
              setActive(!active);
              setMess("");
              file !== undefined ? handleFileUpload() : handleTextUpload();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300">
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
