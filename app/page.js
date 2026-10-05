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
              <small>
                {nickname.trim() || "
