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
  const redirectUrl = useMemo(() => (location.state?.from.pathname, "/"), [location.state]);

  
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
    
    fetch(gsUrlApi + "/login", {
      method: "POST",
      body: JSON.stringify({
        Login: values.email,
        Clave: values.password
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json"
      }
    })
      .then((res) => res.json())
      .then(function Validar(data) {
        if (data.failure_message) {
          Swal.fire({
            title: "Error",
            text: data.failure_message,
            icon: "warning"
          });
          setLoading(false);
          return;
        }
    
        if (data.usuario && data.usuario.length > 0) {
          gObjResult = data.usuario[0];    
          gObjResultKey = data.datosKey?.[0];
    
          // Guarda token y sesión
          localStorage.setItem("token", JSON.stringify(data.token));
          gsToken = gObjResult.NumeroIdentificacion;
          gObjSesion.Docente = gObjResult;
          localStorage.setItem(gsToken, JSON.stringify(gObjSesion));
    
          saveSession({
            ...(data.datos ?? {}),
            token: data.token
          });
    
          navigate(redirectUrl);
        } else {
          Swal.fire({
            title: "Docente no encontrado",
            text: "El usuario ingresado no existe en el sistema.",
            icon: "warning"
          });
        }
    
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error en login:", err);
        setLoading(false);
      });
    
      


    // try {
    //   const res = await HttpClient.post("/login", values);
    //   if (res.data.token) {
    //     saveSession({
    //       ...(res.data ?? {}),
    //       token: res.data.token
    //     });
    //     navigate(redirectUrl);
    //   }
    // } catch (error) {
    //   if (error.response?.data?.error) {
    //     enqueueSnackbar(error.response?.data?.error, {
    //       variant: "error"
    //     });
    //   }
    // } finally {
    //   setLoading(false);
    // }
  });
  return {
    loading,
    login,
    redirectUrl,
    isAuthenticated,
    control
  };
}