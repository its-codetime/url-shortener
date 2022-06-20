// mui
import {
  Button,
  ButtonGroup,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";

// mui icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useState } from "react";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

export default function Url({ url, removeUrl }) {
  const [urlCopied, setUrlCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setUrlCopied(true);
      setTimeout(() => {
        setUrlCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Accordion
      sx={{
        color: "primary.dark",
        fontWeight: "bold",
      }}
      disableGutters={true}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" component="h6">
          {url.url}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack>
          <Typography color="black" variant="h6" component="h6" noWrap={true}>
            {`${process.env.REACT_APP_BACKEND_URL}/${url.token}`}
          </Typography>
          <ButtonGroup
            variant="contained"
            sx={{ marginX: "auto", marginY: 1 }}
            orientation="horizontal"
          >
            <Button
              onClick={async () => {
                await copyToClipboard(
                  `${process.env.REACT_APP_BACKEND_URL}/${url.token}`
                );
              }}
              endIcon={urlCopied ? <CheckCircleOutline /> : ""}
            >
              {urlCopied ? "Copied to clipboard" : "Copy Url"}
            </Button>
            <Button
              onClick={async () => {
                await removeUrl(url.token);
              }}
            >
              Delete
            </Button>
          </ButtonGroup>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
