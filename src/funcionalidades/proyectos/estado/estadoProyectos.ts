import { create } from "zustand";
import type { Proyecto } from "../tipos/proyecto";
import type { OrdenProyectos } from "../tipos/ordenProyectos";
import { ORDEN_POR_DEFECTO } from "../tipos/ordenProyectos";
import { cargarProyectos } from "../infraestructura/cargarProyectos";

type EstadoProyectos = {
  proyectos: Proyecto[];

  busqueda: string;
  orden: OrdenProyectos;
  paginaActual: number;

  proyectoSeleccionadoId: string | null;

  establecerBusqueda: (texto: string) => void;
  establecerOrden: (orden: OrdenProyectos) => void;
  irAPagina: (pagina: number) => void;
  seleccionarProyecto: (id: string) => void;

  setBusqueda: (texto: string) => void;
  setOrden: (orden: OrdenProyectos) => void;
  irPaginaSiguiente: () => void;
  irPaginaAnterior: () => void;

  obtenerProyectosPaginados: () => Proyecto[];
  obtenerTotalPaginas: () => number;
};

const TAMANO_PAGINA = 10;

export const useProyectos = create<EstadoProyectos>((set, get) => {
  const proyectosIniciales = cargarProyectos();

  return {
    proyectos: proyectosIniciales,

    busqueda: "",
    orden: ORDEN_POR_DEFECTO,
    paginaActual: 1,

    proyectoSeleccionadoId: null,

    establecerBusqueda: (texto) => set({ busqueda: texto, paginaActual: 1 }),
    establecerOrden: (orden) => set({ orden, paginaActual: 1 }),
    irAPagina: (pagina) => set({ paginaActual: pagina }),
    seleccionarProyecto: (id) => set({ proyectoSeleccionadoId: id }),

    setBusqueda: (texto) => set({ busqueda: texto, paginaActual: 1 }),
    setOrden: (orden) => set({ orden, paginaActual: 1 }),
    irPaginaSiguiente: () => {
      const { paginaActual } = get();
      const totalPaginas = get().obtenerTotalPaginas();
      if (paginaActual < totalPaginas) set({ paginaActual: paginaActual + 1 });
    },
    irPaginaAnterior: () => {
      const { paginaActual } = get();
      if (paginaActual > 1) set({ paginaActual: paginaActual - 1 });
    },

    obtenerProyectosPaginados: () => {
      const { proyectos, busqueda, orden, paginaActual } = get();

      const filtrados = filtrarPorBusqueda(proyectos, busqueda);
      const ordenados = ordenarProyectos(filtrados, orden);

      const inicio = (paginaActual - 1) * TAMANO_PAGINA;
      const fin = inicio + TAMANO_PAGINA;

      return ordenados.slice(inicio, fin);
    },

    obtenerTotalPaginas: () => {
      const { proyectos, busqueda } = get();
      const filtrados = filtrarPorBusqueda(proyectos, busqueda);
      return Math.max(1, Math.ceil(filtrados.length / TAMANO_PAGINA));
    },
  };
});

function filtrarPorBusqueda(
  proyectos: Proyecto[],
  busqueda: string,
): Proyecto[] {
  const texto = busqueda.trim().toLowerCase();
  if (!texto) return proyectos;

  return proyectos.filter((p) => (p.name ?? "").toLowerCase().includes(texto));
}

function contarItems(incidents: Array<{ item: string }>) {
  let incidencias = 0;
  let rfi = 0;
  let tareas = 0;

  for (const i of incidents) {
    if (i.item === "incidents") incidencias++;
    else if (i.item === "RFI") rfi++;
    else if (i.item === "task") tareas++;
  }

  return { incidencias, rfi, tareas };
}

function ordenarProyectos(
  proyectos: Proyecto[],
  orden: OrdenProyectos,
): Proyecto[] {
  const copia = [...proyectos];

  return copia.sort((a, b) => {
    const nombreA = a.name ?? "";
    const nombreB = b.name ?? "";

    if (orden === "nombre_asc") return nombreA.localeCompare(nombreB);
    if (orden === "nombre_desc") return nombreB.localeCompare(nombreA);

    const conteoA = contarItems(a.incidents ?? []);
    const conteoB = contarItems(b.incidents ?? []);

    if (orden === "incidencias")
      return conteoB.incidencias - conteoA.incidencias;
    if (orden === "rfi") return conteoB.rfi - conteoA.rfi;
    if (orden === "tareas") return conteoB.tareas - conteoA.tareas;

    return 0;
  });
}

export function useEstadoProyectos() {
  const store = useProyectos();

  const paginados = store.obtenerProyectosPaginados();
  const totalPaginas = store.obtenerTotalPaginas();

  return {
    proyectos: paginados,
    paginaActual: store.paginaActual,
    totalPaginas,
    busqueda: store.busqueda,
    orden: store.orden,
    setBusqueda: store.establecerBusqueda,
    setOrden: store.establecerOrden,
    irPaginaAnterior: () => store.irAPagina(store.paginaActual - 1),
    irPaginaSiguiente: () => store.irAPagina(store.paginaActual + 1),
  };
}
