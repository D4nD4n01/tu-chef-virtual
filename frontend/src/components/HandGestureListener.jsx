import { useEffect, useState } from "react";
import axios from "axios";

export default function HandGestureListener({ recetaActual, onLike, onDislike }) {
  const [status, setStatus] = useState({ gesto_actual: "NADA", progreso: 0, accion_confirmada: "" });

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get("http://localhost:5000/status");
        setStatus(res.data);

        if (res.data.accion_confirmada === "LIKE") {
          onLike(recetaActual);
        }

        if (res.data.accion_confirmada === "DISLIKE") {
          onDislike(recetaActual);
        }
      } catch (e) {
        console.log("No se pudo conectar al servidor de gestos");
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20 }}>
      <img
        src="http://localhost:5000/video_feed"
        style={{
          width: "220px",
          height: "165px",
          borderRadius: "10px",
          border: "3px solid #00bcd4",
        }}
        alt="camera"
      />

      <div style={{ textAlign: "center", color: "white", marginTop: "6px" }}>
        <strong>{status.gesto_actual}</strong>
        <br />
        Progreso: {status.progreso}%
      </div>
    </div>
  );
}
