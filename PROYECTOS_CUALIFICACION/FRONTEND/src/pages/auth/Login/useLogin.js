import { useMemo, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { HttpClient } from "../../../helpers";
import { useAuthContext } from "../../../states";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { gsUrlApi } from "@src/config/ConfigServer";
import Swal from 'sweetalert2';

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {isAuthenticated, saveSession} = useAuthContext();
  const {enqueueSnackbar} = useSnackbar();
  const [EstadoCargue, setEstadoCargue] = useState(false);
  const [EstadoConfirmacion, setEstado] = useState(false);
  const [EstadoBoton, setEstadoDisabled] = useState(true);
  const [time, setTime] = useState(false);
  let gObjResult = "";
  let gObjResultKey = null;
  let gsToken = null;
  let gObjEvent = null;
  let timetemps = 30;
  let gObjSesion = {};

  const loginFormSchema = yup.object({
    email: yup.string().email("Por favor ingresa un correo válido").required("Por favor ingresa un correo"),
    password: yup.string().required("Por favor ingresa una contraseña"),
    rememberMe: yup.boolean().oneOf([true], "Checkbox must be checked").optional()
  });

  const {control, handleSubmit} = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const redirectUrl = useMemo(() => (location.state?.from.pathname, "/inicio"), [location.state]);

  
  const contadorSolicitudAcceso = () => {
    timetemps--;

    if (timetemps <= 0) {
      setTime("---");
      if (gObjEvent !== null) {
        clearInterval(gObjEvent);
        gObjEvent = null;
        setEstadoDisabled(false);
      }
    } else {
      setTime(timetemps);
    }
  };


  const login = handleSubmit(async values => {
  setLoading(true);

  try {
    const res = await fetch(gsUrlApi + "/login", {
      method: "POST",
      body: JSON.stringify({
        Login: values.email,
        Clave: values.password
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json"
      }
    });

    const data = await res.json();

    if (data.failure_message) {
      Swal.fire({
        title: "Error",
        text: data.failure_message,
        icon: "warning"
      });
      setLoading(false);
      return;
    }

    if (data.usuario && data.token) {
      // Guardar token
      localStorage.setItem("token", data.token);
localStorage.setItem("Usuario", JSON.stringify(data.usuario));


      saveSession({
        token: data.token,
        usuario: data.usuario
      });

      navigate(redirectUrl);
    } else {
      Swal.fire({
        title: "Usuario no encontrado",
        text: "El usuario ingresado no existe o los datos son incorrectos.",
        icon: "warning"
      });
    }
  } catch (err) {
    console.error("Error en login:", err);
    Swal.fire({
      title: "Error",
      text: "Ocurrió un error al intentar iniciar sesión.",
      icon: "error"
    });
  } finally {
    setLoading(false);
  }
});

  return {
    loading,
    login,
    redirectUrl,
    isAuthenticated,
    control
  };
}