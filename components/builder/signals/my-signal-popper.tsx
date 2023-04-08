import { Stack, Typography } from "@mui/joy";
import { Popper } from "@mui/material";
import { Box } from "@mui/system";
import {
  bindPopper,
  bindHover,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { useRef } from "react";
import { v4 } from "uuid";
import { ISignal } from "../../../types/app.types";
import { Space } from "../../utils/row";
import { MySignalRow } from "./my-signal-row";
import { LinkIcon } from "@heroicons/react/24/outline";

type MySignalPopperProps = {
  signal?: ISignal;
  link?: boolean;
};

export const MySignalPopper = ({ signal, link }: MySignalPopperProps) => {
  const id = useRef(v4());
  const state = usePopupState({ variant: "popper", popupId: id.current });
  return (
    <Space s={1} c px={1}>
      {link ? (
        <LinkIcon width={15} color={signal?.color} />
      ) : (
        <svg viewBox="0 0 8 8" width={8} height={8}>
          <circle cx="4" cy="4" r="4" fill={signal?.color} />
        </svg>
      )}
      <Typography {...bindHover(state)} sx={{ cursor: "pointer" }}>
        {signal?.name || `Signal ${signal?.id}`}
      </Typography>
      <Popper {...bindPopper(state)} placement="bottom">
        <Box boxShadow={1}>
          {signal && <MySignalRow signal={signal} light />}
        </Box>
      </Popper>
    </Space>
  );
};

export default MySignalPopper;
