"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js"; const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
); 
export default function Home() {
  const [started, setStarted] = useState(false);

if (started === "stanze") {
  return (
    <main className="whoApp">
      <header className="topbar">
        <div>
          <span className="logoSmall">WHO</span>
          <p>Chat pubbliche</p>
        </div>
        <div className="status">● ONLINE</div>
      </header>

      <section className="welcome">
        <p className="tag">STANZE WHO</p>
        <h1>Scegli una stanza</h1>
        <p className="subtitle">
          Entra e parla mantenendo la tua identità anonima.
        </p>
      </section>

      <section className="menu">
        <button className="card" onClick={() => setStarted("generale")}>
          <span>
            <strong>💬 GENERALE</strong>
            <small>Parla di tutto</small>
          </span>
        </button>

        <button className="card">
          <span>
            <strong>🌙 NOTTAMBULI</strong>
            <small>Conversazioni senza orari</small>
          </span>
        </button>

        <button className="card">
          <span>
            <strong>❤️ RELAZIONI</strong>
            <small>Amore, amicizia e incontri</small>
          </span>
        </button>

        <button className="card" onClick={() => setStarted(true)}>
          <span>
            <strong>← INDIETRO</strong>
            <small>Torna alla Home</small>
          </span>
        </button>
      </section>
    </main>
  );
}  
  
if (started === "generale") {
  return (
    <main className="whoApp">
      <header className="topbar">
        <div>
          <span className="logoSmall">WHO</span>
          <p>Stanza pubblica</p>
        </div>
        <div className="status">● ONLINE</div>
      </header>

      <section className="welcome">
        <p className="tag">💬 GENERALE</p>
        <h1>Chat Generale</h1>
        <p className="subtitle">
          Parla liberamente mantenendo la tua identità anonima.
        </p>
      </section>

      <section className="menu">
        <div className="card">
          <span>
            <strong>Shadow</strong>
            <small>Ciao a tutti 👋</small>
          </span>
        </div>

        <div className="card">
          <span>
            <strong>Luna</strong>
            <small>Chi è online?</small>
          </span>
        </div>

        <div className="card">
          <span>
            <strong>Neon</strong>
            <small>Benvenuti nella stanza Generale ⚡</small>
          </span>
        </div>

        <input
  type="text"
  id="messageInput"
  placeholder="Scrivi un messaggio..."
  className="card"
/>

<button
  className="card"
  onClick={async () => {
    const input = document.getElementById("messageInput");
    const testo = input.value.trim();

    if (!testo) return;

    const { error } = await supabase
      .from("messages")
      .insert({
        room: "generale",
        nickname: "Shadow",
        content: testo
      });

    if (error) {
      alert("Errore: " + error.message);
      return;
    }

    alert("Messaggio inviato!");
    input.value = "";
  }}
>
  <strong>INVIA</strong>
</button>
  
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
          <button className="card" onClick={() => setStarted("stanze")}>
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

        <button className="card" onClick={() => setStarted(true)}>
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
