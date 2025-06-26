import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export const useFiltrosFormaciones = (formaciones = []) => {
  const [filtros, setFiltros] = useState({
    linea: "Todos",
    periodo: "Todos",
    horas: "Todos",
  });

  const formacionesFiltradas = useMemo(() => {
    return formaciones.filter((f) => {
      const matchLinea =
        filtros.linea === "Todos" || f.linea_cualificacion === filtros.linea;
      const matchPeriodo =
        filtros.periodo === "Todos" || f.periodo === filtros.periodo;
      const matchHoras =
        filtros.horas === "Todos" ||
        String(f.numero_horas) === String(filtros.horas);

      return matchLinea && matchPeriodo && matchHoras;
    });
  }, [formaciones, filtros]);

  const descargarExcel = () => {
    const data = formacionesFiltradas.map((f) => ({
      Nombre: f.nombre_formacion,
      Periodo: f.periodo,
      "Línea de Cualificación": f.linea_cualificacion,
      "Número de Horas": f.numero_horas,
      "Fecha de Inicio": f.fecha_inicio,
      "Fecha de Terminación": f.fecha_terminacion,
      Observaciones: f.observaciones,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Formaciones");

    // Esta línea descarga el archivo automáticamente (sin file-saver)
    XLSX.writeFile(wb, "formaciones_filtradas.xlsx");
  };

  return {
    filtros,
    setFiltros,
    formacionesFiltradas,
    descargarExcel,
  };
};
