import axios from "axios";
import { useEffect, useState } from "react";
import { useSettings } from "../../../hooks/data.hook";

export const useV2Status = () => {
  const [status, setStatus] = useState<0 | 1 | 2 | 3>(0);
  const { setFetching } = useSettings();
  const reconnect = async () => {
    setStatus(0);
    await axios.get("/api/reconnect");
    const { data } = await axios.get("/api/status");
    setStatus(data?.status || 0);
    setFetching(false);
  };
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await axios.get("/api/status");
      setStatus(data?.status || 0);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return { status, reconnect };
};
