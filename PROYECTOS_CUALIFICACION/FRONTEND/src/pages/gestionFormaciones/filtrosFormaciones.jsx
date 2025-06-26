import React, { useState, useMemo } from "react";
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

const FiltrosFormaciones = ({
  anchorEl,
  handleClose,
  onAplicarFiltros,
  formaciones,
  onDescargar,
}) => {
  const open = Boolean(anchorEl);

  const [linea, setLinea] = useState("Todos");
  const [periodo, setPeriodo] = useState("Todos");
  const [horas, setHoras] = useState("Todos");

  const aplicarFiltros = () => {
    onAplicarFiltros({ linea, periodo, horas });
    handleClose();
  };

  const limpiarFiltros = () => {
    setLinea("Todos");
    setPeriodo("Todos");
    setHoras("Todos");
    onAplicarFiltros({ linea: "Todos", periodo: "Todos", horas: "Todos" });
    handleClose();
  };

  const lineasUnicas = useMemo(() => {
    const set = new Set(formaciones.map(f => f.linea_cualificacion).filter(Boolean));
    return ["Todos", ...Array.from(set)];
  }, [formaciones]);

  const periodosUnicos = useMemo(() => {
    const set = new Set(formaciones.map(f => f.periodo).filter(Boolean));
    return ["Todos", ...Array.from(set)];
  }, [formaciones]);

  const horasUnicas = useMemo(() => {
    const set = new Set(formaciones.map(f => f.numero_horas).filter(Boolean));
    return ["Todos", ...Array.from(set).sort((a, b) => a - b)];
  }, [formaciones]);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          elevation: 3,
          sx: {
            mt: 1.5,
            width: { xs: '60vw', sm: 261 },
            maxHeight: '80vh',
            overflowY: 'auto',
            px: 2,
            py: 2,
            borderRadius: 2,
          },
        },
      }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Filtros de formación
        </Typography>

        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Autocomplete
              options={lineasUnicas}
              value={linea}
              onChange={(_, newValue) => setLinea(newValue || "Todos")}
              renderInput={(params) => (
                <TextField {...params} label="Línea de Cualificación" size="small" />
              )}
              fullWidth
              clearOnEscape
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={periodosUnicos}
              value={periodo}
              onChange={(_, newValue) => setPeriodo(newValue || "Todos")}
              renderInput={(params) => (
                <TextField {...params} label="Período" size="small" />
              )}
              fullWidth
              clearOnEscape
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={horasUnicas}
              value={horas}
              onChange={(_, newValue) => setHoras(newValue || "Todos")}
              renderInput={(params) => (
                <TextField {...params} label="Horas" size="small" />
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
                <Button variant="contained" fullWidth onClick={aplicarFiltros}>
                  Aplicar
                </Button>
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
          </Grid>
        </Grid>
      </Box>
    </Menu>
  );
};

export default FiltrosFormaciones;
