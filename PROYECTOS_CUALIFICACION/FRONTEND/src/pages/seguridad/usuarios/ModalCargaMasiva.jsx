import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import * as XLSX from "xlsx";

const rolesDisponibles = ["Administrador", "Docente", "Estudiante"];

const ModalCargaMasiva = ({ open, onClose, onDataParsed }) => {
  const [archivoNombre, setArchivoNombre] = useState("");
  const [datosExcel, setDatosExcel] = useState([]);
  const [rolSeleccionado, setRolSeleccionado] = useState("");

  const handleArchivoExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArchivoNombre(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const hojaNombre = workbook.SheetNames[0];
      const hoja = workbook.Sheets[hojaNombre];
      const datos = XLSX.utils.sheet_to_json(hoja);

      // Asignar el rol seleccionado a todos los registros
      const datosConRol = datos.map((item) => ({
        ...item,
        rol: rolSeleccionado,
      }));

      setDatosExcel(datosConRol);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubir = () => {
    if (datosExcel.length > 0) {
      onDataParsed?.(datosExcel);
      onClose();
      setArchivoNombre("");
      setRolSeleccionado("");
      setDatosExcel([]);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", width: 600,
        bgcolor: "background.paper", p: 4, borderRadius: 2, boxShadow: 24,
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <Typography variant="h6" mb={1}>
          Carga masiva de usuarios
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Sube un archivo <b>.xlsx</b> o <b>.xls</b> con los datos de los usuarios.
        </Typography>

        <TextField
          select
          label="Asignar rol a todos los usuarios a subir"
          fullWidth
          size="small"
          value={rolSeleccionado}
          onChange={(e) => setRolSeleccionado(e.target.value)}
          sx={{ mb: 2 }}
        >
          {rolesDisponibles.map((rol) => (
            <MenuItem key={rol} value={rol}>
              {rol}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
          Elegir archivo
          <input hidden type="file" accept=".xlsx,.xls,csv" onChange={handleArchivoExcel} />
        </Button>

        <Typography variant="body2" color="text.secondary" mb={3}>
          {archivoNombre || "No se ha seleccionado ningún archivo"}
        </Typography>

        {datosExcel.length > 0 && (
          <TableContainer component={Paper} sx={{ maxHeight: 200, overflow: "auto", mb: 2 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {Object.keys(datosExcel[0]).map((key, i) => (
                    <TableCell key={i}>{key}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {datosExcel.map((row, idx) => (
                  <TableRow key={idx}>
                    {Object.values(row).map((val, i) => (
                      <TableCell key={i}>{val}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="contained" color="error" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubir}
            disabled={!archivoNombre || !rolSeleccionado}
          >
            Subir
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCargaMasiva;
