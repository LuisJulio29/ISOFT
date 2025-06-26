import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { GiBookmark } from "react-icons/gi";
import { PageBreadcrumb } from "components";
import { useState } from "react";
import Swal from "sweetalert2";

import { useCaracterizacionDocentes } from "./useCaracterizacionDocentes";

const DocentesForm = ({ data = {}, onCancel }) => {
  const {
    formaciones,
    insertarCualificaciones,
    subirCertificadoCualificacion
  } = useCaracterizacionDocentes();

  const opcionesFormacion = formaciones.formaciones || [];

  const [archivoPDF, setArchivoPDF] = useState(null);
  const [modalAbierta, setModalAbierta] = useState(false);
  const [formacionModal, setFormacionModal] = useState(null);
  const [formacionSeleccionada, setFormacionSeleccionada] = useState("");
  const [modalVerCertificado, setModalVerCertificado] = useState(false);
  const [certificadoBase64, setCertificadoBase64] = useState("");


  const [formData, setFormData] = useState({
    primerNombre: data.nombre || "",
    primerApellido: data.apellidos || "",
    cedula: data.cedula || "",
    tipoDocumento: data.tipo_documento || "",
    correo: data.correo_institucional || "",
    celular: data.celular || "",
    facultad: data.facultad || "",
    programa: data.programa || "",
    tipoVinculacion: data.tipo_vinculacion || "",
    categoria: data.categoria || "",
    nivelFormacion: data.nivel_formacion || "",
    formaciones: data.formaciones || [],
  });

  const opcionesDisponibles = opcionesFormacion.filter(
    (formacion) =>
      !formData.formaciones.some(
        (asignada) => asignada.id_formacion === formacion.id_formacion
      )
  );

  const handleAgregarFormacion = () => {
    const seleccion = opcionesFormacion.find(
      (f) => f.id_formacion === formacionSeleccionada
    );
    if (
      seleccion &&
      !formData.formaciones.some(
        (f) => f.id_formacion === seleccion.id_formacion
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        formaciones: [...prev.formaciones, seleccion]
      }));
      setFormacionSeleccionada("");
    }
  };

  const handleGuardar = async () => {
    if (!formData.formaciones.length) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Debes añadir al menos una formación.",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    const resultado = await insertarCualificaciones(
      formData.formaciones,
      data.id_docente,
      data.formaciones || []
    );

    if (resultado?.success) {
      Swal.fire({
        icon: "success",
        title: "Formaciones guardadas correctamente",
        text: resultado.mensaje || "Los datos han sido guardados con éxito.",
        confirmButtonText: "Aceptar"
      }).then(() => {
        onCancel();
        window.location.reload();
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          resultado?.message ||
          "Ocurrió un error al guardar las formaciones.",
        confirmButtonText: "Aceptar"
      });
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
      <PageBreadcrumb title="Caracterización de docentes" subName="App" />
      <Paper elevation={2} sx={{ borderRadius: 4, p: 4, minHeight: "100%" }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Divider sx={{ my: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              DATOS PERSONALES
            </Typography>
          </Divider>

          <Box display="flex" flexWrap="wrap" gap={3}>
            <TextField fullWidth label="Nombres" value={formData.primerNombre} InputProps={{ readOnly: true, style: { pointerEvents: "none" } }} sx={{ flex: 1 }} />
            <TextField fullWidth label="Apellidos" value={formData.primerApellido} InputProps={{ readOnly: true, style: { pointerEvents: "none" } }} sx={{ flex: 1 }} />
          </Box>

          <Box display="flex" flexWrap="wrap" gap={3}>
            <TextField fullWidth label="Cédula" value={formData.cedula} InputProps={{ readOnly: true, style: { pointerEvents: "none" } }} sx={{ flex: 1 }} />
            <TextField fullWidth label="Correo institucional" value={formData.correo} InputProps={{ readOnly: true, style: { pointerEvents: "none" } }} sx={{ flex: 1 }} />
            <TextField fullWidth label="Celular" value={formData.celular} InputProps={{ readOnly: true, style: { pointerEvents: "none" } }} sx={{ flex: 1 }} />
          </Box>

          <Box display="flex" flexWrap="wrap" gap={3}>
            <TextField fullWidth label="Tipo de Documento" value={formData.tipoDocumento} InputProps={{ readOnly: true, style: { pointerEvents: "none" } }} sx={{ flex: 1 }} />
            <TextField fullWidth label="Facultad" value={formData.facultad} InputProps={{ readOnly: true, style: { pointerEvents: "none" } }} sx={{ flex: 1 }} />
            <TextField fullWidth label="Programa" value={formData.programa} InputProps={{ readOnly: true, style: { pointerEvents: "none" } }} sx={{ flex: 1 }} />
          </Box>

          <Box display="flex" flexWrap="wrap" gap={3}>
            <TextField fullWidth label="Tipo de Vinculación" value={formData.tipoVinculacion} InputProps={{ readOnly: true, style: { pointerEvents: "none" } }} sx={{ flex: 1 }} />
            <TextField fullWidth label="Categoría" value={formData.categoria} InputProps={{ readOnly: true, style: { pointerEvents: "none" } }} sx={{ flex: 1 }} />
            <TextField fullWidth label="Nivel de Formación" value={formData.nivelFormacion} InputProps={{ readOnly: true, style: { pointerEvents: "none" } }} sx={{ flex: 1 }} />
          </Box>
        </Box>

        <Divider sx={{ my: 5 }}>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            INFORMACIÓN DE CUALIFICACIÓN
          </Typography>
        </Divider>

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Autocomplete
            options={opcionesDisponibles}
            getOptionLabel={(option) => option.nombre_formacion}
            value={opcionesDisponibles.find(f => f.id_formacion === formacionSeleccionada) || null}
            onChange={(_, newValue) => {
              setFormacionSeleccionada(newValue ? newValue.id_formacion : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Seleccionar formación" fullWidth />
            )}
            isOptionEqualToValue={(option, value) => option.id_formacion === value.id_formacion}
            noOptionsText="No hay nuevas formaciones disponibles para asignar"

            fullWidth
          />

          {/* {opcionesDisponibles.length === 0 && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              No hay nuevas formaciones disponibles para asignar.
            </Typography>
          )} */}

          <Button
            variant="contained"
            color="success"
            endIcon={<AddIcon />}
            onClick={handleAgregarFormacion}
            disabled={!formacionSeleccionada}
            sx={{ borderRadius: 3 }}
          >
            Añadir Formación
          </Button>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          {formData.formaciones.map((formacion, index) => (
            <Box
              key={formacion.id_formacion || index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              borderRadius={2}
              bgcolor="background.paper"
              border="1px solid"
              borderColor="divider"
              boxShadow={1}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <GiBookmark size={28} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {formacion.titulo || formacion.nombre_formacion}
                  </Typography>
                  <Typography variant="body2">
                    Línea de cualificación: {formacion.linea_cualificacion}
                  </Typography>
                  <Typography variant="body2">
                    Periodo: {formacion.periodo}
                  </Typography>
                </Box>
              </Box>


              <Box display="flex" alignItems="center" gap={1}>
                <Button
                  title="Adjuntar archivo"
                  onClick={() => {
                    setFormacionModal(formacion);
                    setModalAbierta(true);
                  }}
                  sx={{ minWidth: 40 }}
                >
                  <AttachFileIcon />
                </Button>

                <Button
                  title="Ver certificado"
                  onClick={() => {
                    setCertificadoBase64(formacion.certificado);
                    setModalVerCertificado(true);
                  }}
                  disabled={!formacion.certificado}
                  sx={{ minWidth: 40 }}
                >
                  <VisibilityIcon />
                </Button>
              </Box>


            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 4 }} />
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={onCancel}>
            Volver
          </Button>
          <Button variant="contained" color="success" startIcon={<DoneAllIcon />} onClick={handleGuardar}>
            Guardar
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={modalVerCertificado}
        onClose={() => {
          setModalVerCertificado(false);
          setCertificadoBase64("");
        }}
        fullWidth
        maxWidth="lg"
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: "#fff",
            borderRadius: 3,
            boxShadow: 6,
            height: { xs: "80vh", md: "85vh" }, // altura total del modal
            display: "flex",
            flexDirection: "column"
          }
        }}
      >
        <DialogContent
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            backgroundColor: "#fafafa",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          {certificadoBase64 ? (
            <Box
              sx={{
                flex: 1,
                border: "1px solid #ddd",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <iframe
                title="Vista previa del certificado"
                src={`data:application/pdf;base64,${certificadoBase64}`}
                width="100%"
                height="100%"
                style={{
                  border: "none",
                  display: "block", // evitar scroll interno
                }}
              />
            </Box>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flex={1}
              p={3}
              textAlign="center"
            >
              <Typography variant="body1">
                No hay certificado disponible para mostrar.
              </Typography>
            </Box>
          )}
        </DialogContent>

        {certificadoBase64 && (
          <DialogActions
            sx={{
              justifyContent: "center",
              gap: 2,
              py: 2,
              px: 3,
              flexWrap: "wrap",
              borderTop: "1px solid #eee"
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                const link = document.createElement("a");
                link.href = `data:application/pdf;base64,${certificadoBase64}`;
                link.download = "certificado.pdf";
                link.click();
              }}
            >
              Descargar PDF
            </Button>

            <Button
              onClick={() => setModalVerCertificado(false)}
              variant="contained"
              color="error"
            >
              Cerrar
            </Button>
          </DialogActions>
        )}
      </Dialog>


      {/* MODAL DE SUBIR CERTIFICADO */}
      <Dialog open={modalAbierta} onClose={() => {
        setModalAbierta(false);
        setArchivoPDF(null);
      }}>
        <DialogContent sx={{ minWidth: 500, textAlign: "center", pt: 4 }}>
          <Typography fontWeight="bold" variant="h6" gutterBottom>
            Subida de certificado en PDF
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Adjunta un archivo <strong>.pdf</strong> como certificado para la formación:
          </Typography>
          <Typography mt={1} fontWeight="bold" color="text.primary">
            {formacionModal?.nombre_formacion}
          </Typography>

          <Box mt={3}>
            <Button
              component="label"
              variant="outlined"
              color="primary"
              fullWidth
            >
              Elegir archivo
              <input
                type="file"
                hidden
                accept=".pdf"
                onChange={(e) => {
                  const archivo = e.target.files[0];
                  setArchivoPDF(archivo);
                }}
              />
            </Button>
          </Box>

          <Typography mt={2} fontSize={13} color="text.secondary">
            {archivoPDF ? `Archivo seleccionado: ${archivoPDF.name}` : "No se ha seleccionado ningún archivo"}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => {
              setModalAbierta(false);
              setArchivoPDF(null);
            }}
            variant="contained"
            color="error"
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={!archivoPDF}
            onClick={async () => {
              if (!archivoPDF || !formacionModal) return;

              // Formación ya guardada => subir inmediatamente
              if (formacionModal.id) {
                const resultado = await subirCertificadoCualificacion(formacionModal.id, archivoPDF);

                if (resultado.success) {
                  // ACTUALIZAR certificado localmente en formData
                  const lector = new FileReader();
                  lector.onload = (e) => {
                    const base64 = e.target.result.split(",")[1]; // quitar "data:application/pdf;base64,"
                    setFormData((prev) => ({
                      ...prev,
                      formaciones: prev.formaciones.map((f) =>
                        f.id_formacion === formacionModal.id_formacion
                          ? { ...f, certificado: base64 }
                          : f
                      )
                    }));
                  };
                  lector.readAsDataURL(archivoPDF);

                  Swal.fire({
                    icon: "success",
                    title: "Certificado subido",
                    text: resultado.mensaje || "El archivo fue cargado correctamente.",
                  });

                  setModalAbierta(false);
                  setArchivoPDF(null);
                  return;
                }
                else {
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: resultado.message || "No se pudo subir el certificado.",
                  });
                  return;
                }
              }

              // Formación nueva => guardar localmente para enviarla luego
              setFormData(prev => {
                const nuevasFormaciones = prev.formaciones.map(f => {
                  if (f.id_formacion === formacionModal.id_formacion) {
                    return { ...f, certificadoArchivo: archivoPDF };
                  }
                  return f;
                });
                return { ...prev, formaciones: nuevasFormaciones };
              });

              Swal.fire({
                icon: "info",
                title: "Archivo adjuntado",
                text: "El certificado será subido cuando se guarde la formación.",
              });

              setModalAbierta(false);
              setArchivoPDF(null);
            }}
          >
            Subir
          </Button>

        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocentesForm;
