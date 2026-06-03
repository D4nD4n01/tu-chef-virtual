import streamlit as st
import requests
import pandas as pd
import plotly.express as px
import time

# Configuración inicial de la página
st.set_page_config(page_title="Monitor de Preferencias", layout="wide")

# 1. Función para simular el "fetch" de JavaScript en Python
@st.cache_data(ttl=10) # Cacheamos por 10 segundos
def fetch_dashboard_data():
    url = "http://localhost:3111/getDashboard" 
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return pd.DataFrame(data)
    except Exception as e:
        st.error(f"Error al conectar con la base de datos: {e}")
        return pd.DataFrame()

# Cargar los datos
df = fetch_dashboard_data()

if df.empty:
    st.warning("No hay datos disponibles o el servidor Node.js está apagado.")
    st.stop()

# ==========================================
# NUEVO SISTEMA DE NAVEGACIÓN
# ==========================================
# Usamos un radio button horizontal en lugar de st.tabs
vista = st.radio(
    "Selecciona una vista:", 
    [" Rotación por Usuario", " Resumen Global"], 
    horizontal=True
)
st.divider()

# ==========================================
# VISTA 1: Rotación cada 5 segundos
# ==========================================
if vista == " Rotación por Usuario":
    st.title("Preferencias por Usuario")
    
    # Obtener lista de usuarios únicos
    usuarios = df['strUser'].unique()
    
    if len(usuarios) > 0:
        if 'user_idx' not in st.session_state:
            st.session_state.user_idx = 0
            
        usuario_actual = usuarios[st.session_state.user_idx]
        st.subheader(f"Usuario: {usuario_actual}")
        
        # Filtrar datos del usuario actual
        df_user = df[df['strUser'] == usuario_actual]
        
        col1, col2, col3 = st.columns(3)
        
        # Función auxiliar para crear gráficas de dona
        def crear_dona(datos, titulo, color_sequence):
            datos = datos.copy()
            datos['Valor'] = 1 
            if datos.empty:
                fig_empty = px.pie(title=f"Sin {titulo.lower()}", hole=0.6)
                fig_empty.update_layout(title_font_size=24)
                return fig_empty
            
            fig = px.pie(datos, values='Valor', names='strAlimento', title=titulo, hole=0.6,
                         color_discrete_sequence=color_sequence)
            
            fig.update_traces(
                textposition='inside', 
                textinfo='label', 
                textfont_size=18 
            )
            
            fig.update_layout(
                showlegend=False,
                title_font_size=24 
            )
            
            return fig

        with col1:
            df_gustos = df_user[df_user['intTipo'] == 1]
            st.plotly_chart(crear_dona(df_gustos, "Gustos", px.colors.sequential.Greens), use_container_width=True)
            
        with col2:
            df_disgustos = df_user[df_user['intTipo'] == 2]
            st.plotly_chart(crear_dona(df_disgustos, "Disgustos", px.colors.sequential.Oranges), use_container_width=True)
            
        with col3:
            df_alergias = df_user[df_user['intTipo'] == 3]
            st.plotly_chart(crear_dona(df_alergias, "Alergias", px.colors.sequential.Reds), use_container_width=True)

        # Lógica para recargar la página (SOLO ocurre si esta vista está activa)
        time.sleep(5)
        st.session_state.user_idx = (st.session_state.user_idx + 1) % len(usuarios)
        st.rerun()

# ==========================================
# VISTA 2: Agregado de todos los usuarios (Estática)
# ==========================================
elif vista == " Resumen Global":
    st.title("Tendencias Globales")
    st.markdown("¿Qué alimentos son los más populares o los más problemáticos entre todos los usuarios?")
    
    colA, colB, colC = st.columns(3)
    
    def agrupar_y_contar(tipo):
        # Filtramos por tipo, agrupamos por alimento y contamos cuántos usuarios lo tienen
        df_agrupado = df[df['intTipo'] == tipo].groupby('strAlimento')['idUser'].nunique().reset_index()
        df_agrupado.columns = ['Alimento', 'Cantidad de Usuarios']
        df_agrupado = df_agrupado.sort_values(by='Cantidad de Usuarios', ascending=False)
        return df_agrupado

    with colA:
        st.subheader(" Gustos más comunes")
        df_global_gustos = agrupar_y_contar(1)
        st.dataframe(df_global_gustos, use_container_width=True, hide_index=True)
        
    with colB:
        st.subheader(" Disgustos más comunes")
        df_global_disgustos = agrupar_y_contar(2)
        st.dataframe(df_global_disgustos, use_container_width=True, hide_index=True)
        
    with colC:
        st.subheader(" Alergias más comunes")
        df_global_alergias = agrupar_y_contar(3)
        st.dataframe(df_global_alergias, use_container_width=True, hide_index=True)