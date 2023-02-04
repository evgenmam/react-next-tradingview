import { Box, Modal, ModalDialog, Typography } from "@mui/joy";
import { ButtonBase } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useDrop } from "react-dnd";
import { CLOSING } from "ws";
import { useSignals } from "../../../hooks/data.hook";
import { ISignal } from "../../../types/app.types";
import { TitleSheet } from "../../utils/title-sheet";
import { MySignalRow } from "./my-signal-row";

type Props = {
  value?: ISignal;
  onSelect?: (signal?: ISignal) => void;
  title?: string;
};
export const SignalSelect = ({ value, onSelect, title }: Props) => {
  const { signals } = useSignals();
  const [open, setOpen] = useState<boolean>(false);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "signal",
    collect: (m) => ({
      isOver: m.isOver(),
    }),
    
    drop: onSelect,
  }));
  return (
    <Box
      ref={drop}
      sx={
        isOver
          ? ({ palette }) => ({
              outline: 1,
              outlineStyle: "solid",
              outlineColor: palette.success[300],
              outlineOffset: 2,
              borderRadius: 1,
            })
          : {}
      }
    >
      <TitleSheet
        title={title}
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: 1,
        }}
      >
        <ButtonBase
          sx={{ width: "100%", borderRadius: 1 }}
          onClick={() => setOpen(true)}
        >
          {value ? (
            <MySignalRow signal={value} full onDelete={() => onSelect?.()} />
          ) : (
            <Box p={2}>
              <Typography level="body2">Select Signal</Typography>
            </Box>
          )}
        </ButtonBase>
      </TitleSheet>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <Stack spacing={1}>
            {signals?.map((signal) => (
              <ButtonBase
                key={signal.id}
                sx={{ width: "100%" }}
                onClick={() => {
                  onSelect?.(signal);
                  setOpen(false);
                }}
              >
                <MySignalRow signal={signal} full />
              </ButtonBase>
            ))}
          </Stack>
        </ModalDialog>
      </Modal>
    </Box>
  );
};
