import {
  AdjustmentsHorizontalIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
} from "@mui/joy";
import { Popover } from "@mui/material";
import {
  bindPopover,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { ITVStudy } from "../tv-components/types";
import { useActiveStudies } from "../v2/hooks/v2-data.hook";

export const StudyToggleDropdown = () => {
  const { studies, toggleStudy } = useActiveStudies();
  const state = usePopupState({
    variant: "popover",
    popupId: "study-toggle-dropdown",
  });
  return (
    <>
      <IconButton variant="plain" {...bindTrigger(state)} size="sm">
        <AdjustmentsHorizontalIcon />
      </IconButton>
      <Popover
        {...bindPopover(state)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List>
          {studies?.map((study) => (
            <ListItem
              key={study.id}
              startAction={
                <IconButton
                  size="sm"
                  color={study.config?.hidden ? "neutral" : "primary"}
                  onClick={() => toggleStudy(study)}
                >
                  {study.config?.hidden ? (
                    <EyeSlashIcon width={16} />
                  ) : (
                    <EyeIcon width={16} />
                  )}
                </IconButton>
              }
            >
              <ListItemButton>
                <ListItemContent>{study.meta?.description}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};
