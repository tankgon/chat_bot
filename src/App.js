import axios from "axios";
import React, { useState } from "react";
import "./App.css";

function App() {
  const [active, setActive] = useState(true);

  const [mstory, setStory] = useState([]);
  const [mess, setMess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [response, setRespon] = useState("");

  const [file, setFile] = useState();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  // console.log(file);
  const handleFileUpload = async () => {
    try {
      var formData = new FormData();
      formData.append("file", file);

      console.log(formData);

      const response = await axios.post("http://192.168.1.17:8000/chat", {
        topic: mess === "" ? "english" : mess,
        message: mess,
      });
      setRespon(response.data.reply);
      mstory.push({ me: mess, you: response.data.reply });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div id="chat-container" class="fixed bottom-16 right-4 w-96">
      <div class="bg-white shadow-md rounded-lg max-w-lg w-full">
        <div class="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
          <p class="text-lg font-semibold">Admin Bot</p>
          <button
            id="close-chat"
            class="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div id="chatbox" class="p-4 h-80 scroll-smooth overflow-y-auto">
          {mstory.map((items, index) => {
            return (
              <>
                <div class="mb-2 text-right">
                  <p class="bg-blue-500 text-white rounded-lg py-2 px-4 inline-block max-w-[302px] text-left">
                    {items.me}
                  </p>
                </div>
                <div class="mb-2">
                  <p class="bg-gray-200 text-gray-700 rounded-lg py-2 px-4 inline-block max-w-[302px]">
                    {items.you}
                  </p>
                </div>
              </>
            );
          })}
        </div>
        <div class="p-4 border-t flex">
          <input
            id="user-input"
            type="text"
            placeholder="Type a message"
            class="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setMess(e.target.value)}
          />
          <input
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            onChange={handleFileChange}></input>
          <button
            onClick={() => {
              setActive(!active);
              handleFileUpload();
            }}
            class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
