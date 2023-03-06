import { XMarkIcon } from "@heroicons/react/24/outline";
import { Divider, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import { Checkbox } from "@mui/joy";
import { useEffect, useState } from "react";
import { useStrategies } from "../../../hooks/data.hook";
import { Space } from "../../utils/row";
import { useV2ChartConfigs } from "../../v2/hooks/v2-data.hook";

import CompareList from "./compare-list";
import { CompareWatchlistSelect } from "./watchlist-select";

type CompareBodyProps = {
  onClose: () => void;
};

export const CompareBody = ({ onClose }: CompareBodyProps) => {
  const { configs } = useV2ChartConfigs();
  const [w1, setW1] = useState(configs?.[0]?.list);
  const [w2, setW2] = useState(configs?.[1]?.list);
  useEffect(() => {
    setW1(configs?.[0]?.list);
    setW2(configs?.[1]?.list);
  }, [configs]);
  const { reverse, setReverse } = useStrategies();
  return (
    <Sheet>
      <Stack
        height="100vh"
        overflow="hidden"
        px={3}
        py={2}
        spacing={2}
        divider={<Divider />}
      >
        <Space sb>
          <Typography level="h6">Strategy Analysis</Typography>
          <Space s={2} c>
            <CompareWatchlistSelect
              selected={w1}
              onSelect={setW1}
              disabled={w2}
            />
            <Typography level="h6">/</Typography>
            <CompareWatchlistSelect
              selected={w2}
              onSelect={setW2}
              disabled={w1}
            />
            <Checkbox
              variant="solid"
              label="With reverse strategies"
              checked={!!reverse}
              onChange={() => setReverse(!reverse)}
            />
          </Space>
          <IconButton variant="plain" color="neutral" onClick={onClose}>
            <XMarkIcon />
          </IconButton>
        </Space>
        <CompareList w1={w1} w2={w2} />
      </Stack>
    </Sheet>
  );
};

export default CompareBody;
