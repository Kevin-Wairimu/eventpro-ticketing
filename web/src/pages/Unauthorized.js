// src/pages/Unauthorized.js
import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="mt-4">You do not have permission to view this page.</p>
      <Link to="/login" className="mt-6 text-blue-600 underline">
        Go back to Login
      </Link>
    </div>
  );
}
