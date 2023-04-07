import { IconButton, Sheet, Typography } from "@mui/joy";
import { Space } from "./row";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import * as R from "ramda";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export type BNumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  suffix?: string;
  min?: number;
  max?: number;
};
export const BNumberInput = ({
  label,
  min = 0,
  max = 100,
  suffix,
  value,
  onChange,
}: BNumberInputProps) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    if (v !== value) setV(value);
  }, [value]);

  const [debV] = useDebounce(v, 500);

  useEffect(() => {
    if (debV !== value) onChange(debV);
  }, [debV]);

  return (
    <Space c>
      {label && <Typography level="body2">{label}:</Typography>}
      <IconButton
        size="sm"
        variant="plain"
        onClick={() => setV(R.clamp(min, max, v - 1))}
        color="neutral"
      >
        <MinusIcon width={16} />
      </IconButton>
      <Typography>
        {v || 0}
        {suffix}
      </Typography>
      <IconButton
        size="sm"
        variant="plain"
        onClick={() => setV(R.clamp(min, max, v + 1))}
        disabled={v >= max}
      >
        <PlusIcon width={16} />
      </IconButton>
    </Space>
  );
};
