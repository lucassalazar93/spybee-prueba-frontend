export type OrdenProyectos =
  | "nombre_asc"
  | "nombre_desc"
  | "incidencias"
  | "rfi"
  | "tareas";

export const ORDENES_PROYECTOS: Array<{
  value: OrdenProyectos;
  label: string;
}> = [
  { value: "nombre_asc", label: "Nombre (A → Z)" },
  { value: "nombre_desc", label: "Nombre (Z → A)" },
  { value: "incidencias", label: "Más incidencias" },
  { value: "rfi", label: "Más RFI" },
  { value: "tareas", label: "Más tareas" },
];

export const ORDEN_POR_DEFECTO: OrdenProyectos = "nombre_asc";
