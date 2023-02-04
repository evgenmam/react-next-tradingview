import { XMarkIcon } from "@heroicons/react/24/outline";
import { Box, Sheet, SheetProps, Typography } from "@mui/joy";
import { ButtonBase } from "@mui/material";

type Props = {
  title?: string;
  onClose?: () => void;
} & SheetProps;

export const TitleSheet = ({ title, children, onClose, ...props }: Props) => {
  return (
    <Sheet sx={{ position: "relative", ...props.sx }} {...props}>
      {title && (
        <Typography
          sx={{
            position: "absolute",
            top: -10,
            left: 16,
            zIndex: 10,
          }}
          level="body3"
        >
          {title}
        </Typography>
      )}
      {children}
      {onClose && (
        <Box position="absolute" top={2} right={4}>
          <ButtonBase onClick={onClose}>
            <XMarkIcon width={16} />
          </ButtonBase>
        </Box>
      )}
    </Sheet>
  );
};
