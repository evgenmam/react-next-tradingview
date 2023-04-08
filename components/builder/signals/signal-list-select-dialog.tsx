import {
  Modal,
  ModalDialog,
  ModalOverflow,
  List,
  ListItem,
  ListItemButton,
  ModalClose,
  TextField,
  Input,
  ListSubheader,
  Sheet,
} from "@mui/joy";
import { useV2Studies } from "../../v2/hooks/v2-data.hook";
import {
  SFT,
  getKeyedStudyData,
  getStudyFields,
} from "../../../utils/study.utils";
import { Box, Collapse, Divider, Fade, Stack } from "@mui/material";
import { useCallback, useState } from "react";
import { Space } from "../../utils/row";
import { TransitionGroup } from "react-transition-group";
import { ITVStudy } from "../../tv-components/types";
import * as R from "ramda";
import { ICondition, IConditionEntry } from "../../../types/app.types";

type SignalListSelectDialogProps = {
  onChange?: (a: SFT, condition?: IConditionEntry) => void;
  open?: boolean;
  onClose?: () => void;
};

export const SignalListSelectDialog = ({
  open,
  onChange,
  onClose,
}: SignalListSelectDialogProps) => {
  const { studies } = useV2Studies();
  const [search, setSearch] = useState("");

  const matchSearch = useCallback(
    (s: string) => s.match(new RegExp(`${search}`, "i")),
    [search]
  );

  const fff = useCallback(
    (study: ITVStudy) => {
      const fields = getStudyFields(study).filter(
        (v) => !v.styles?.isHidden && v.title
      );
      return !!search
        ? fields
            .sort((a, b) =>
              matchSearch(a.title) ? -1 : matchSearch(b.title) ? 1 : 0
            )
            .sort(
              (a, b) =>
                (matchSearch(a.title)?.index ?? 100) -
                (matchSearch(b.title)?.index ?? 100)
            )
        : fields.sort((a, b) => a.title.localeCompare(b.title));
    },
    [search, matchSearch]
  );

  return (
    <Modal open={!!open} onClose={onClose}>
      <ModalOverflow>
        <ModalDialog>
          <Stack spacing={2} divider={<Divider />}>
            <Box
              position="sticky"
              top="0"
              zIndex="10"
              sx={{ backdropFilter: "blur(10px)" }}
            >
              <Input
                autoFocus
                variant="soft"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search..."
              />
            </Box>
            <Space gap={2} flexWrap="wrap">
              {studies?.map((s) => (
                <List key={s.id} size="sm">
                  <ListSubheader>{s.meta.description}</ListSubheader>
                  {fff(s).map((f) => (
                    <ListItem key={f.key}>
                      <ListItemButton
                        onClick={() => onChange?.(f, {
                          field: `${f.study}:${f.title}----${f.key}`,
                          type: "field",
                          offset: 0,
                        })}
                        disabled={!matchSearch(f.title)?.length}
                        dangerouslySetInnerHTML={{
                          __html: search
                            ? f.title
                                .replaceAll(" ", "&nbsp;")
                                .replace(
                                  new RegExp(`(${search})`, "i"),
                                  `<u><strong>$1</strong></u>`
                                )
                            : f.title,
                        }}
                      ></ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ))}
            </Space>
          </Stack>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
};

export default SignalListSelectDialog;
