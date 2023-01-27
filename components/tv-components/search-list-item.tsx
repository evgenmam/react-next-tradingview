import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Stack,
  Typography,
} from "@mui/joy";
import { ButtonBase } from "@mui/material";
import { Box } from "@mui/system";
import noop from "lodash.noop";
import { getTVLogo } from "../../utils/chart.utils";

import { ITVSearchResult } from "./types";
type Props = {
  r: ITVSearchResult;
  selected?: boolean;
  commit?: (r: ITVSearchResult) => void;
  onSelect?: (r: ITVSearchResult) => void;
  onExpand?: () => void;
  expanded?: boolean;
};
export const TVSearchListItem = ({
  r,
  commit = noop,
  onSelect = noop,
  selected,
  onExpand = noop,
  expanded,
}: Props) => {
  return (
    <>
      <ListItem
        startAction={
          r.contracts ? (
            <ButtonBase
              sx={{ p: 0.5, borderRadius: 1, ml: 0.5 }}
              onClick={onExpand}
            >
              <Box
                sx={{
                  rotate: expanded ? "180deg" : "0deg",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ChevronDownIcon width={14} />
              </Box>
            </ButtonBase>
          ) : (
            <Box />
          )
        }
      >
        <ListItemButton
          onClick={() => {
            const s = r?.contracts ? { ...r, ...r.contracts[0] } : r;
            commit(s);
            onSelect(s);
          }}
          {...(selected ? { selected: true, variant: "soft" } : {})}
        >
          <ListItemDecorator>
            <Avatar
              src={r.logoid && getTVLogo(`${r.logoid}`)}
              size="sm"
              variant="solid"
            >
              {r.symbol.slice(0, 1)}
            </Avatar>
          </ListItemDecorator>
          <ListItemContent>
            <Stack direction="row" spacing={1} px={1} alignItems="center">
              <Typography minWidth={50} pr={1} fontWeight={600} level="body1">
                {r.symbol}
              </Typography>
              <Typography level="body2">{r.description}</Typography>
            </Stack>
          </ListItemContent>
          <ListItemDecorator>
            <ListItemDecorator>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography level="body2">{r.type}</Typography>
                <Typography>{r.exchange}</Typography>
                {r.country ? (
                  <Avatar
                    src={getTVLogo(`country/${r.country}`)}
                    size="sm"
                    variant="solid"
                  />
                ) : (
                  <Avatar
                    src={getTVLogo(`provider/${r.provider_id}`)}
                    size="sm"
                    variant="solid"
                  />
                )}
              </Stack>
            </ListItemDecorator>
          </ListItemDecorator>
        </ListItemButton>
      </ListItem>
      {expanded &&
        r.contracts?.map((c) => (
          <TVSearchListItem
            key={c.symbol}
            r={{ ...r, ...c, contracts: undefined }}
            onSelect={onSelect}
            commit={commit}
          />
        ))}
    </>
  );
};
