import { useMemo, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { HttpClient } from "../../../helpers";
import { useAuthContext } from "../../../states";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "notistack";
// import { gsUrlApi } from "../../../configuracion/ConfigServer";
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
    email: yup.string().email("Please enter valid email").required("Please enter email"),
    password: yup.string().required("Please enter password"),
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
    
    // fetch(gsUrlApi+ "/usuariosAdministrativos/validarIngreso", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     Login: values.email,
    //     Clave: values.password,
    //     // IdEmpresa: props.Empresa,
    //   }),
    //   headers: {
    //     "Content-Type": "application/json; charset=UTF-8",
    //     Accept: "application/json",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((data) => data)
    //   .then(function Validar(data) {
    //     if (data.error && data.error.code === 404) {
    //       Swal.fire({
    //         title: "Error",
    //         text: "Error al consultar el usuario. Por favor, inténtelo nuevamente.",
    //         icon: "question",
    //       });
    //       setLoading(false);
    //     } else {
    //       if (data.Datos.length > 0) {
            
    //         gObjResult = data.Datos[0];
    //         gObjResultKey = data.DatosKey[0];
    //         localStorage.setItem("token", JSON.stringify(data.token));

    //         gsToken = gObjResult.NumeroIdentificacion;
    //         timetemps = 30;
    //         // eliminacion de clave por menaje de texto, se cambio por true el  setEstado(false) -----
    //         gObjSesion.Paciente = gObjResult;
    //         localStorage.setItem(gsToken, JSON.stringify(gObjSesion));
    //         if (
    //           gObjResult.EstadoCambioClave == false &&
    //           gObjResult.CarqueAutomatico == true &&
    //           props.ValidacionCambioClave
    //         ) {
    //           setEstadoCargue(gObjResult.CarqueAutomatico);
    //         } else {
    //           setEstado(true);
    //         }

    //         // ------------------------------
    //         // ALertaSwal(
    //         //   "Clave temporal de acceso enviada al Celular " + gObjResult.Celular,
    //         //   "success"
    //         // );
    //         // setPreload(true)
    //         setTime(!time);
    //         gObjEvent = setInterval(contadorSolicitudAcceso, 1000);
    //         if (data.token) {
    //           saveSession({
    //             ...(data.datos ?? {}),
    //             token: data.token
    //           });
    //           navigate(redirectUrl);
    //         }
    //         // navigate("/ecommerce");
    //         localStorage.setItem("Usuario", JSON.stringify(data.Datos[0]));
    //       } else {
    //         Swal.fire({
    //           title: "Usuario no encontrado",
    //           text: "El usuario ingresado no existe en el sistema.",
    //           icon: "warning",
    //         });
    //         setLoading(false);
    //       }
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err, "error");
    //   });
      


    try {
      const res = await HttpClient.post("/login", values);
      if (res.data.token) {
        saveSession({
          ...(res.data ?? {}),
          token: res.data.token
        });
        navigate(redirectUrl);
      }
    } catch (error) {
      if (error.response?.data?.error) {
        enqueueSnackbar(error.response?.data?.error, {
          variant: "error"
        });
      }
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