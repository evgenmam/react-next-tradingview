import { Divider, Stack, useTheme } from "@mui/joy";
import { Box, Typography } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

export const FileDropArea = ({
  open,
  onChange,
}: {
  open: boolean;
  onChange: (v: File | null) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: any) {
        const f = item.items?.[0]?.getAsFile();
        setFile(f);
        onChange(f);
      },

      collect: (monitor) => {
        return {
          isOver: monitor.isOver(),
        };
      },
    }),
    [inputRef.current]
  );

  const err = file && !file?.name?.endsWith(".json");
  const succ = file?.name?.endsWith(".json");

  const clr = isOver ? "info" : err ? "danger" : succ ? "success" : "primary";
  const theme = useTheme();
  const bg = theme.palette[clr]?.softBg;
  useEffect(() => {
    setFile(null);
  }, [open]);
  useEffect(() => {
    if (succ) {
      onChange(file);
    }
  }, [file, succ, onChange]);
  return (
    <Box>
      <Box
        ref={drop}
        py={6}
        px={5}
        sx={{
          cursor: "pointer",
          borderRadius: 3,
          bgcolor: bg,
          border: `1px dashed ${theme.palette[clr]?.softColor}`,
        }}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <Typography color={clr}>
          {file ? file.name : "Drop file here or click to select a file"}
        </Typography>
      </Box>

      <Box sx={{ display: "none" }}>
        <input
          type="file"
          accept="application/JSON"
          ref={inputRef}
          onChange={(v) => {
            setFile(v.target.files?.[0] || null);
          }}
        />
      </Box>
    </Box>
  );
};
