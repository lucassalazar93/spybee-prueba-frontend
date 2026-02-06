"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapa } from "../estado/estadoMapa";
import styles from "./mapa.module.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export default function MapaPage() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const marcadores = useMapa((s) => s.marcadores);
  const cargar = useMapa((s) => s.cargar);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-75.5812, 6.2442],
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
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    marcadores.forEach((m) => {
      const el = document.createElement("div");
      el.className = styles.pin;

      new mapboxgl.Marker(el)
        .setLngLat([m.lng, m.lat])
        .setPopup(new mapboxgl.Popup().setText(m.nombre))
        .addTo(mapRef.current!);
    });
  }, [marcadores]);

  return (
    <section className={styles.contenedor}>
      <h1>Mapa</h1>
      <div ref={containerRef} className={styles.mapa} />
    </section>
  );
}
