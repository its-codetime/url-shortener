import { styled } from "@mui/material/styles";
import MuiBox from "@mui/material/Box";

export const Form = styled("form")(() => ({
  textAlign: "center",
  maxWidth: 450,
  minWidth: 300,
  margin: "3em auto",
  background: "rgba(250,250,250,0.3)",
  padding: 35,
  boxShadow: "0px 0px 15px 1px",
  borderRadius: 2,
}));

export const Box = styled(MuiBox)(() => ({
  maxWidth: 450,
  minWidth: 300,
  margin: "3em auto",
  background: "rgba(255,255,255,0.3)",
  boxShadow: "0px 0px 15px 1px",
  borderRadius: 2,
  padding: 25,
  textAlign: "center",
}));

export const ModalBox = styled(MuiBox)(() => ({
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 450,
  backgroundColor: "rgba(255,255,255,0.8)",
  boxShadow: "0px 0px 15px 1px",
  borderRadius: 2,
  padding: 20,
  textAlign: "center",
}));
