import { ItemProyecto } from "../tipos/proyecto";
import { esItemPorVencer } from "./calcularItemsPorVencer";

export type ConteoPorVencer = {
  incidents: number;
  rfi: number;
  tasks: number;
};

export function contarItemsPorVencer(
  items: ItemProyecto[],
  hoy = new Date(),
): ConteoPorVencer {
  return items.reduce<ConteoPorVencer>(
    (acumulado, item) => {
      if (!esItemPorVencer(item, hoy)) return acumulado;

      if (item.item === "incidents") acumulado.incidents += 1;
      if (item.item === "RFI") acumulado.rfi += 1;
      if (item.item === "task") acumulado.tasks += 1;

      return acumulado;
    },
    { incidents: 0, rfi: 0, tasks: 0 },
  );
}
