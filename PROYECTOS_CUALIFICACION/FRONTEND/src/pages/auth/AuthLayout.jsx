import { Link } from "react-router-dom";
import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import { AuthBGLayout } from "../.././components";

// images
import logo from "../.././assets/images/UnicartagenaLogo.png";

const AuthLayout = ({
  pageImage,
  authTitle,
  helpText,
  bottomLinks,
  children
}) => {
  return (
    <>
      <AuthBGLayout>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            padding: 2, // Padding responsivo
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%", // Asegúrate de que el contenedor use todo el ancho disponible
            }}
          >
            <Box
              sx={{
                maxWidth: "448px",
                width: "100%", // Hacer que el contenedor sea responsivo
                padding: 2, // Padding responsivo
              }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  width: "100%", // Hacer que el Card use todo el ancho disponible
                }}
              >
                <CardContent sx={{ p: 4, }}>
                  <Link
                    to="/auth/login"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                   
                    }}
                  >
                    <img src={logo} alt="logo" height={90}  />
                  </Link>
                </CardContent>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      mx: "auto",
                      width: "100%", // Cambiar a 100% para que el Box use todo el espacio
                    }}
                  >
                    {pageImage && (
                      <Avatar
                        variant="rounded"
                        src={pageImage}
                        alt="mail sent image"
                        sx={{
                          mx: "auto",
                          width: 64,
                          height: 64,
                        }}
                      />
                    )}
                    <Typography
                      variant="h4"
                      sx={{
                        textAlign: "center",
                        mb: "16px",
                        mt: 4.5,
                        fontSize: { xs: '1.5rem', md: '2rem' }, // Cambiar tamaño de fuente responsivamente
                      }}
                    >
                      {authTitle}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: "36px",
                        fontSize: { xs: '0.875rem', md: '1rem' }, // Cambiar tamaño de fuente responsivamente
                      }}
                      color={"text.secondary"}
                    >
                      {helpText}
                    </Typography>
                  </Box>

                  {children}
                </CardContent>
              </Card>

              {bottomLinks}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Link
            to={"https://www.nautiagro.com/"}
            target="_blank"
            style={{
              color: "unset",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                p: "24px",
                fontSize: { xs: '0.75rem', md: '0.875rem' }, // Cambiar tamaño de fuente responsivamente
              }}
              color={"text.secondary"}
            >
              {new Date().getFullYear()} © NAUTIAGRO S.A.S. Powered by TISERIUM
            </Typography>
          </Link>
        </Box>
      </AuthBGLayout>
    </>
  );
};

export default AuthLayout;
