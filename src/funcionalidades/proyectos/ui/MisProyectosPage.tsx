"use client";

import styles from "./misProyectos.module.css";
import { useMemo } from "react";
import { useEstadoProyectos } from "../estado/estadoProyectos";
import { ORDENES_PROYECTOS } from "../tipos/ordenProyectos";
import type { OrdenProyectos } from "../tipos/ordenProyectos";

export function MisProyectosPage() {
  const {
    proyectos,
    paginaActual,
    totalPaginas,
    busqueda,
    orden,
    setBusqueda,
    setOrden,
    irPaginaAnterior,
    irPaginaSiguiente,
  } = useEstadoProyectos();

  const total = proyectos.length;

  const opcionesOrden = useMemo(() => ORDENES_PROYECTOS, []);

  return (
    <section className={styles.contenedor}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.titulo}>Mis proyectos</h1>
          <span className={styles.pill}>
            {total} Proyecto{total === 1 ? "" : "s"}
          </span>
        </div>

        <div className={styles.headerRight}>
          <button className={styles.botonCrear} type="button">
            <span className="material-symbols-outlined" aria-hidden="true">
              add
            </span>
            Crear proyecto
          </button>
        </div>
      </header>

      <div className={styles.controles}>
        <div className={styles.grupoIconos} aria-label="Acciones de vista">
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

        <div className={styles.controlesDerecha}>
          <label className={styles.buscador}>
            <span
              className={`material-symbols-outlined ${styles.buscadorIcono}`}
              aria-hidden="true"
            >
              search
            </span>
            <input
              className={styles.buscadorInput}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar"
              autoComplete="off"
            />
          </label>

          <label className={styles.orden}>
            <span className={styles.label}>Orden</span>
            <select
              className={styles.select}
              value={orden}
              onChange={(e) => setOrden(e.target.value as OrdenProyectos)}
            >
              {opcionesOrden.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.paginacion}>
            <button
              className={styles.boton}
              onClick={irPaginaAnterior}
              disabled={paginaActual <= 1}
              type="button"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                chevron_left
              </span>
              Anterior
            </button>

            <span className={styles.paginaTexto}>
              Página {paginaActual} / {totalPaginas}
            </span>

            <button
              className={styles.boton}
              onClick={irPaginaSiguiente}
              disabled={paginaActual >= totalPaginas}
              type="button"
            >
              Siguiente
              <span className="material-symbols-outlined" aria-hidden="true">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.placeholder}>
        <div className={styles.placeholderTop}>
          <p className={styles.placeholderTitulo}>Listado</p>
          <p className={styles.placeholderTexto}>
            Aquí va la tabla con columnas: Proyecto / Plan / Estado / Equipo /
            Próximos a vencer.
          </p>
        </div>

        <div className={styles.skeleton}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonColProyecto}>
                <div className={styles.skeletonLineLg} />
                <div className={styles.skeletonLineSm} />
              </div>
              <div className={styles.skeletonPill} />
              <div className={styles.skeletonPill} />
              <div className={styles.skeletonAvatares}>
                <span className={styles.skeletonAvatar} />
                <span className={styles.skeletonAvatar} />
                <span className={styles.skeletonAvatar} />
              </div>
              <div className={styles.skeletonNums}>
                <div className={styles.skeletonNum} />
                <div className={styles.skeletonNum} />
                <div className={styles.skeletonNum} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
