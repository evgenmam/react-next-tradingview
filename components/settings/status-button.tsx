import { BoltIcon, BoltSlashIcon } from "@heroicons/react/24/solid";
import { CircularProgress, IconButton, Tooltip } from "@mui/joy";
import { useSettings } from "../../hooks/data.hook";
import { useV2Status } from "../v2/hooks/v2-status.hook";

const statuses = {
  0: { label: "CONNECTING", color: "success", icon: <CircularProgress /> },
  1: { label: "OPEN", color: "success", icon: <BoltIcon width={20} /> },
  2: { label: "CLOSING", color: "warning", icon: <CircularProgress /> },
  3: { label: "CLOSED", color: "danger", icon: <BoltSlashIcon width={20} /> },
};

export const StatusButton = () => {
  const { status, reconnect } = useV2Status();
  return (
    <Tooltip title={statuses?.[status]?.label}>
      <IconButton
        onClick={() => {
          if (status === 3) reconnect();
        }}
        color={statuses?.[status]?.color as "warning" | "success" | "danger"}
      >
        {statuses?.[status]?.icon}
      </IconButton>
    </Tooltip>
  );
};
