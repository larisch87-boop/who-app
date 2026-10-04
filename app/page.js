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
          <h1>Chi vuoi essere<br />oggi?</h1>
          <p className="subtitle">
            Entra senza mostrare chi sei.<br />
            Scegli un&apos;identità e inizia a parlare.
          </p>
        </section>

        <section className="menu">
          <button className="card">
            <span className="icon">◉</span>
            <span>
              <strong>STANZE</strong>
              <small>Entra nelle chat pubbliche</small>
            </span>
            <b>›</b>
          </button>

          <
