"use client";

import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useProyectos } from "@/funcionalidades/proyectos/estado/estadoProyectos";
import styles from "./mapaEmbed.module.css";

export function MapaEmbed() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const proyectos = useProyectos((s) => s.proyectos);
  const proyectoSeleccionadoId = useProyectos((s) => s.proyectoSeleccionadoId);

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    if (!token) {
      console.error("Falta NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN");
      return;
    }

    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.0721, 4.711],
      zoom: 0.8,
      projection: "globe",
    });

    mapRef.current.on("style.load", () => {
      mapRef.current?.setFog({
        color: "rgb(186, 210, 235)",
        "high-color": "rgb(36, 92, 223)",
        "horizon-blend": 0.02,
        "space-color": "rgb(11, 11, 25)",
        "star-intensity": 0.6,
      });
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    proyectos.forEach((p) => {
      if (!p.position?.lat || !p.position?.lng) return;

      const el = document.createElement("div");
      el.className = styles.pin;
      el.title = p.name;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([p.position.lng, p.position.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(p.name))
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [proyectos]);

  const volarAProyecto = useCallback(
    (id: string | null) => {
      if (!mapRef.current || !id) return;

      const proyecto = proyectos.find((p) => p.id === id);
      if (!proyecto?.position?.lat || !proyecto?.position?.lng) return;

      mapRef.current.flyTo({
        center: [proyecto.position.lng, proyecto.position.lat],
        zoom: 12,
        duration: 1500,
      });

      const idx = proyectos.findIndex((p) => p.id === id);
      if (idx >= 0 && markersRef.current[idx]) {
        markersRef.current[idx].togglePopup();
      }
    },
    [proyectos],
  );

  useEffect(() => {
    volarAProyecto(proyectoSeleccionadoId);
  }, [proyectoSeleccionadoId, volarAProyecto]);

  if (!token) {
    return (
      <div className={styles.mapa}>
        <p style={{ padding: 16 }}>
          No se pudo cargar el mapa. Falta configurar el token de Mapbox.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className={styles.mapa} />;
}
