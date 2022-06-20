import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Form } from "../../components/StyledComponents";
import useDebounceValue from "../../useHooks/useDebounceValue";

export default function Register({ register }) {
  const [inputValues, setInputValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    unique: usernameUnique,
    loading: usernameLoading,
    error: usernameError,
  } = useDebounceValue("username", inputValues.username);
  const {
    unique: emailUnique,
    loading: emailLoading,
    error: emailError,
  } = useDebounceValue("email", inputValues.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameError || emailError) {
      setError("username and email should be unique");
      return;
    }
    setError("");
    try {
      if (inputValues.password !== inputValues.confirmPassword) {
        // set error
        throw new Error("passwords don't match");
      }
      const { confirmPassword, ...inputs } = inputValues;
      await register(inputs);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      onChange={async (e) => {
        setInputValues((inputValues) => ({
          ...inputValues,
          [e.target.name]: e.target.value,
        }));
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h5">Register</Typography>
        <TextField
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {usernameLoading && <CircularProgress size={20} />}
                {usernameError && <CancelIcon color="error" />}
                {usernameUnique && <CheckCircleOutlineIcon color="success" />}
              </InputAdornment>
            ),
          }}
          error={Boolean(usernameError)}
          helperText={
            usernameUnique ? `${inputValues.username} is valid` : usernameError
          }
          label="Username"
          variant="outlined"
          name="username"
          inputProps={{ minLength: 4, maxLength: 20 }}
        />
        <TextField
          required
          error={Boolean(emailError)}
          helperText={emailError}
          label="Email"
          type="email"
          variant="outlined"
          name="email"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {emailLoading && <CircularProgress size={20} />}
                {emailError && <CancelIcon color="error" />}
                {emailUnique && <CheckCircleOutlineIcon color="success" />}
              </InputAdornment>
            ),
          }}
        />
        <TextField
          required
          label="Password"
          type="password"
          variant="outlined"
          name="password"
          inputProps={{ minLength: 10, maxLength: 30 }}
        />
        <TextField
          required
          label="Confirm Password"
          type="password"
          variant="outlined"
          name="confirmPassword"
          inputProps={{ minLength: 10, maxLength: 30 }}
        />
        <Stack spacing={1}>
          <Button type="submit" variant="contained">
            Register
          </Button>
          {error && (
            <Typography color="error" variant="h6">
              {error}
            </Typography>
          )}
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h6">Already have an account?</Typography>
          <Button
            onClick={() => {
              navigate("/login");
            }}
            variant="contained"
          >
            Login
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
}
