
------------------------ DOCUMENTACION -----------------------------------------------------
El documento que creamos con nuestra documentacion se encuentra aquí:
https://tecnmtcm-my.sharepoint.com/:p:/g/personal/l21070319_cdmadero_tecnm_mx/IQAct9JXKEbxTI_0pKSRdKK6ASHUPUVNr6DM8otw9oUGzhg?e=4lGf3D

------------------------ INSTRUCCIONES DE USO ----------------------------------------------
para react:
se ocupa node y java jdk para poder usarse
usar en la terminal "npm i" para descargar las dependencias. 
una vez descargadas, usar "npm start" 

para node: 
usar node server.js para correr el codigo.

para servidor de python de manos:
instalar dependencias
*pip install opencv-python
*pip install Flask
una vez descargadas, usar "python servidor_recetas.py" para correr. 

para el servidor de python de streamlit:
escribir en la terminal la siguiente linea:
pip install streamlit pandas requests plotly
una vez instaladas, usar el comando "streamlit run app.py" para correr el servidor.

para la base de datos, ocupamos uniserver, por ello no podemos pasar el ide pero si la base de datos ubicada en la carpeta "datos".

cualquier configuracion con la base de datos:

REACT:
*En el archivo "routes" ubicada en src/ se puede encontrar la ip para cambiarla por la que necesita.
en el archivo "HandGestureListener" ubicado en src/components/ cambiar las lineas: 13, 60. por la dirección ip que necesita.

NODE: 
*En el .env cambiar "GEMINI_API_KEY" por la de ud.
*En el archivo "server" en la linea 20, viene un json sobre los datos para la conexión con la base de datos. cambielos a su preferencia.
