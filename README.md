# Spybee – Prueba Técnica Frontend

Este repositorio contiene el desarrollo de una **prueba técnica de frontend**, cuyo objetivo es construir un dashboard funcional para la gestión y visualización de proyectos, priorizando una buena experiencia de usuario, claridad visual y una estructura de código mantenible.

La aplicación simula un escenario real con listado de proyectos, métricas relevantes y visualización geográfica, aplicando buenas prácticas de desarrollo frontend moderno.

---

## Tecnologías utilizadas

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **CSS Modules**
- **Zustand** para manejo de estado en cliente
- **Mapbox GL JS** para visualización geográfica

No se utilizaron librerías externas de UI. Todo el layout y los estilos fueron implementados manualmente con CSS vanilla, priorizando control visual y simplicidad.

---

## Arquitectura y organización

El proyecto está organizado por **dominios funcionales**, siguiendo un enfoque basado en funcionalidades en lugar de una separación estricta por capas técnicas.

src/
┣ app/ # Rutas y layouts (Next.js App Router)
┣ aplicacion/
┃ ┗ estilos/ # Estilos globales y variables CSS
┣ funcionalidades/
┃ ┣ autenticacion/
┃ ┣ proyectos/
┃ ┃ ┣ dominio/ # Lógica de negocio
┃ ┃ ┣ estado/ # Estado global (Zustand)
┃ ┃ ┣ infraestructura/ # Carga y adaptación de datos
┃ ┃ ┣ tipos/ # Tipos y contratos
┃ ┃ ┗ ui/ # Componentes de interfaz
┃ ┗ mapa/
┃ ┣ estado/
┃ ┣ infraestructura/
┃ ┣ tipos/
┃ ┗ ui/


Este enfoque permite:
- Aislar la lógica de negocio de la UI
- Escalar funcionalidades sin generar acoplamientos innecesarios
- Facilitar la lectura y el mantenimiento del código

---

## Manejo de estado

El estado global se maneja con **Zustand**, organizado por dominio.  
Cada funcionalidad define su propio store, evitando estados globales innecesarios y favoreciendo una arquitectura clara y predecible.

---

## Estilos y UI

- Estilos implementados con **CSS Modules**
- Enfoque mobile-first
- Uso de HTML semántico
- No se utilizaron frameworks de estilos ni librerías de componentes

Esto permite un mayor control visual y evita dependencias innecesarias para el alcance de la prueba.

---

## Mapa y visualización geográfica

La visualización geográfica se implementa con **Mapbox GL JS**, encapsulada dentro de su propia funcionalidad.

- El mapa se inicializa únicamente en cliente
- Se utiliza carga dinámica para evitar problemas de renderizado en servidor
- Los marcadores se cargan a partir de datos simulados

---

## Scripts disponibles

```bash
npm run dev     # Ejecuta la aplicación en entorno de desarrollo
npm run build   # Genera el build de producción
npm run start   # Ejecuta el build generado
Consideraciones finales
La solución prioriza:

Claridad arquitectónica

Separación de responsabilidades

Buenas prácticas de React y Next.js

Código fácil de entender y extender

El proyecto está pensado como una base sólida que puede escalarse fácilmente en un entorno real de producto.

Autor
Lucas Salazar
Frontend Developer
