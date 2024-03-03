"use client";

import { useState } from "react";
import api from "../api";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    await api.post("/user/login", { Username: username, Password: password });
  }

  async function register() {
    await api.post("/user", { Username: username, Password: password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-b from-cyan-50 via-cyan-100 to-slate-400">
      <div className=" bg-gray-200 shadow-md rounded-lg px-8 py-6 w-80">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700">
          Login/Sign-up
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium  text-gray-700 mb-2">
            Username
          </label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-black shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 "
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black shadow-sm rounded-md w-full px-3 py-2 border border-gray-300"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-400"
          onClick={login}
        >
          Login
        </button>
        <div className="flex w-full mb-4 mt-4">
          <button
            type="submit"
            className="w-full  flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-400"
            onClick={register}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
