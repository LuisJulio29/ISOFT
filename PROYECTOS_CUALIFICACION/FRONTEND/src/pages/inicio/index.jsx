import { Grid } from "@mui/material";
import logo from "@src/assets/images/UnicartagenaLogo.png";

const Inicio = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "60vh", padding: "1rem" }}
    >
      <Grid item xs={12} sm={6} mt={10} md={4} lg={3} textAlign="center">
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Inicio;
