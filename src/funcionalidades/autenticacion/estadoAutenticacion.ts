import { create } from "zustand";
import { persist } from "zustand/middleware";

type Usuario = {
  nombre: string;
};

type EstadoAutenticacion = {
  autenticado: boolean;
  usuario: Usuario | null;
  iniciarSesion: (nombre: string) => void;
  cerrarSesion: () => void;
};

export const useAutenticacion = create<EstadoAutenticacion>()(
  persist(
    (set) => ({
      autenticado: false,
      usuario: null,

      iniciarSesion: (nombre: string) =>
        set({
          autenticado: true,
          usuario: { nombre },
        }),

      cerrarSesion: () =>
        set({
          autenticado: false,
          usuario: null,
        }),
    }),
    {
      name: "autenticacion-storage",
    },
  ),
);
