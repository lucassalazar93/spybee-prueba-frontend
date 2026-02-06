"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { useAutenticacion } from "@/funcionalidades/autenticacion/estadoAutenticacion";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("lucas salazar");
  const [contrasena, setContrasena] = useState("123456789");

  const router = useRouter();

  const autenticado = useAutenticacion((s) => s.autenticado);
  const iniciarSesion = useAutenticacion((s) => s.iniciarSesion);

  useEffect(() => {
    if (autenticado) {
      router.replace("/dashboard");
    }
  }, [autenticado, router]);

  if (autenticado) {
    return null;
  }

  return (
    <main className={styles.pagina}>
      <section className={styles.tarjeta} aria-label="Inicio de sesión">
        <header className={styles.encabezado}>
          <div className={styles.logo}>
            <Image
              src="/marca/abeja-spybee.png"
              alt="Spybee"
              width={56}
              height={56}
              priority
            />
          </div>

          <h1 className={styles.titulo}>Iniciar sesión</h1>
          <p className={styles.subtitulo}>
            Accede al panel de proyectos para continuar.
          </p>
        </header>

        <form
          className={styles.formulario}
          onSubmit={(e) => {
            e.preventDefault();

            iniciarSesion(usuario.trim() || "Usuario");
            router.replace("/dashboard");
          }}
        >
          <label className={styles.campo}>
            <span className={styles.label}>Usuario</span>
            <input
              className={styles.input}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Tu usuario"
              autoComplete="username"
            />
          </label>

          <label className={styles.campo}>
            <span className={styles.label}>Contraseña</span>
            <input
              className={styles.input}
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Tu contraseña"
              autoComplete="current-password"
            />
          </label>

          <button className={styles.boton} type="submit">
            Entrar
          </button>
        </form>

        <footer className={styles.pie}>
          <p>
            Login de prueba. <strong>No requiere credenciales reales.</strong>
          </p>
        </footer>
      </section>
    </main>
  );
}
