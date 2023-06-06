import { Button as MuiButton } from "@mui/material";
import { MouseEventHandler } from "react";

function Button(props: {
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
  children: string;
}) {
  return (
    <MuiButton
      variant="outlined"
      onClick={props.onClick}
      sx={{
        borderColor: "#232323",
        background: "#f0b67f",
        color: "#232323",
        opacity: 0.8,
        ":hover": {
          borderColor: "#232323",
          background: " #c78b5e",
          color: "#232323",
          opacity: 1,
        },
      }}
    >
      {props.children}
    </MuiButton>
  );
}

export default Button;
