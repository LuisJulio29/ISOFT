import {
  Box,
  Menu,
  Typography,
  Button,
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";
import { HiOutlineDownload } from "react-icons/hi";

const FiltrosCualificacion = ({
  anchorEl,
  open,
  onClose,
  onDescargar,
  valores,
}) => {
  const {
    facultadFiltro,
    setFacultadFiltro,
    programaFiltro,
    setProgramaFiltro,
    vinculacionFiltro,
    setVinculacionFiltro,
    nivelFiltro,
    setNivelFiltro,
    añoFiltro,
    setAñoFiltro,
    facultades,
    programas,
    tiposVinculacion,
    nivelesFormacion,
    añosDisponibles,
    limpiarFiltros,
  } = valores;

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          elevation: 3,
          sx: {
            mt: 1.5,
            width: { xs: "60vw", sm: 261 },
            maxHeight: "80vh",
            overflowY: "auto",
            px: 2,
            py: 2,
            borderRadius: 2,
          },
        },
      }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Filtros avanzados
        </Typography>

        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Autocomplete
              options={["", ...facultades]}
              value={facultadFiltro}
              onChange={(_, newValue) => setFacultadFiltro(newValue || "")}
              renderInput={(params) => (
                <TextField {...params} label="Facultad" size="small" />
              )}
              fullWidth
              clearOnEscape
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={["", ...programas]}
              value={programaFiltro}
              onChange={(_, newValue) => setProgramaFiltro(newValue || "")}
              renderInput={(params) => (
                <TextField {...params} label="Programa" size="small" />
              )}
              fullWidth
              clearOnEscape
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={["", ...tiposVinculacion]}
              value={vinculacionFiltro}
              onChange={(_, newValue) => setVinculacionFiltro(newValue || "")}
              renderInput={(params) => (
                <TextField {...params} label="Tipo de Vinculación" size="small" />
              )}
              fullWidth
              clearOnEscape
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={["", ...nivelesFormacion]}
              value={nivelFiltro}
              onChange={(_, newValue) => setNivelFiltro(newValue || "")}
              renderInput={(params) => (
                <TextField {...params} label="Nivel de Formación" size="small" />
              )}
              fullWidth
              clearOnEscape
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={["", ...añosDisponibles]}
              value={añoFiltro}
              onChange={(_, newValue) => setAñoFiltro(newValue || "")}
              renderInput={(params) => (
                <TextField {...params} label="Año de Formación" size="small" />
              )}
              fullWidth
              clearOnEscape
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth onClick={limpiarFiltros}>
                  Limpiar
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" fullWidth onClick={onClose}>
                  Aplicar
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={onDescargar}
              startIcon={<HiOutlineDownload />}
            >
              Descargar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Menu>
  );
};

export default FiltrosCualificacion;
