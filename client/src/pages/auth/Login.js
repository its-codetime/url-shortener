import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { Form } from "../../components/StyledComponents";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login({ login }) {
  const [error, setError] = useState();
  const [inputValues, setInputValues] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { confirmPassword, ...inputs } = inputValues;
      await login(inputs);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
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
        <Typography variant="h5">Login</Typography>
        <TextField
          required
          label="Username"
          variant="outlined"
          name="username"
        />
        <Stack spacing={1}>
          <TextField
            required
            label="Password"
            type="password"
            variant="outlined"
            name="password"
          />
          <Button
            onClick={() => {
              navigate("/password-reset/create");
            }}
          >
            <Typography
              sx={{ textAlign: "right", fontWeight: "bold" }}
              variant="span"
            >
              Forgot password?
            </Typography>
          </Button>
        </Stack>
        <Stack spacing={1}>
          <Button type="submit" variant="contained">
            Login
          </Button>
          {error && (
            <Typography color="error" variant="h6">
              {error}
            </Typography>
          )}
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h6">Don't have an account?</Typography>
          <Button
            onClick={() => {
              navigate("/register");
            }}
            variant="contained"
          >
            Register
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
}
