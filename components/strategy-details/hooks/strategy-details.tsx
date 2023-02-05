import { useStrategy } from "../../v2/hooks/v2-data.hook";

export const useStrategyDetails = ({ id }: { id: number }) => {
  const { strategy } = useStrategy(id);
  return { strategy };
};
