"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const avatars = [
  "Shadow",
  "Pixie",
  "King",
  "Azra",
  "Zero",
  "Luna",
  "Ranger",
  "Neon",
  "Ares",
  "Vix",
  "Nova",
  "Ghost",
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("Shadow");
  const [testo, setTesto] = useState("");

  async function caricaMessaggi() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room", "generale")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setMessages(data || []);
  }

  useEffect(() => {
    caricaMessaggi();
  }, []);

  async function inviaMessaggio() {
    const messaggio = testo.trim();

    if (!messaggio) return;

    const { error } = await supabase.from("messages").insert({
      room: "generale",
      nickname: nickname || "Anonimo",
      avatar: avatar,
      content: messaggio,
      likes: 0,
      dislikes: 0,
    });

    if (error) {
      alert("Errore invio: " + error.message);
      return;
    }

    setTesto("");
    await caricaMessaggi();
  }

  async function vota(id, tipo, valoreAttuale) {
    const nuovoValore = (valoreAttuale || 0) + 1;

    const { error } = await supabase
      .from("messages")
      .update({ [tipo]: nuovoValore })
      .eq("id", id);

    if (error) {
      alert("Errore voto: " + error.message);
      return;
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, [tipo]: nuovoValore } : msg
      )
    );
  }

  // SCHERMATA IDENTITÀ
  if (started === "identita") {
    return (
      <main className="whoApp">
        <header className="topbar">
          <div>
            <span className="logoSmall">WHO</span>
            <p>Crea la tua identità anonima</p>
          </div>

          <div className="status">● ONLINE</div>
        </header>

        <section className="welcome">
          <p className="tag">LA TUA IDENTITÀ</p>
          <h1>Chi vuoi essere?</h1>

          <input
            className="card"
            type="text"
            value={nickname}
            maxLength={20}
            placeholder="Scegli un nickname..."
            onChange={(e) => setNickname(e.target.value)}
          />

          <p className="subtitle">Scegli il tuo avatar</p>
        </section>

        <section className="menu">
          {avatars.map((nome) => (
            <button
              key={nome}
              className="card"
              onClick={() => setAvatar(nome)}
            >
              <span>
                <strong>
                  {avatar === nome ? "✓ " : ""}
                  {nome}
                </strong>

                <small>
                  {avatar === nome
                    ? "Avatar selezionato"
                    : "Seleziona avatar"}
                </small>
              </span>
            </button>
          ))}

          <button
            className="card"
            onClick={() => {
              if (!nickname.trim()) {
                alert("Scegli prima un nickname.");
                return;
              }

              setNickname(nickname.trim());
              setStarted(true);
            }}
          >
            <span>
              <strong>CONTINUA →</strong>
              <small>{nickname.trim() || "Inserisci nickname"}</small>
            </span>
          </button>
        </section>
      </main>
    );
  }

  // SCHERMATA INIZIALE
  if (started === false) {
    return (
      <main className="whoApp">
        <section className="welcome">
          <p className="tag">BENVENUTO SU</p>

          <h1>WHO</h1>

          <p>
            Entra senza mostrare chi sei.
            <br />
            Scegli la tua identità e parla liberamente.
          </p>

          <button
            className="card"
            onClick={() => setStarted("identita")}
          >
            <span>
              <strong>ENTRA IN WHO →</strong>
              <small>Crea la tua identità anonima</small>
            </span>
          </button>
        </section>
      </main>
    );
  }

  // CHAT GENERALE
  return (
    <main className="whoApp">
      <header className="topbar">
        <div>
          <span className="logoSmall">WHO</span>
          <p>Stanza Generale</p>
        </div>

        <div className="status">● ONLINE</div>
      </header>

      <section className="welcome">
        <p className="tag">CHAT PUBBLICA</p>

        <h1>Generale</h1>

        <p>
          {avatar} • {nickname}
        </p>
      </section>

      <section className="menu">
        {messages.length === 0 && (
          <div className="card">
            <span>
              <strong>Nessun messaggio</strong>
              <small>Scrivi il primo messaggio.</small>
            </span>
          </div>
        )}

        {messages.map((msg) => (
          <div className="card" key={msg.id}>
            <span>
              <strong>
                {msg.avatar || "Shadow"} •{" "}
                {msg.nickname || "Anonimo"}
              </strong>

              <small>
                {msg.content || msg.message || msg.text || ""}
              </small>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    vota(msg.id, "likes", msg.likes)
                  }
                >
                  👍 {msg.likes || 0}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    vota(
                      msg.id,
                      "dislikes",
                      msg.dislikes
                    )
                  }
                >
                  👎 {msg.dislikes || 0}
                </button>
              </div>
            </span>
          </div>
        ))}

        <div className="card">
          <input
            type="text"
            value={testo}
            placeholder="Scrivi un messaggio..."
            onChange={(e) => setTesto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                inviaMessaggio();
              }
            }}
          />

          <button type="button" onClick={inviaMessaggio}>
            INVIA
          </button>
        </div>

        <button
          className="card"
          onClick={() => setStarted("identita")}
        >
          <span>
            <strong>CAMBIA IDENTITÀ</strong>
            <small>
              Nickname o avatar
            </small>
          </span>
        </button>
      </section>
    </main>
  );
}
