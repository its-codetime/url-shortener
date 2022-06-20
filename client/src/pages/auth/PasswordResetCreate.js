import { useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Form } from "../../components/StyledComponents.js";

export default function PasswordResetCreate({ createPasswordReset }) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const emailSent = await createPasswordReset(email);
      setEmailSent(emailSent);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Typography variant="h5">PASSWORD RESET</Typography>
        <TextField
          required
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          helperText="Enter your registered email"
          label="Email"
        />
        <Button type="submit" variant="contained">
          SEND MAIL
        </Button>
        {loading && <CircularProgress />}
        {error && (
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        )}
        {emailSent ? (
          <Typography variant="h6" color="success">
            Email has been sent to {email}
          </Typography>
        ) : (
          <Typography variant="h6">
            A link to update password will be sent to your mail.
          </Typography>
        )}
      </Stack>
    </Form>
  );
}
