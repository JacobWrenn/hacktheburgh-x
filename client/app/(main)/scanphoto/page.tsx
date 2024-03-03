"use client";

import api from "@/app/api";
import { useState } from "react";

export default function Home() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [output, setOutput] = useState("");

  async function submit() {
    const formData = new FormData();
    formData.append("file", file1 as Blob);
    const resp = await api.post("/detector/upload", formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    setOutput(resp.data);
  }

  return (
    <div className="min-h-screen items-center justify-center bg-gradient-to-r from-cyan-50 to-cyan-100 text-gray-700">
      <p>{output}</p>
      <h1 className="text-2xl text-center font-bold p-8">Upload Photographs</h1>

      <div>
        <ul className="flex flex-col justify-center items-center text-gray-700">
          <li className="text-2xl pt-8">Before Photograph</li>
          <li>
            <input
              className="w-full pl-12 pt-4 pb-8 text-center"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) =>
                setFile1(e.target.files ? e.target.files[0] : null)
              }
            />
          </li>
        </ul>
      </div>
      <div>
        <ul className="flex flex-col justify-center items-center text-gray-700">
          <li className="text-2xl pt-8">After Photograph</li>
          <li>
            <input
              className="w-full pl-12 pt-4 pb-8 text-center"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) =>
                setFile2(e.target.files ? e.target.files[0] : null)
              }
            />
          </li>
        </ul>
      </div>
      <button onClick={submit} className="p-2 bg-gray-300 rounded mt-4">
        Submit
      </button>
    </div>
  );
}
