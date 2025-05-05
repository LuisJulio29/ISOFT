import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import PageMetaData from "./PageMetaData";
import { LuChevronRight } from "react-icons/lu";

const PageBreadcrumb = ({ title, subName }) => {
  const breadcrumbItems = [
    <Link
      key="1"
      color="inherit"
      variant="subtitle2"
      underline="none"
      href=""
      sx={{
        fontWeight: 600,
        fontSize: { xs: "14px", sm: "16px" }, // Tamaño de fuente adaptable
      }}
    >
      Nautiagro
    </Link>,
    <Link
      key="2"
      color="inherit"
      variant="body2"
      underline="none"
      href=""
      sx={{
        fontSize: { xs: "12px", sm: "14px" }, // Tamaño de fuente adaptable
      }}
    >
      {subName}
    </Link>,
    <Typography
      key="3"
      variant="body2"
      sx={{
        
        fontSize: { xs: "12px", sm: "14px" }, // Tamaño de fuente adaptable
      }}
    >
      {title}
    </Typography>,
  ];

  return (
    <>
      <PageMetaData title={title} />

      <Box
        height={75}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ xs: "column", sm: "row" }} // Apilar en pantallas pequeñas
        gap={{ xs: 1, sm: 0 }} // Espaciado en pantallas pequeñas
        sx={{ padding: { xs: "8px", sm: "16px" } }} // Padding adaptable
      >
        <Typography
          variant="h5"
          color="text.primary"
          sx={{
            fontWeight: 950,
            fontSize: { xs: "18px", sm: "24px" }, // Tamaño del título responsivo
            textAlign: { xs: "center", sm: "left" }, // Centrado en pantallas pequeñas
          }}
        >
          {title}
        </Typography>

        <Breadcrumbs
          separator={<LuChevronRight size={12} />}
          aria-label="breadcrumb"
          sx={{
            "& ol": {
              display: "flex",
              gap: 1,
              justifyContent: { xs: "center", sm: "flex-start" }, // Centrar en pantallas pequeñas
              fontSize: { xs: "12px", sm: "14px" }, // Tamaño de las migas de pan adaptable
            },
          }}
        >
          {breadcrumbItems}
        </Breadcrumbs>
      </Box>
    </>
  );
};

export default PageBreadcrumb;
