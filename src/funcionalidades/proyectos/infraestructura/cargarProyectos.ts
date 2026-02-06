import datos from "@/../mock_data.json";
import type { Proyecto, ItemProyecto } from "../tipos/proyecto";

type DatosCrudos = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  projectPlanData?: { plan?: string };
  plan?: string;
  status?: string;
  state?: string;
  users?: Array<{ name?: string; lastName?: string }>;
  team?: string[];
  position?: { lat?: number; lng?: number };
  city?: string;
  address?: string;
  clientData?: { title?: string };
  createdAt?: string;
  lastUpdated?: string;
  incidents?: Array<{
    _id?: string;
    id?: string;
    item?: string;
    status?: string;
    limitDate?: string;
    description?: string;
    owner?: string;
  }>;
};

function adaptarProyecto(crudo: DatosCrudos): Proyecto {
  const incidents: ItemProyecto[] = (crudo.incidents ?? []).map((inc) => ({
    id: inc._id ?? inc.id ?? "",
    item: (inc.item as ItemProyecto["item"]) ?? "incidents",
    status: (inc.status as ItemProyecto["status"]) ?? "active",
    limitDate: inc.limitDate ?? "",
    description: inc.description,
    owner: inc.owner,
  }));

  const team: string[] =
    crudo.team ??
    (crudo.users ?? []).map((u) =>
      [u.name, u.lastName].filter(Boolean).join(" "),
    );

  return {
    id: crudo._id ?? crudo.id ?? "",
    name: crudo.title ?? crudo.name ?? "Sin nombre",
    plan: crudo.projectPlanData?.plan ?? crudo.plan ?? "",
    state: crudo.status ?? crudo.state ?? "",
    team,
    position: {
      lat: crudo.position?.lat ?? 0,
      lng: crudo.position?.lng ?? 0,
    },
    incidents,
    city: crudo.city ?? "",
    address: crudo.address ?? "",
    clientName: crudo.clientData?.title ?? "",
    createdAt: crudo.createdAt ?? "",
    lastUpdated: crudo.lastUpdated ?? "",
  };
}

function esArrayDatos(valor: unknown): valor is DatosCrudos[] {
  return Array.isArray(valor);
}

export function cargarProyectos(): Proyecto[] {
  let datosCrudos: DatosCrudos[] = [];

  if (esArrayDatos(datos)) {
    datosCrudos = datos;
  } else if (typeof datos === "object" && datos !== null) {
    const posible = (datos as { projects?: unknown }).projects;
    if (esArrayDatos(posible)) {
      datosCrudos = posible;
    } else {
      const posibleAnidado = (datos as { data?: { projects?: unknown } }).data
        ?.projects;
      if (esArrayDatos(posibleAnidado)) {
        datosCrudos = posibleAnidado;
      }
    }
  }

  return datosCrudos.map(adaptarProyecto);
}
