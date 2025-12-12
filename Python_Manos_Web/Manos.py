import math
import cv2
import mediapipe as mp
import time

class detectormanos():
    def __init__(self, mode=False, maxManos=2, Confdeteccion=0.5, Confsegui=0.5):
        self.mode = mode
        self.maxManos = maxManos
        self.Confdeteccion = Confdeteccion
        self.Confsegui = Confsegui

        self.mpmanos = mp.solutions.hands
        self.manos = self.mpmanos.Hands(static_image_mode=self.mode,
                                        max_num_hands=self.maxManos,
                                        min_detection_confidence=self.Confdeteccion,
                                        min_tracking_confidence=self.Confsegui)
        self.dibujo = mp.solutions.drawing_utils
        self.tip = [4, 8, 12, 16, 20]

    def encontrarmanos(self, frame, dibujar=True):
        imgcolor = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        self.resultados = self.manos.process(imgcolor)

        if self.resultados.multi_hand_landmarks:
            for mano in self.resultados.multi_hand_landmarks:
                if dibujar:
                    self.dibujo.draw_landmarks(frame, mano, self.mpmanos.HAND_CONNECTIONS)
        return frame

    def encontrarposicion(self, frame, ManoNum=0, dibujar=True):
        xlista = []
        ylista = []
        bbox = []
        self.lista = []
        
        if self.resultados.multi_hand_landmarks:
            # Verificamos si existe la mano solicitada (Mano 0 o Mano 1)
            if ManoNum < len(self.resultados.multi_hand_landmarks):
                miMano = self.resultados.multi_hand_landmarks[ManoNum]
                
                for id, lm in enumerate(miMano.landmark):
                    alto, ancho, c = frame.shape
                    cx, cy = int(lm.x * ancho), int(lm.y * alto)
                    xlista.append(cx)
                    ylista.append(cy)
                    self.lista.append([id, cx, cy])
                    if dibujar:
                        cv2.circle(frame, (cx, cy), 5, (0, 0, 0), cv2.FILLED)

                xmin, xmax = min(xlista), max(xlista)
                ymin, ymax = min(ylista), max(ylista)
                bbox = xmin, ymin, xmax, ymax
                if dibujar:
                    cv2.rectangle(frame, (xmin - 20, ymin - 20), (xmax + 20, ymax + 20), (0, 255, 0), 2)
            
        return self.lista, bbox