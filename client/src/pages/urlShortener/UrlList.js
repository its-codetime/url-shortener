import { Box, Stack, Button, Divider, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";

import { useUrls } from "../../context/UrlContext";
import Url from "../../components/Url";

export default function UrlList() {
  const { urls, removeUrl, urlLimit } = useUrls();
  const navigate = useNavigate();
  console.log(urls);
  return (
    <Stack
      spacing={2}
      sx={{
        maxWidth: "40rem",
        marginX: "auto",
        marginY: 5,
        textAlign: "center",
      }}
    >
      <Typography variant="h4">All Urls</Typography>
      <Typography variant="h5">Urls left: {urlLimit}</Typography>
      <Divider />
      <Button
        variant="contained"
        onClick={() => {
          navigate("/urls/add");
        }}
        disabled={!urlLimit}
      >
        Add New Url
      </Button>
      <Divider />
      <Box>
        {urls.length === 0 ? (
          <Typography textAlign={"center"}>
            You have no shortened urls
          </Typography>
        ) : (
          urls.map((url) => (
            <Url key={url._id} url={url} removeUrl={removeUrl} />
          ))
        )}
      </Box>
    </Stack>
  );
}
