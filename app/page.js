"use client";

import { useState } from "react";

export default function Home() {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <main className="whoApp">
        <header className="topbar">
          <div>
            <span className="logoSmall">WHO</span>
            <p>La tua identità. Le tue conversazioni.</p>
          </div>
          <div className="status">● ONLINE</div>
        </header>

        <section className="welcome">
          <p className="tag">BENVENUTO IN WHO</p>
          <h1>Chi vuoi essere oggi?</h1>
          <p className="subtitle">
            Entra senza mostrare chi sei.
            <br />
            Scegli un&apos;identità e inizia a parlare.
          </p>
        </section>

        <section className="menu">
          <button className="card" onClick={() => alert("STANZE FUNZIONA")}>
            <span className="icon">●</span>
            <span>
              <strong>STANZE</strong>
              <small>Entra nelle chat pubbliche</small>
            </span>
            <b>›</b>
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="whoApp">
      <section className="welcome">
        <p className="tag">WHO</p>
        <h1>Entra nel mondo WHO</h1>
        <p className="subtitle">
          Chat anonime. Nuove identità. Conversazioni vere.
        </p>

        <button className="card" onClick={() => setStarted("stanze")}>
          <span>
            <strong>ENTRA</strong>
            <small>Inizia adesso</small>
          </span>
          <b>›</b>
        </button>
      </section>
    </main>
  );
}
