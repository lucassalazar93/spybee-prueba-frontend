"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import { useAutenticacion } from "@/funcionalidades/autenticacion/estadoAutenticacion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const usuario = useAutenticacion((s) => s.usuario);
  const cerrarSesion = useAutenticacion((s) => s.cerrarSesion);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.marca}>
          <Image
            src="/marca/abeja-spybee.png"
            alt="Spybee"
            width={32}
            height={32}
          />
          <span className={styles.nombreMarca}>Spybee</span>
        </div>

        <div className={styles.usuario}>
          <span className={styles.nombreUsuario}>{usuario?.nombre}</span>

          <button
            className={styles.botonSalir}
            onClick={() => {
              cerrarSesion();
              router.replace("/login");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className={styles.contenido}>{children}</main>
    </div>
  );
}
