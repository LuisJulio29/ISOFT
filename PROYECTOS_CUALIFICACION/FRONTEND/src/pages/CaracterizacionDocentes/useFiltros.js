import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export const useFiltros = (docentes = []) => {
  const [busqueda, setBusqueda] = useState("");
  const [facultadFiltro, setFacultadFiltro] = useState("");
  const [programaFiltro, setProgramaFiltro] = useState("");
  const [vinculacionFiltro, setVinculacionFiltro] = useState("");
  const [nivelFiltro, setNivelFiltro] = useState("");
  const [añoFiltro, setAñoFiltro] = useState("");

  const facultades = useMemo(
    () => Array.from(new Set(docentes.map((d) => d.facultad).filter(Boolean))),
    [docentes]
  );
  const programas = useMemo(
    () => Array.from(new Set(docentes.map((d) => d.programa).filter(Boolean))),
    [docentes]
  );
  const tiposVinculacion = useMemo(
    () => Array.from(new Set(docentes.map((d) => d.tipo_vinculacion).filter(Boolean))),
    [docentes]
  );
  const nivelesFormacion = useMemo(
    () => Array.from(new Set(docentes.map((d) => d.nivel_formacion).filter(Boolean))),
    [docentes]
  );
  const añosDisponibles = useMemo(() => {
    return Array.from(
      new Set(
        docentes.flatMap((d) => (d.formaciones || []).map((f) => f.periodo).filter(Boolean))
      )
    ).sort();
  }, [docentes]);

  const docentesFiltrados = useMemo(() => {
    return docentes.filter((docente) => {
      const nombreCompleto = `${docente.nombre || ""} ${docente.apellidos || ""}`.toLowerCase();
      const coincideNombre = nombreCompleto.includes(busqueda.toLowerCase());
      const coincideFacultad = facultadFiltro ? docente.facultad === facultadFiltro : true;
      const coincidePrograma = programaFiltro ? docente.programa === programaFiltro : true;
      const coincideVinculacion = vinculacionFiltro ? docente.tipo_vinculacion === vinculacionFiltro : true;
      const coincideNivel = nivelFiltro ? docente.nivel_formacion === nivelFiltro : true;
      const coincideAño = añoFiltro
        ? (docente.formaciones || []).some((f) => f.periodo === añoFiltro)
        : true;

      return (
        coincideNombre &&
        coincideFacultad &&
        coincidePrograma &&
        coincideVinculacion &&
        coincideNivel &&
        coincideAño
      );
    });
  }, [
    docentes,
    busqueda,
    facultadFiltro,
    programaFiltro,
    vinculacionFiltro,
    nivelFiltro,
    añoFiltro,
  ]);

  const limpiarFiltros = () => {
    setFacultadFiltro("");
    setProgramaFiltro("");
    setVinculacionFiltro("");
    setNivelFiltro("");
    setAñoFiltro("");
  };

  const descargar = () => {
    const dataParaExcel = docentesFiltrados.map((docente) => {
      const formaciones = (docente.formaciones || [])
        .map((f, idx) => `Formación ${idx + 1}: ${f.titulo || f.nombre_formacion} (${f.periodo || "N/A"})`)
        .join("; ");

      return {
        Nombre: docente.nombre,
        Apellidos: docente.apellidos,
        Cédula: docente.cedula,
        Correo: docente.correo_institucional,
        Facultad: docente.facultad,
        Programa: docente.programa,
        "Tipo de Vinculación": docente.tipo_vinculacion,
        Categoría: docente.categoria,
        "Nivel de Formación": docente.nivel_formacion,
        Formaciones: formaciones,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Docentes");
    XLSX.writeFile(workbook, "Docentes_filtrados.xlsx");
  };

  return {
    busqueda,
    setBusqueda,
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
    docentesFiltrados,
    limpiarFiltros,
    descargar
  };
};
