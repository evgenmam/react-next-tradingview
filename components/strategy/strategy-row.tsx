import {
  EyeIcon,
  EyeSlashIcon,
  StopIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { IconButton, ListItem, Stack, Typography } from "@mui/joy";
import { ListItemSecondaryAction } from "@mui/material";
import { sentenceCase } from "change-case";
import { useStrategies } from "../../hooks/data.hook";
import { IStrategy } from "../../types/app.types";

type Props = {
  strategy: IStrategy;
};
export const StrategyRow = ({ strategy }: Props) => {
  const { removeStrategy, updateStrategy } = useStrategies();

  const toggle = () => {
    updateStrategy({ ...strategy, hide: !strategy.hide });
  };
  return (
    <ListItem>
      <Stack direction={"row"} spacing={0.5} alignItems="start">
        <StopIcon color={strategy.color} width={18} />

        <Stack>
          <Typography fontSize={14} sx={{ textTransform: "capitalize" }}>
            {strategy.direction} {strategy.entry}ct on{" "}
            {strategy.dataset === "target" ? "Target 1" : "Target 2"}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Typography fontSize={12}>Open: </Typography>
            <Stack direction="row" spacing={0.5}>
              <StopIcon color={strategy.openSignal?.color} width={18} />

              {strategy.openSignal?.condition.map((c) => (
                <Stack direction="row" key={JSON.stringify(c)} spacing={0.5}>
                  <Typography fontSize={12}>
                    {c.a.field}[{c.a.offset}]
                  </Typography>
                  <Typography fontSize={12}>
                    {sentenceCase(c.operator)}
                  </Typography>
                  <Typography fontSize={12}>
                    {c.b.field}[{c.b.offset}]
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            <Typography fontSize={12}>Close: </Typography>
            <Stack direction="row" spacing={0.5}>
              <StopIcon color={strategy.closeSignal?.color} width={18} />

              {strategy.closeSignal?.condition.map((c) => (
                <Stack direction="row" key={JSON.stringify(c)} spacing={0.5}>
                  <Typography fontSize={12}>
                    {c.a.field}[{c.a.offset}]
                  </Typography>
                  <Typography fontSize={12}>
                    {sentenceCase(c.operator)}
                  </Typography>
                  <Typography fontSize={12}>
                    {c.b.field}[{c.b.offset}]
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <ListItemSecondaryAction>
        <IconButton
          size="sm"
          variant="plain"
          onClick={() => {
            toggle();
          }}
        >
          {strategy.hide ? <EyeSlashIcon width={18} /> : <EyeIcon width={18} />}
        </IconButton>
        <IconButton
          size="sm"
          color="danger"
          variant="plain"
          onClick={() => {
            removeStrategy(strategy.id);
          }}
        >
          <TrashIcon width={18} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
