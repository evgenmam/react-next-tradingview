import { List, ListItem, ListItemButton, Modal, ModalDialog } from "@mui/joy";
import noop from "lodash.noop";
import { useState } from "react";
import { SelectDialog } from "../../dialogs/select-dialog";
import { ITVStudy } from "../../tv-components/types";
import { useActiveStudies, useV2Studies } from "../../v2/hooks/v2-data.hook";

type IndicatorValueSelectProps = {
  open: boolean;
  onSelect?: (id: string) => void;
  onClose?: () => void;
};

export const IndicatorValueSelect = ({
  open,
  onClose = noop,
  onSelect = noop,
}: IndicatorValueSelectProps) => {
  const { studies } = useActiveStudies();

  const [study, setStudy] = useState<ITVStudy>();
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        {study ? (
          <List>
            {/* {study?.meta?.inputs?.map((i) => ()} */}
          </List>
        ) : (
          <List>
            {studies.map((s) => (
              <ListItem key={s?.id}>
                <ListItemButton onClick={() => setStudy(s)}>
                  {s?.meta?.description}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </ModalDialog>
    </Modal>
  );
};

export default IndicatorValueSelect;
