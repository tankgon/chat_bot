import axios from "axios";
import React, { useState } from "react";
import "./App.css";

function App() {
  const [active, setActive] = useState(true);
  const [mstory, setStory] = useState([]);
  const [mess, setMess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setRespon] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("topic", mess === "" ? "english" : mess);

      const response = await axios.post("http://192.168.1.17:8000/chat-with-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setRespon(response.data.reply);
      setStory([...mstory, { me: mess, you: response.data.reply }]);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };