# 🧭 Rumbo Propio — *“De la Vista Nace el Viaje”*

**Rumbo Propio** es una **PWA (Progressive Web App) Offline-First** 100% visual y guiada por voz para viajeros independientes: armas tu viaje a tu ritmo (no al ritmo de un tour), pero con la misma información de seguridad, zonas y secretos locales que te daría un guía experto.

---

## ✨ Características Principales

- **👁️ 100% Visual y Por Voz (*“De la Vista Nace el Viaje”*):**
  - Tarjetas fotográficas, *stories* visuales, píldoras con íconos, comparativas `✅ SÍ` vs `❌ NO` y narración por voz (`🔊 Escuchar`) para no tener que leer textos largos en la calle.
- **🛡️ Escudo de Seguridad y Radar GPS Offline:**
  - Semáforo de barrios (`🟢 Camina Libre`, `🟡 Precaución / Carteristas`, `🔴 Zona Roja / Evitar`).
  - **Alerta Sonora y Vibración** al entrar o salir de zonas inseguras + conexión directa con **Google Maps**.
- **🚨 Rastreo en Tiempo Real, SOS y Embajadas:**
  - Modo híbrido: seguimiento en vivo cuando hay datos + botón **SOS por SMS satelital / WhatsApp** sin internet con coordenadas exactas.
  - Directorio offline con llamada a 1 toque a Policía Turística, emergencias y guardia consular de Embajadas.
- **🔐 Bóveda Digital de Pasaporte con Clave (PIN):**
  - Escanea tu pasaporte con la cámara del celular y guárdalo cifrado localmente con PIN de 4 dígitos (por defecto `1234` en el demo) para dejar el pasaporte físico bajo llave en el hotel.
- **📶 eSIM y Portales Baratos para Viajero Internacional:**
  - Comparadores mayoristas de eSIM (`MobiMatter`, `eSIMDB`, `Airalo`, `Roamless`), guía de chips locales económicos vs. trampas de aeropuerto, y portales oficiales de boletos/trenes sin sobreprecio de agencias.
- **💱 Sistema de Cambio de Divisas y Detector Anti-Estafa ATM:**
  - Conversor bidireccional sin internet, **Billetes Visuales (`💵`)** de bolsillo para pagar rápido en la calle y **Detector de Comisión Oculta** en casas de cambio y cajeros.
- **🗺️ Itinerario a Tu Ritmo, 💸 Gastos Compartidos Multi-Divisa, 📸 Creator Kit para Redes y 🎯 Modo Validación (*Mom Test*).**

---

## 🚀 Cómo probarlo o instalarlo en el celular

### Opción 1: GitHub Pages (Recomendado para instalar en el celular con HTTPS)
1. En tu repositorio de GitHub, ve a **Settings → Pages**.
2. En **Branch**, selecciona `main` (carpeta `/root`) y haz clic en **Save**.
3. Abre el link `https://<tu-usuario>.github.io/rumbo-propio/` en tu celular y toca **“Agregar a pantalla de inicio”**.

### Opción 2: Servidor Local
```bash
python3 -m http.server 8090
```
Abre `http://localhost:8090` en tu navegador.
