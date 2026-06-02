import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function HandGestureListener({ recetaActual, onLike, onDislike }) {
  const [status, setStatus] = useState({ gesto_actual: "NADA", progreso: 0, accion_confirmada: "" });
  
  // Usamos useRef para recordar la última acción ejecutada y evitar que se repita en bucle
  const ultimaAccionProcesada = useRef("");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get("http://172.16.196.212:5000/status");
        const data = res.data;
        
        setStatus(data);

        const accionServidor = data.accion_confirmada; // "LIKE", "DISLIKE" o ""

        // LÓGICA DE CONTROL:
        // Solo actuamos si hay una acción Y si es diferente a la última que ya procesamos.
        // Esto evita que se guarde la receta 10 veces mientras mantienes la mano arriba.
        if (accionServidor && accionServidor !== "NADA") {
            
            if (accionServidor !== ultimaAccionProcesada.current) {
                // Es una acción nueva, la ejecutamos
                if (accionServidor === "LIKE") {
                    console.log("👍 Like confirmado. Guardando receta...");
                    onLike(recetaActual);
                } 
                else if (accionServidor === "DISLIKE") {
                    console.log("👎 Dislike confirmado. Generando nueva...");
                    onDislike(recetaActual);
                }
                
                // Marcamos esta acción como ya procesada
                ultimaAccionProcesada.current = accionServidor;
            }
        } else {
            // Si el servidor dice "NADA" (el usuario bajó la mano), reseteamos la memoria
            // para permitir un nuevo like o dislike en el futuro.
            ultimaAccionProcesada.current = "";
        }

      } catch (e) {
        console.log("No se pudo conectar al servidor de gestos");
      }
    }, 200);

    return () => clearInterval(interval);

    // IMPORTANTE: Aquí agregamos las dependencias. 
    // Cada vez que cambie la recetaActual, el intervalo se reinicia 
    // para tener acceso a los datos más frescos.
  }, [recetaActual, onLike, onDislike]); 

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      <img
        src="http://172.16.196.212:5000/video_feed"
        style={{
          width: "220px",
          height: "165px",
          borderRadius: "10px",
          border: `3px solid ${status.accion_confirmada === "LIKE" ? "#4caf50" : status.accion_confirmada === "DISLIKE" ? "#f44336" : "#00bcd4"}`,
          transition: "border-color 0.3s"
        }}
        alt="camera"
      />

      <div style={{ textAlign: "center", color: "white", marginTop: "6px", background: "rgba(0,0,0,0.5)", borderRadius: "5px" }}>
        <strong>{status.gesto_actual}</strong>
        <br />
        Progreso: {status.progreso}%
      </div>
    </div>
  );
}