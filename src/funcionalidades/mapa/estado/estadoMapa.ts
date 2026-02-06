import { create } from "zustand";
import type { MarcadorMapa } from "../tipos/marcador";
import { cargarMarcadores } from "../infraestructura/cargarMarcadores";

type EstadoMapa = {
  marcadores: MarcadorMapa[];
  cargar: () => Promise<void>;
};

export const useMapa = create<EstadoMapa>((set) => ({
  marcadores: [],

  cargar: async () => {
    const data = await cargarMarcadores();
    set({ marcadores: data });
  },
}));
