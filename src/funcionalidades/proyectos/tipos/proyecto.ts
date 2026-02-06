export type Coordenadas = {
  lat: number;
  lng: number;
};

export type ItemProyecto = {
  id: string;
  item: "incidents" | "RFI" | "task";
  status: "active" | "close";
  limitDate: string;
  description?: string;
  owner?: string;
};

export type Proyecto = {
  id: string;
  name: string;
  plan: string;
  state: string;
  team: string[];
  position: Coordenadas;
  incidents: ItemProyecto[];
  city: string;
  address: string;
  clientName: string;
  createdAt: string;
  lastUpdated: string;
};
