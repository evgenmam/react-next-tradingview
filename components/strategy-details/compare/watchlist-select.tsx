import { Option, Select, Typography } from "@mui/joy";
import { useLists } from "../../../hooks/data.hook";
import { Space } from "../../utils/row";
import { IChartConfig } from "../../v2/v2.types";

export type Props = {
  selected: number | null;
  onSelect?: (config: number) => void;
  disabled?: number;
};

export const CompareWatchlistSelect = ({
  selected = null,
  onSelect,
  disabled,
}: Props) => {
  const { lists } = useLists();

  return (
    <Select value={selected} onChange={(_, v) => v && onSelect?.(+v)}>
      {lists.map((list) => (
        <Option key={list.id} value={list.id} disabled={disabled === list.id}>
          {list.name}
        </Option>
      ))}
    </Select>
  );
};
