import { ItemProyecto } from "../tipos/proyecto";

const DIAS_POR_VENCER = 7;

export function esItemPorVencer(item: ItemProyecto, hoy = new Date()): boolean {
  if (item.status !== "active") return false;

  const fechaLimite = new Date(item.limitDate);
  const diferenciaMs = fechaLimite.getTime() - hoy.getTime();
  const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);

  return diferenciaDias >= 0 && diferenciaDias <= DIAS_POR_VENCER;
}
