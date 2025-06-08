import { useState, useEffect } from 'react';
import { gsUrlApi } from '@src/config/ConfigServer';

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const listarRoles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${gsUrlApi}/roles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error al obtener roles');
      }

      setRoles((data || []).filter(rol => rol.id_rol !== 3));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerInterfacesPorRol = async (idRol) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${gsUrlApi}/roles/${idRol}/interfaces`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Error al obtener interfaces del rol');
    }
    
    return data;
  };

 const guardarInterfacesPorRol = async (idRol, interfaces) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${gsUrlApi}/roles/${idRol}/interfaces`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ interfaces })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Error al guardar permisos');
  }

  return data;
};


  useEffect(() => {
    listarRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    listarRoles,
    setRoles,
    obtenerInterfacesPorRol,
    guardarInterfacesPorRol
  };
};
