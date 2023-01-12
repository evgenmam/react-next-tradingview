import { calculateStrategy } from "../utils/calculations";
import { useRows, useStrategies } from "./data.hook";

export const useTradeStats = () => {
  const { rows } = useRows("target");
  const { strategies } = useStrategies();
  const dataset = strategies[0]?.openSignal?.dataset || "source";
  const { rows: source } = useRows(dataset);
  return strategies.map(calculateStrategy(source, rows));
};
