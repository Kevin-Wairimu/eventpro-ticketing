// src/hooks/useRealtimeStats.js
import { useEffect, useState } from "react";
import socket from "../utils/socket";
import axios from "axios";

export default function useRealtimeStats() {
  const [stats, setStats] = useState({ users: 0, events: 0 });

  useEffect(() => {
    axios.get("http://localhost:4000/api/reports/stats")
      .then(res => setStats(res.data))
      .catch(console.error);

    const handler = (payload) => setStats(payload);
    socket.on("stats:update", handler);
    return () => { socket.off("stats:update", handler); };
  }, []);

  return stats;
}
