import type { MarcadorMapa } from "../tipos/marcador";
import datos from "@/../mock_data.json";

type DatosCrudos = {
  _id?: string;
  title?: string;
  position?: { lat?: number; lng?: number };
};

export async function cargarMarcadores(): Promise<MarcadorMapa[]> {
  const lista = Array.isArray(datos) ? datos : [];

  return lista
    .filter((p: DatosCrudos) => p.position?.lat != null && p.position?.lng != null)
    .map((p: DatosCrudos) => ({
      id: p._id ?? "",
      nombre: p.title ?? "Sin nombre",
      lat: p.position!.lat!,
      lng: p.position!.lng!,
    }));
}
