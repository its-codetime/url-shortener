import { useEffect, useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Form, Box } from "../../components/StyledComponents";
import { useParams, useNavigate } from "react-router-dom";

export default function PasswordResetUpdate({
  updatePassword,
  verifyPasswordReset,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLinkValid, setIsLinkValid] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [inputValues, setInputValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const { resetToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const validateLink = async () => {
      setLoading(true);
      try {
        const linkValid = await verifyPasswordReset(resetToken);
        setIsLinkValid(linkValid);
      } catch (error) {
        setError(error.message);
        setIsLinkValid(false);
      } finally {
        setLoading(false);
      }
    };
    validateLink();
  }, [resetToken, verifyPasswordReset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValues.password !== inputValues.confirmPassword) {
      setError("passwords don't match");
      return;
    }
    try {
      setLoading(true);
      // request
      const passwordUpdate = await updatePassword(
        inputValues.password,
        resetToken
      );
      setIsUpdated(passwordUpdate);
    } catch (error) {
      // set axios error
      setError(error.message);
      setIsLinkValid(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLinkValid ? (
        isUpdated ? (
          <Box>
            <Stack spacing={2}>
              <Typography>
                Your Password has been successfully updated. Login with the new
                password.
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
            </Stack>
          </Box>
        ) : (
          <Form
            onSubmit={handleSubmit}
            onChange={(e) => {
              setInputValues((inputValues) => ({
                ...inputValues,
                [e.target.name]: e.target.value,
              }));
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h5">PASSWORD RESET</Typography>
              <TextField
                required
                type="password"
                helperText="Enter new password"
                label="New Password"
                name="password"
              />
              <TextField
                required
                name="confirmPassword"
                type="password"
                label="Confirm Password"
              />
              <Button type="submit" variant="contained">
                UPDATE PASSWORD
              </Button>
              {loading && <CircularProgress />}
              {error && (
                <Typography variant="h6" color="error">
                  {error}
                </Typography>
              )}
            </Stack>
          </Form>
        )
      ) : (
        <Box>
          <Typography>{error}</Typography>
        </Box>
      )}
    </>
  );
}
