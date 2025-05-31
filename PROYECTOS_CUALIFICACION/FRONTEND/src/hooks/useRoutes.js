import { useEffect, useState } from "react";
import { gsUrlApi } from "../config/ConfigServer";

export default function useUserRoutes(token) {
  const [allowedRoutes, setAllowedRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setAllowedRoutes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`${gsUrlApi}/interfaces/buscar`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const rutas = data.interfaces?.map((i) => i.ruta?.toLowerCase()) || [];
        setAllowedRoutes(rutas);
      })
      .catch(() => setAllowedRoutes([]))
      .finally(() => setLoading(false));
  }, [token]);

  return { allowedRoutes, loading };
}
