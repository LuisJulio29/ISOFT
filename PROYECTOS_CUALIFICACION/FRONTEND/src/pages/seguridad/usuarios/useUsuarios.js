import { useState, useEffect } from 'react';
import { gsUrlApi } from '@src/config/ConfigServer';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const listarUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${gsUrlApi}/usuarios/listar`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error al obtener usuarios');
      }

      setUsuarios(data.usuarios || []);
      setError(null);
    } catch (err) {
      console.error("Error al listar usuarios:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   const eliminarUsuario = async (id_usuario) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${gsUrlApi}/usuarios/eliminar/${id_usuario}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error al eliminar usuario');
      }


      return { success: true, mensaje: data.mensaje };
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
  listarUsuarios();
}, []);

  return {
    usuarios,
    loading,
    error,
    listarUsuarios,
    setUsuarios,
    eliminarUsuario
  };
};
