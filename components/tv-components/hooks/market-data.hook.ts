import axios from "axios";
import { ITVIndicator } from "../types";

export const useMarketData = ({
  symbol,
  indicators,
}: {
  symbol?: string;
  indicators?: ITVIndicator[];
}) => {
  const login = async () => {
    await axios.post("/api/data", { symbol, indicators });
  };
  return { login };
};
