import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { IconButton, List, Stack, Typography } from "@mui/joy";
import { ButtonBase, Icon } from "@mui/material";
import { useSettings, useStrategies } from "../../hooks/data.hook";
import { StrategyRow } from "./strategy-row";
import { NewStrategy } from "./utils/new-strategy";
import * as R from "ramda";
import { applyStrategy } from "../../utils/calculations";
import { Box } from "@mui/system";
import { PinescriptButton } from "./utils/pinescript-button";

export const Strategies = () => {
  const { strategies, addStrategy } = useStrategies();
  const { showStrategies, setShowStrategies } = useSettings();
  const Icon = showStrategies ? EyeIcon : EyeSlashIcon;

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography fontSize={20}>Strategies</Typography>
          <ButtonBase
            onClick={() => {
              setShowStrategies(!showStrategies);
            }}
          >
            <Icon width={16} />
          </ButtonBase>
        </Stack>
        <Box ml="auto">
          <PinescriptButton />
        </Box>
      </Stack>

      <List>
        {strategies.map((strategy) => (
          <StrategyRow key={strategy.id} strategy={strategy} />
        ))}
      </List>
      <NewStrategy onSave={addStrategy} />
    </Stack>
  );
};
