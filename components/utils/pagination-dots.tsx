import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ArrowRightCircleIcon, StopIcon } from "@heroicons/react/24/solid";
import { useTheme } from "@mui/joy";
import { ButtonBase, ButtonBaseProps } from "@mui/material";
import { Stack } from "@mui/system";
import noop from "lodash.noop";
import { FC } from "react";
import { Space } from "./row";

type Props = {
  selected?: number[];
  total?: number;
  onSelect?: (i: number[]) => void;
};
export const PaginationDots = ({
  selected = [],
  total = 1,
  onSelect = noop,
}: Props) => {
  const { palette } = useTheme();
  const BB: FC<ButtonBaseProps> = (props) => (
    <ButtonBase sx={{ p: 1 }} {...props} />
  );
  const increment = (i = 1) => {
    onSelect(selected.map((v) => (v + i + total) % total));
  };
  return (
    <Space spacing={1}>
      <BB onClick={() => increment(-1)}>
        <ChevronLeftIcon width={12} color={palette?.neutral?.[100]} />
      </BB>
      {Array.from({ length: total }).map((_, i) => (
        <StopIcon
          width={10}
          key={i}
          color={
            selected.includes(i)
              ? palette?.success?.[200]
              : palette?.neutral?.[500]
          }
        />
      ))}
      <BB onClick={() => increment()}>
        <ChevronRightIcon width={12} color={palette?.neutral?.[100]} />
      </BB>
    </Space>
  );
};
