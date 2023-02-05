import { PlusIcon } from "@heroicons/react/24/outline";
import { IconButton, Stack, Typography } from "@mui/joy";
import { Collapse } from "@mui/material";
import { useState } from "react";
import { useStrategies } from "../../hooks/data.hook";
import { MyStrategyRow } from "./strategies/my-strategy-row";
import { NewStrategy } from "./strategies/new-strategy";

type Props = {
  withLink?: boolean;
  selected?: number;
  onSelect?: (id: number) => void;
};
export const MyStrategies = ({ withLink, selected, onSelect }: Props) => {
  const [adding, setAdding] = useState(false);
  const { strategies, removeStrategy, addStrategy } = useStrategies();
  return (
    <Stack>
      <Stack p={1} alignItems="center" spacing={1} direction="row">
        <Typography>My Strategies</Typography>
        <IconButton onClick={() => setAdding(true)} size="sm">
          <PlusIcon width={20} />
        </IconButton>
      </Stack>
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
