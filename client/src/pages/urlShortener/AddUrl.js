import { useState } from "react";
import { useNavigate } from "react-router-dom";
// mui
import { Button, Modal, Stack, TextField, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { Form, ModalBox } from "../../components/StyledComponents";
import { useUrls } from "../../context/UrlContext";

export default function AddUrl() {
  const { addUrl } = useUrls();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [sUrl, setSurl] = useState("");
  const [urlCopied, setUrlCopied] = useState(false);
  const navigate = useNavigate();

  const validateUrl = (url) => {
    const urlRegex =
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    if (!urlRegex.test(url)) throw new Error("Invalid Url");
  };

  const handleSubmit = async (e) => {
    try {
      setError("");
      e.preventDefault();
      validateUrl(url);
      const urlData = await addUrl(url);
      setSurl(`${process.env.REACT_APP_BACKEND_URL}/${urlData.token}`);
      handleModalOpen();
      console.log(urlData);
    } catch (error) {
      setError(error.message);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setUrlCopied(true);
    } catch (error) {
      console.error(error);
      navigate("/urls/all");
    }
  };

  const handleModalOpen = () => setModalOpen(true);

  const handleModalClose = () => {
    setUrlCopied(false);
    setUrl("");
    setSurl("");
    setModalOpen(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Typography variant="h5">Add New Url</Typography>
        <TextField
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          label="Enter url"
        />
        <Button type="submit" variant="contained">
          Shorten
        </Button>
        {error && (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        )}
        <Button
          onClick={() => {
            navigate("/urls/all");
          }}
          variant="contained"
        >
          All My Urls
        </Button>
        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ModalBox>
            <Stack spacing={2}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Shortened Url
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {sUrl}
              </Typography>
              <Button
                onClick={async () => {
                  await copyToClipboard(sUrl);
                }}
                variant="contained"
                endIcon={urlCopied ? <CheckCircleOutlineIcon /> : ""}
              >
                {urlCopied ? "Copied to clipboard" : "Copy shortened url"}
              </Button>
              <Button
                onClick={() => {
                  navigate("/urls/all");
                }}
                variant="contained"
              >
                See all urls
              </Button>
            </Stack>
          </ModalBox>
        </Modal>
      </Stack>
    </Form>
  );
}
