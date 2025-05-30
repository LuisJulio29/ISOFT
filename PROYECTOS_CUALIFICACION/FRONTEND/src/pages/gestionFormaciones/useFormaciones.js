import { useState, useEffect } from 'react';
import { gsUrlApi } from '@src/config/ConfigServer';

export const useFormaciones = () => {
    const [formaciones, setFormaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const listarFormaciones = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch(gsUrlApi + "/formacion/listar", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });


            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            setFormaciones(data.formaciones || []);
            setError(null);
        } catch (err) {
            console.error('Error al listar formaciones:', err);
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const crearFormacion = async (nuevaFormacion) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(gsUrlApi + "/formacion/insertar", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(nuevaFormacion),
            });

            const data = await response.json();

            if (response.ok) {
                await listarFormaciones(); // para refrescar
                return { success: true, mensaje: data.mensaje };
            } else {
                return { success: false, mensaje: data.failure_message || "Error desconocido" };
            }
        } catch (err) {
            console.error("Error en crearFormacion:", err);
            return { success: false, mensaje: err.message || "Error inesperado" };
        }
    };


    useEffect(() => {
        listarFormaciones();
    }, []);

    return { formaciones, loading, error, listarFormaciones, crearFormacion };
};
