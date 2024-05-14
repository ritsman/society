import React, { useState } from "react";
import axios from "axios";

const Test = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("clicked");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("file");
      alert("File uploaded successfully");
    } catch (error) {
      console.log("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="md:py-24 h-screen overflow-y-auto  gap-6">
      <h1 className="text-center text-2xl mb-5">MEMBER PROFILE</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Test;
