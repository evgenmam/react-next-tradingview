import { calculateStrategy } from "../utils/calculations";
import { useRows, useStrategies } from "./data.hook";

export const useTradeStats = () => {
  const { rows } = useRows("target");
  const { strategies } = useStrategies();
  const { rows: source } = useRows("source");
  return strategies.map(calculateStrategy(source, rows));
};
