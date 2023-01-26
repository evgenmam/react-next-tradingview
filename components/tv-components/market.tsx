import { Button } from "@mui/joy";
import { useMarketData } from "./hooks/market-data.hook";
import { ITVIndicator } from "./types";
type Props = {
  symbol?: string;
  indicators: ITVIndicator[];
};
export const TVMarket = ({ symbol, indicators }: Props) => {
  const { login } = useMarketData({ symbol, indicators });
  return <Button onClick={login}>Init</Button>;
};
