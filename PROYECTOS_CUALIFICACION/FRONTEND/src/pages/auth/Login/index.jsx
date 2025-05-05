import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { CheckboxInput, PageMetaData, PasswordInput } from "../../../components";
import { FormInput } from "../../../components";
import useLogin from "./useLogin";
import AuthLayout from "../AuthLayout";
// import { gsUrlApi } from "../../../configuracion/ConfigServer";

/**
 * Bottom Links goes here
 */
const BottomLink = () => {
  return <Box sx={{
    my: "16px",
    display: "flex",
    justifyContent: "center"
  }}>
      <Typography variant="body2" color={"text.secondary"} sx={{
      display: "flex",
      flexWrap: "nowrap",
      gap: 0.5
    }}>
        Don&apos;t have an account?&nbsp;
        <Link to="/auth/register">
          <Typography variant="subtitle2" component={"span"}>
            Register
          </Typography>
        </Link>
      </Typography>
    </Box>;
};
const Login = () => {
  const {
    loading,
    login,
    control
  } = useLogin();
  return <>
      <PageMetaData title={"Inicio de Sesión"} />

      <AuthLayout authTitle="INGRESAR" >
        <form onSubmit={login}>
          <FormInput name="email" type="email" label="Usuario" control={control} placeholder="Escribe tu usuario" />

          <Box sx={{
          mt: 2
        }}>
            <PasswordInput name="password" type="password" label={"Contraseña"} placeholder="Escribe tu contraseña" control={control} />
          </Box>

          <Box sx={{
          mt: 1
        }}>
            <CheckboxInput name="rememberMe" label="Recuerdame" control={control} />
          </Box>

          <Box sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2
        }}>
            <Button variant="contained" color="primary" type="submit" disabled={loading} size={"large"}>
            Iniciar
            </Button>
          </Box>
        </form>
      </AuthLayout>
    </>;
};
export default Login;