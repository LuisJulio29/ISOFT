/*
 * Copyright (c) 2023.
 * File Name: Footer.tsx
 * Author: Coderthemes
 */

import { Stack, Typography, styled } from "@mui/material";
import { useLayoutContext } from "../states";
const FooterWrapper = styled("div")(({
  theme,
  settings
}) => {
  return {
    backgroundColor: theme.palette.background.paper,
    height: "auto",
    minHeight: "130px",
    marginTop: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 14px",
    
  };
});
const Footer = () => {
  const {
    settings
  } = useLayoutContext();
  return <FooterWrapper settings={settings} className="footer-do-not-remove">
      <Typography variant="subtitle2" color={"text.primary"} sx={{ fontSize: "12px" }}>
        2024 - {new Date().getFullYear()} © NAUTIAGRO S.A.S. Powered by TISERIUM
      </Typography>
      <Stack direction={"row"} spacing={2} sx={{
      display: "flex"
    }}>
        {/* <Typography variant="subtitle2" color={"text.primary"}>
          Acerca de
        </Typography>
        <Typography variant="subtitle2" color={"text.primary"}>
          Soporte
        </Typography>
        <Typography variant="subtitle2" color={"text.primary"}>
          Contactenos
        </Typography> */}
      </Stack>
    </FooterWrapper>;
};
export default Footer;