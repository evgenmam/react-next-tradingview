import { IconButton, Typography } from "@mui/joy";
import { Space } from "../utils/row";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect } from "react";

type SectionHeaderProps = {
  collapsed?: boolean;
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
  title: string;
};

export const SectionHeader = ({
  collapsed,
  setCollapsed,
  title,
}: SectionHeaderProps) => {
  const toggle = () => {
    const o = !collapsed;
    setCollapsed?.(o);
    window.localStorage.setItem(title, o.toString());
  };
  useEffect(() => {
    const o = window.localStorage.getItem(title) || "false";
    setCollapsed?.(o === "true");
  }, [setCollapsed, title]);
  return (
    <Space s={1} c>
      <IconButton
        size="sm"
        variant="plain"
        color="neutral"
        sx={{ button: { p: 4 }, minWidth: 20, minHeight: 20 }}
        onClick={toggle}
      >
        {!collapsed ? (
          <ChevronDownIcon width={16} />
        ) : (
          <ChevronRightIcon width={16} />
        )}
      </IconButton>
      <Typography sx={{ cursor: "pointer" }} onClick={toggle}>
        {title}
      </Typography>
    </Space>
  );
};

export default SectionHeader;
