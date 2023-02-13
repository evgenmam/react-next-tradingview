import { Input, Modal, ModalDialog, Slider, Stack, Typography } from "@mui/joy";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { Space } from "../../utils/row";

type SignalRowDistanceSelectProps = {
  value: number;
  onChange?: (value: number) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  matches?: number;
};

export const SignalRowDistanceSelect = ({
  open,
  onChange,
  value = 0,
  setOpen,
  matches,
}: SignalRowDistanceSelectProps) => {
  return (
    <Modal open={!!open} onClose={() => setOpen?.(false)}>
      <ModalDialog>
        <Stack spacing={1}>
          <Typography>Max bars after previous condition</Typography>
          <Space s={2} pr={1}>
            <Input
              value={value}
              onChange={(e) => onChange?.(+e.target.value)}
              type="number"
              size="sm"
              slotProps={{ input: { min: "0" } }}
              sx={{ width: 100 }}
            />
            <Slider
              min={0}
              max={20}
              value={value}
              onChange={(_, v) => onChange?.([v]?.flat()[0] as number)}
            />
          </Space>
          {!!matches ? (
            <Typography color="success">{matches} matches</Typography>
          ) : (
            <Typography color="danger">No matching events</Typography>
          )}
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default SignalRowDistanceSelect;
