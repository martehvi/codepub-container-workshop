import { Box, Grid } from "@mui/material";

interface HeaderProps {
  name: string;
}

function Header(props: HeaderProps) {
  return (
    <Grid width={1} height={"5%"}>
      <Box
        sx={{
          textAlign: "center",
          m: 1,
          fontSize: "28px",
          color: "#232323",
        }}
      >
        {props.name} 
      </Box>
    </Grid>
  );
}

export default Header;
