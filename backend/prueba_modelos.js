// prueba_modelos.js
require("dotenv").config(); // Asegúrate de tener tu .env con GEMINI_API_KEY
const API_KEY = process.env.GEMINI_API_KEY;

console.log("--- Probando API Key: " + (API_KEY ? "Detectada" : "NO DETECTADA") + " ---");

async function checkModels() {
  if (!API_KEY) {
    console.error("ERROR: No tienes definida GEMINI_API_KEY en tu archivo .env");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.status !== 200) {
      console.error("\n❌ ERROR DE CONEXIÓN O PERMISOS:");
      console.error(`Status: ${response.status}`);
      console.error("Mensaje:", JSON.stringify(data, null, 2));
      console.log("\nPOSIBLE CAUSA: Estás usando una Key de Google Cloud (Vertex AI) en lugar de Google AI Studio.");
    } else {
      console.log("\n✅ ¡CONEXIÓN EXITOSA! Tu clave funciona.");
      console.log("Modelos disponibles para ti:");
      
      // Filtramos solo los que sirven para generar contenido
      const chatModels = data.models
        .filter(m => m.supportedGenerationMethods.includes("generateContent"))
        .map(m => m.name.replace("models/", ""));
        
      console.log(chatModels);
      
      console.log("\n---> RECOMENDACIÓN: Usa el nombre exacto que ves arriba en tu server.js <---");
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
}

checkModels();