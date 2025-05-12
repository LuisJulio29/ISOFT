import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput, PageMetaData } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import AuthLayout from "../AuthLayout";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

// Enlace inferior para volver al inicio de sesión
const BottomLink = () => {
  return (
    <Box
      sx={{
        my: "16px",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <Typography
        variant="body2"
        color={"text.secondary"}
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 0.5
        }}
      >
        ¿Ya tienes una cuenta?
        <Link to="/auth/login">
          <Typography variant="subtitle2" component={"span"}>
            Inicia sesión
          </Typography>
        </Link>
      </Typography>
    </Box>
  );
};

const ResetPassword = () => {
  // Validación del formulario con yup
  const resetPasswordFormSchema = yup.object({
    email: yup
      .string()
      .email("Por favor ingresa un correo válido")
      .required("El correo es obligatorio")
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(resetPasswordFormSchema),
    defaultValues: {
      email: ""
    }
  });

  return (
    <>
      <PageMetaData title={"Recuperar contraseña"} />

      <AuthLayout
        authTitle="Recuperar contraseña"
        helpText="Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña."
        bottomLinks={<BottomLink />}
      >
        <form onSubmit={handleSubmit(() => null)}>
          <FormInput
            name="email"
            type="email"
            label="Correo electrónico"
            containerSx={{ mt: 2 }}
            control={control}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2
            }}
          >
            <Button variant="contained" color="primary" type="submit" size={"large"}>
              Recuperar
            </Button>
          </Box>
        </form>
      </AuthLayout>
    </>
  );
};

export default ResetPassword;
