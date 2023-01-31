import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Box, Card, Divider, IconButton, Stack, Typography } from "@mui/joy";
import Link from "next/link";
import { useRouter } from "next/router";
import { CsvUpload } from "../csv/csv-upload";
import { DatasetSelect } from "../data/selects/dataset-select";
import XScrollbar from "../utils/scrollbars";
import { Signals } from "./signals";
import { Strategies } from "./strategies";
import { TradeStats } from "./trade-stats";

export const Strategy = () => {
  const router = useRouter();
  return (
    <Box height="100%" sx={{ boxSizing: "border-box", overflow: "hidden" }}>
      <XScrollbar>
        <Card variant="outlined" sx={{ boxSizing: "border-box", my: 2 }}>
          <Box position="relative">
            <Box position="absolute" top={0} left={0}>
              <Link href="/builder" target="_blank">
                <IconButton>
                  <ArrowTopRightOnSquareIcon width={16} />
                </IconButton>
              </Link>
            </Box>
            <Stack spacing={2} divider={<Divider />}>
              <Typography fontSize={16} my={1.5} textAlign="center">
                Strategy Builder
              </Typography>
              <Signals />
              <Strategies />
              <TradeStats />
            </Stack>
          </Box>
        </Card>
      </XScrollbar>
    </Box>
  );
};
