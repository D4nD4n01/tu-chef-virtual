from flask import Flask, render_template, Response, jsonify
from flask_cors import CORS # Si tienes problemas de CORS, esto ayuda
import cv2
import Manos as sm
import time
import requests

app = Flask(__name__)
CORS(app) # Habilita acceso desde React si están en puertos distintos

detector = sm.detectormanos(Confdeteccion=0.75)
cap = cv2.VideoCapture(0) # Si falla, cambia a 1

# --- VARIABLES GLOBALES ---
accion_actual = "NADA"
tiempo_inicio = 0
progreso = 0
accion_confirmada = "" 

# Bandera para evitar que se guarde 50 veces el mismo like si dejas la mano arriba
gesto_bloqueado = False 

def detectar_gesto(lista):
    """
    Lógica mejorada para detectar Like y Dislike usando el meñique como referencia.
    """
    if len(lista) == 0: return "NADA"

    # Coordenadas Y (Altura): Recuerda que en computación, 
    # Y=0 es la parte SUPERIOR de la pantalla.
    # Menor Y = Más arriba. Mayor Y = Más abajo.
    
    y_pulgar_punta = lista[4][2]      # Punta del pulgar
    y_meñique_base = lista[17][2]     # Nudillo base del meñique (MCP)
    y_indice_base = lista[5][2]       # Nudillo base del índice

    # --- REGLA 1: LIKE (Pulgar Arriba) ---
    # El pulgar debe estar ARRIBA (menor Y) de los nudillos del índice y meñique
    if y_pulgar_punta < y_indice_base and y_pulgar_punta < y_meñique_base:
        return "LIKE"

    # --- REGLA 2: DISLIKE (Pulgar Abajo) ---
    # El pulgar debe estar ABAJO (mayor Y) del nudillo del meñique.
    # Esta comparación (4 vs 17) es la más fiable para el dislike.
    if y_pulgar_punta > y_meñique_base:
        return "DISLIKE"
        
    return "NADA"

def generar_frames():
    global accion_actual, tiempo_inicio, progreso, accion_confirmada, gesto_bloqueado

    while True:
        success, frame = cap.read()
        if not success: break

        frame = cv2.flip(frame, 1)
        frame = detector.encontrarmanos(frame)
        lista, bbox = detector.encontrarposicion(frame, dibujar=False)

        nuevo_gesto = detectar_gesto(lista)

        # Si detectamos un gesto válido
        if nuevo_gesto != "NADA":
            # Si es el mismo gesto que estábamos trackeando
            if nuevo_gesto == accion_actual:
                if not gesto_bloqueado: # Solo contamos si no hemos confirmado ya
                    tiempo_transcurrido = time.time() - tiempo_inicio
                    progreso = int((tiempo_transcurrido / 2.0) * 100) # 2 segundos

                    if progreso >= 100:
                        progreso = 100
                        # AQUÍ ESTÁ EL CAMBIO CLAVE:
                        # Guardamos la acción y BLOQUEAMOS para no sobreescribir
                        accion_confirmada = nuevo_gesto 
                        gesto_bloqueado = True 
            else:
                # El gesto cambió a mitad de camino (ej. de Like pasó a Dislike)
                accion_actual = nuevo_gesto
                tiempo_inicio = time.time()
                progreso = 0
                # Nota: No desbloqueamos aquí, solo si baja la mano a "NADA"
        
        else:
            # Si el usuario baja la mano ("NADA")
            accion_actual = "NADA"
            progreso = 0
            gesto_bloqueado = False # Liberamos el bloqueo para permitir un nuevo like futuro
            # IMPORTANTE: NO borramos accion_confirmada aquí. 
            # Dejamos que se quede guardada hasta que React la lea.

        # --- DIBUJO EN PANTALLA ---
        if accion_confirmada != "":
            # Muestra feedback visual verde/rojo si hay una acción pendiente de leer
            color = (0, 255, 0) if accion_confirmada == "LIKE" else (0, 0, 255)
            cv2.putText(frame, f"{accion_confirmada} LISTO", (150, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 3)
        
        elif progreso > 0:
            # Barra de carga
            cv2.rectangle(frame, (50, 400), (50 + (progreso * 4), 430), (0, 255, 255), cv2.FILLED)
            cv2.putText(frame, f"{progreso}%", (460, 425), cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 255), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index():
    return "Servidor Chef Virtual Activo"

@app.route('/video_feed')
def video_feed():
    return Response(generar_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/status')
def status():
    global accion_confirmada
    
    # 1. Copiamos la acción actual para enviarla a React
    respuesta_para_react = accion_confirmada
    
    # 2. Preparamos el JSON
    response = {
        "gesto_actual": accion_actual,
        "progreso": progreso,
        "accion_confirmada": respuesta_para_react
    }
    
    # 3. EL TRUCO: Si enviamos un dato real ("LIKE" o "DISLIKE"), 
    # limpiamos la variable inmediatamente para que no se ejecute dos veces.
    if accion_confirmada != "":
        accion_confirmada = ""

    return jsonify(response)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)