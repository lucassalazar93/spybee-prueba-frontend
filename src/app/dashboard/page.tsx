"use client";

import dynamic from "next/dynamic";
import styles from "./dashboard.module.css";
import { useMemo } from "react";

import { useProyectos } from "@/funcionalidades/proyectos/estado/estadoProyectos";
import { ORDENES_PROYECTOS } from "@/funcionalidades/proyectos/tipos/ordenProyectos";
import type { OrdenProyectos } from "@/funcionalidades/proyectos/tipos/ordenProyectos";

const MapaEmbed = dynamic(
  () => import("@/funcionalidades/mapa/ui/MapaEmbed").then((m) => m.MapaEmbed),
  {
    ssr: false,
    loading: () => <div className={styles.mapaLoading}>Cargando mapa...</div>,
  },
);

function contarPorTipo(incidents: Array<{ item: string }>) {
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

function etiquetaEstado(estado: string) {
  if (estado === "active") return "Activo";
  if (estado === "inactive") return "Inactivo";
  if (estado === "suspended") return "Suspendido";
  if (estado === "pending_payment") return "Pendiente";
  return estado;
}

function claseEstado(estado: string) {
  if (estado === "active") return "estadoActivo";
  if (estado === "inactive") return "estadoInactivo";
  if (estado === "suspended") return "estadoSuspendido";
  if (estado === "pending_payment") return "estadoPendiente";
  return "estadoNeutro";
}

function clasePlan(plan: string) {
  if (plan === "small") return "planSmall";
  if (plan === "big") return "planBig";
  return "planNeutro";
}

function iniciales(nombre: string) {
  const parts = nombre.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function DashboardPage() {
  const totalProyectos = useProyectos((s) => s.proyectos.length);
  const paginaActual = useProyectos((s) => s.paginaActual);

  const obtenerProyectosPaginados = useProyectos(
    (s) => s.obtenerProyectosPaginados,
  );
  const obtenerTotalPaginas = useProyectos((s) => s.obtenerTotalPaginas);

  const busqueda = useProyectos((s) => s.busqueda);
  const setBusqueda = useProyectos((s) => s.setBusqueda);

  const orden = useProyectos((s) => s.orden);
  const setOrden = useProyectos((s) => s.setOrden);

  const irPaginaSiguiente = useProyectos((s) => s.irPaginaSiguiente);
  const irPaginaAnterior = useProyectos((s) => s.irPaginaAnterior);
  const seleccionarProyecto = useProyectos((s) => s.seleccionarProyecto);
  const proyectoSeleccionadoId = useProyectos((s) => s.proyectoSeleccionadoId);

  const paginados = obtenerProyectosPaginados();
  const totalPaginas = obtenerTotalPaginas();

  const opcionesOrden = useMemo(() => ORDENES_PROYECTOS, []);

  const puedeIrAtras = paginaActual > 1;
  const puedeIrAdelante = paginaActual < totalPaginas;

  const resumen = useMemo(() => {
    const proyectos = useProyectos.getState?.().proyectos ?? [];
    const active = proyectos.filter((p) => p.state === "active").length;
    return { active };
  }, []);

  const proximosAVencer = useMemo(() => {
    const proyectos = useProyectos.getState?.().proyectos ?? [];
    const hoy = new Date();
    const items: Array<{
      proyectoNombre: string;
      tipo: string;
      fecha: Date;
      fechaStr: string;
    }> = [];

    proyectos.forEach((p) => {
      (p.incidents ?? []).forEach((inc) => {
        if (inc.status !== "active" || !inc.limitDate) return;
        const fecha = new Date(inc.limitDate);
        if (fecha > hoy) {
          const tipoLabel =
            inc.item === "incidents"
              ? "Incidencia"
              : inc.item === "RFI"
                ? "RFI"
                : "Tarea";
          items.push({
            proyectoNombre: p.name,
            tipo: tipoLabel,
            fecha,
            fechaStr: fecha.toLocaleDateString("es-CO"),
          });
        }
      });
    });

    return items
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
      .slice(0, 3);
  }, []);

  return (
    <section className={styles.page}>
      <div className={styles.topHeader}>
        <div className={styles.titulos}>
          <h1 className={styles.h1}>Mis proyectos</h1>
          <span className={styles.pill}>{totalProyectos} Proyectos</span>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.iconGroup} aria-label="Filtros de vista">
            <button className={styles.iconBtn} type="button" title="Ordenar">
              <span className="material-symbols-outlined" aria-hidden="true">
                sort
              </span>
            </button>

            <button className={styles.iconBtn} type="button" title="Lista">
              <span className="material-symbols-outlined" aria-hidden="true">
                format_list_bulleted
              </span>
            </button>

            <button className={styles.iconBtn} type="button" title="Cuadrícula">
              <span className="material-symbols-outlined" aria-hidden="true">
                grid_view
              </span>
            </button>

            <button className={styles.iconBtn} type="button" title="Mapa">
              <span className="material-symbols-outlined" aria-hidden="true">
                map
              </span>
            </button>
          </div>

          <select
            className={styles.select}
            value={orden}
            onChange={(e) => setOrden(e.target.value as OrdenProyectos)}
            title="Ordenar proyectos"
          >
            {opcionesOrden.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label className={styles.searchBox}>
            <span
              className={`material-symbols-outlined ${styles.searchIcon}`}
              aria-hidden="true"
            >
              search
            </span>
            <input
              className={styles.searchInput}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar"
              autoComplete="off"
            />
          </label>

          <button className={styles.btnCrear} type="button">
            <span className="material-symbols-outlined" aria-hidden="true">
              add
            </span>
            Crear proyecto
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.tableHeader}>
            <span>Proyecto</span>
            <span>Plan</span>
            <span>Estado</span>
            <span>Equipo</span>
            <span className={styles.right}>Próximos a vencer</span>
          </div>

          <div className={styles.rowsScroll}>
            <div className={styles.rows}>
              {paginados.map((p) => {
                const team = p.team ?? [];
                const teamCount = team.length;

                const { incidencias, rfi, tareas } = contarPorTipo(
                  p.incidents ?? [],
                );

                const estaSeleccionado = p.id === proyectoSeleccionadoId;

                return (
                  <div
                    key={p.id}
                    className={`${styles.row} ${styles.rowClickable} ${
                      estaSeleccionado ? styles.rowSeleccionado : ""
                    }`}
                    onClick={() => seleccionarProyecto(p.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        seleccionarProyecto(p.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.proyecto}>
                      <div className={styles.proyectoNombre}>{p.name}</div>
                      <div className={styles.proyectoMeta}>
                        {p.city || p.clientName || "—"}
                      </div>
                    </div>

                    <div className={styles.badges}>
                      <span
                        className={`${styles.badge} ${styles[clasePlan(p.plan)]}`}
                      >
                        {p.plan === "small"
                          ? "Pequeño"
                          : p.plan === "big"
                            ? "Avanzado"
                            : p.plan}
                      </span>
                      <span
                        className={`${styles.badge} ${styles[claseEstado(p.state)]}`}
                      >
                        {etiquetaEstado(p.state)}
                      </span>
                    </div>

                    <div className={styles.equipo}>
                      <div className={styles.avatares}>
                        {team.slice(0, 3).map((name, idx) => (
                          <span
                            key={`${p.id}-${idx}`}
                            className={styles.avatar}
                            title={name}
                          >
                            {iniciales(name)}
                          </span>
                        ))}
                        {teamCount > 3 && (
                          <span
                            className={`${styles.avatar} ${styles.avatarExtra}`}
                            title={team.slice(3).join(", ")}
                          >
                            +{teamCount - 3}
                          </span>
                        )}
                        {teamCount === 0 && (
                          <span className={styles.equipoVacio}>—</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.vencer}>
                      <div className={styles.vencerItem}>
                        <div className={styles.vencerNum}>{incidencias}</div>
                        <div className={styles.vencerLbl}>Incidencias</div>
                      </div>
                      <div className={styles.vencerItem}>
                        <div className={styles.vencerNum}>{rfi}</div>
                        <div className={styles.vencerLbl}>RFI</div>
                      </div>
                      <div className={styles.vencerItem}>
                        <div className={styles.vencerNum}>{tareas}</div>
                        <div className={styles.vencerLbl}>Tareas</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {paginados.length === 0 && (
              <div className={styles.vacio}>
                No hay resultados para tu búsqueda.
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button
              className={styles.btnPager}
              type="button"
              onClick={irPaginaAnterior}
              disabled={!puedeIrAtras}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                chevron_left
              </span>
              Anterior
            </button>

            <span className={styles.pageText}>
              Página {paginaActual} / {totalPaginas}
            </span>

            <button
              className={styles.btnPager}
              type="button"
              onClick={irPaginaSiguiente}
              disabled={!puedeIrAdelante}
            >
              Siguiente
              <span className="material-symbols-outlined" aria-hidden="true">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.h2}>Resumen</h2>
              <span className={styles.link}>Ver todos</span>
            </div>

            <div className={styles.sidebarSection}>
              <div className={styles.sectionTitle}>General</div>
              <div className={styles.kpiGrid}>
                <div className={styles.kpi}>
                  <div className={styles.kpiTitle}>Activos</div>
                  <div className={styles.kpiValue}>{resumen.active}</div>
                </div>
                <div className={styles.kpi}>
                  <div className={styles.kpiTitle}>Total</div>
                  <div className={styles.kpiValue}>{totalProyectos}</div>
                </div>
              </div>
            </div>

            <div className={styles.sidebarSection}>
              <div className={styles.sectionTitle}>Próximos a vencer</div>
              <div className={styles.miniList}>
                {proximosAVencer.length === 0 && (
                  <div className={styles.miniMuted}>Sin items próximos</div>
                )}
                {proximosAVencer.map((item, idx) => (
                  <div key={idx} className={styles.miniRow}>
                    <div className={styles.miniStrong}>
                      {item.proyectoNombre}
                    </div>
                    <div className={styles.miniMuted}>
                      {item.tipo} • {item.fechaStr}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.h2}>Ubicaciones</h2>
            </div>
            <MapaEmbed />
          </div>
        </aside>
      </div>
    </section>
  );
}
