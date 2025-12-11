from flask import Flask, render_template, Response, jsonify
import cv2
import Manos as sm
import time
import math
import requests

app = Flask(__name__)

detector = sm.detectormanos(Confdeteccion=0.75)
cap = cv2.VideoCapture(0)

# Estado actual
accion_actual = "NADA"   # LIKE, DISLIKE, NADA
tiempo_inicio = 0        # Cuándo empezó el gesto
progreso = 0             # 0 a 100% de confirmación
accion_confirmada = ""   # La acción final que la web leerá

def detectar_gesto(lista):
    """
    Lógica matemática para Like (Pulgar Arriba) y Dislike (Pulgar Abajo)
    """
    if len(lista) == 0: return "NADA"

    # Puntos clave
    # 4: Punta del pulgar
    # 3: Articulación del pulgar (IP)
    # 2: Articulación base del pulgar (MCP)
    # 0: Muñeca
    
    y_pulgar = lista[4][2]
    y_meñique = lista[20][2]
    y_indice_base = lista[5][2]
    
    x_pulgar = lista[4][1]
    x_indice_base = lista[5][1]

    # REGLA 1: LIKE 
    if y_pulgar < y_indice_base and y_pulgar < y_meñique:
        return "LIKE"

    # REGLA 2: DISLIKE 
    if y_pulgar > y_indice_base:
        return "DISLIKE"
        
    return "NADA"

def generar_frames():
    """
    Procesa el video frame a frame para mostrarlo en la web
    """
    global accion_actual, tiempo_inicio, progreso, accion_confirmada

    while True:
        success, frame = cap.read()
        if not success: break

        frame = cv2.flip(frame, 1)
        frame = detector.encontrarmanos(frame)
        lista, bbox = detector.encontrarposicion(frame, dibujar=False)

        nuevo_gesto = detectar_gesto(lista)

        # Tiempo para confirmar  2.5 segundos
        if nuevo_gesto != "NADA":
            if nuevo_gesto == accion_actual:
                # calcular tiempo para confirmacion
                tiempo_transcurrido = time.time() - tiempo_inicio
                progreso = int((tiempo_transcurrido / 2.5) * 100) # porcentaje
                
                if progreso >= 100:
                    progreso = 100
                    accion_confirmada = nuevo_gesto # guardar accion
                    color = (0, 255, 0) if nuevo_gesto == "LIKE" else (0, 0, 255)
                    cv2.rectangle(frame, (0,0), (640, 480), color, 10)
                    cv2.putText(frame, f"{nuevo_gesto} CONFIRMADO", (150, 240), cv2.FONT_HERSHEY_SIMPLEX, 1.5, color, 3)
            else:
                # Si cambió de gesto (ej. de Like a Nada), reiniciamos
                accion_actual = nuevo_gesto
                tiempo_inicio = time.time()
                progreso = 0
                accion_confirmada = "" # Limpiamos confirmación previa
                # Notificar al backend principal
                try:
                    requests.post("http://localhost:8000/gesture", json={"accion": nuevo_gesto})
                except:
                    print("No se pudo contactar al backend principal")

        else:
            # Si no hay mano o gesto claro
            accion_actual = "NADA"
            progreso = 0
            # No borramos accion_confirmada inmediatamente para que la web alcance a leerla


        # Barra de progreso
        if progreso > 0 and progreso < 100:
            cv2.rectangle(frame, (50, 400), (50 + (progreso * 4), 430), (0, 255, 255), cv2.FILLED)
            cv2.rectangle(frame, (50, 400), (450, 430), (255, 255, 255), 2)
            cv2.putText(frame, f"Sostenga: {progreso}%", (50, 390), cv2.FONT_HERSHEY_PLAIN, 2, (0, 255, 255), 2)
        
        if accion_actual != "NADA":
            cv2.putText(frame, f"Detectando: {accion_actual}", (10, 50), cv2.FONT_HERSHEY_PLAIN, 2, (0, 255, 0), 2)

        # Codificar imagen
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

#Rutas

@app.route('/')
def index():
    return "Servidor de IA Activo. Usa /video_feed para ver o /status para datos."

@app.route('/video_feed')
def video_feed():
    return Response(generar_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/status')
def status():
    # JSON para la web
    global accion_confirmada
    response = {
        "gesto_actual": accion_actual,
        "progreso": progreso,
        "accion_confirmada": accion_confirmada
    }

    if accion_confirmada != "":
        # delay
        if progreso == 0: 
            accion_confirmada = "" 
            
    return jsonify(response)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)

# http://localhost:5000/video_feed