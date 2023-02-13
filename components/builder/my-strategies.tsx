import { PlusIcon } from "@heroicons/react/24/outline";
import { Checkbox, IconButton, Stack, Typography } from "@mui/joy";
import { Collapse } from "@mui/material";
import { useState } from "react";
import { useStrategies } from "../../hooks/data.hook";
import { Space } from "../utils/row";
import { MyStrategyRow } from "./strategies/my-strategy-row";
import { NewStrategy } from "./strategies/new-strategy";

type Props = {
  withLink?: boolean;
  selected?: number;
  onSelect?: (id: number) => void;
};
export const MyStrategies = ({ withLink, selected, onSelect }: Props) => {
  const [adding, setAdding] = useState(false);
  const { strategies, removeStrategy, addStrategy, reverse, setReverse } =
    useStrategies();

  return (
    <Stack mt={1}>
      <Space sb s={1} c>
        <Space s={1} c>
          <Typography>My Strategies</Typography>
          <IconButton onClick={() => setAdding(true)} size="sm">
            <PlusIcon width={20} />
          </IconButton>
        </Space>
        <Checkbox
          variant="solid"
          label="With reverse strategies"
          checked={!!reverse}
          onChange={() => setReverse(!reverse)}
        />
      </Space>
      <Stack spacing={1}>
        <Collapse in={adding}>
          {adding && (
            <NewStrategy
              onCancel={() => setAdding(false)}
              onSave={(s) => {
                addStrategy(s);
                setAdding(false);
              }}
            />
          )}
        </Collapse>
        {strategies.map((strategy) => (
          <MyStrategyRow
            selected={!!selected && strategy.id === +selected}
            withLink={withLink}
            key={strategy.id}
            strategy={strategy}
            onDelete={removeStrategy}
            onSelect={onSelect}
          />
        ))}
      </Stack>
    </Stack>
  );
};
