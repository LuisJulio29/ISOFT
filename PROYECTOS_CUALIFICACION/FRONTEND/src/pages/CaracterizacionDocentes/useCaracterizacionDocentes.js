import { useState, useEffect } from 'react';
import { gsUrlApi } from '@src/config/ConfigServer';

export const useCaracterizacionDocentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [formaciones, setFormaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const listarDocentes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${gsUrlApi}/usuarioDocente/listar`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            const contentType = response.headers.get('content-type');
            let data = {};

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                console.error(`Respuesta no JSON. Código: ${response.status}`);
                throw new Error(`Respuesta inválida del servidor (${response.status})`);
            }

            if (response.ok && data.status === "SUCCEEDED") {
                setDocentes(data.usuarios_docentes || []);
                setError(null);
            } else {
                const mensaje = data?.error?.message || 'Error al listar docentes.';
                console.error('Error del backend:', mensaje);
                setError(mensaje);
            }
        } catch (err) {
            console.error('Excepción al listar docentes:', err);
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const listarFormaciones = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${gsUrlApi}/formacion/listar`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            const data = await response.json();
            if (response.ok && data.status === "SUCCEEDED") {
                setFormaciones(data || []);
            } else {
                console.error('Error al listar formaciones:', data);
            }
        } catch (error) {
            console.error('Error al obtener formaciones:', error);
        }
    };
   const insertarCualificaciones = async (formacionesActuales, id_docente, formacionesPrevias = []) => {
    const token = localStorage.getItem("token");

    const idsExistentes = formacionesPrevias.map(f => f.id_formacion);

    const nuevasFormaciones = formacionesActuales.filter(
        f => !idsExistentes.includes(f.id_formacion)
    );

    const body = nuevasFormaciones.map(f => {
        const año = f.año || (f.fecha_terminacion ? new Date(f.fecha_terminacion).getFullYear() : null);

        return {
            id_formacion: f.id_formacion,
            año_cursado: año,
            id_docente: id_docente,
        };
    });

    if (!body.length) {
        return { success: false, message: "No hay formaciones nuevas para registrar." };
    }

    try {
        for (const item of body) {

            const res = await fetch(`${gsUrlApi}/cualificacion/insertar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(item)
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("Error del servidor:", res.status, errText);
                throw new Error(`Error ${res.status}: ${errText}`);
            }
        }

        return { success: true };
    } catch (err) {
        return { success: false, message: err.message };
    }
};



    useEffect(() => {
        listarDocentes();
        listarFormaciones();
    }, []);

    return {
        docentes,
        formaciones,
        loading,
        error,
        listarDocentes,
        listarFormaciones,
        insertarCualificaciones
    };
};