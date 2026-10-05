"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const avatars = [
  { name: "Shadow", image: "/shadow.png" },
  { name: "Pixie", image: "/pixie.png" },
  { name: "King", image: "/king.png" },
  { name: "Azra", image: "/azra.png" },
  { name: "Zero", image: "/zero.png" },
  { name: "Luna", image: "/luna.png" },
  { name: "Ranger", image: "/ranger.png" },
  { name: "Neon", image: "/neon.png" },
  { name: "Ares", image: "/ares.png" },
  { name: "Vix", image: "/vix.png" },
  { name: "Nova", image: "/nova.png" },
  { name: "Ghost", image: "/ghost.png" },
];

const shopItems = [
  {
    id: "purple-frame",
    icon: "💜",
    nameIT: "Cornice Neon",
    nameEN: "Neon Frame",
    price: 100,
  },
  {
    id: "crown",
    icon: "👑",
    nameIT: "Corona Royal",
    nameEN: "Royal Crown",
    price: 300,
  },
  {
    id: "mask",
    icon: "🎭",
    nameIT: "Maschera Mystery",
    nameEN: "Mystery Mask",
    price: 180,
  },
  {
    id: "aura",
    icon: "⚡",
    nameIT: "Aura Elettrica",
    nameEN: "Electric Aura",
    price: 250,
  },
  {
    id: "badge",
    icon: "💎",
    nameIT: "Badge Elite",
    nameEN: "Elite Badge",
    price: 500,
  },
  {
    id: "background",
    icon: "🌌",
    nameIT: "Sfondo Galaxy",
    nameEN: "Galaxy Background",
    price: 350,
  },
];

const text = {
  it: {
    welcome: "BENVENUTO SU",
    slogan: "Nessun nome. Nessun giudizio. Solo WHO.",
    enter: "ENTRA IN WHO",
    identity: "LA TUA IDENTITÀ",
    whoAreYou: "Chi vuoi essere?",
    nickname: "Scegli un nickname...",
    chooseAvatar: "Scegli il tuo avatar",
    selected: "Selezionato",
    choose: "Scegli",
    continue: "CONTINUA",
    home: "Home",
    rooms: "Stanze",
    shop: "Shop",
    profile: "Profilo",
    general: "Generale",
    generalRoom: "Stanza Generale",
    publicChat: "CHAT PUBBLICA",
    write: "Scrivi un messaggio...",
    send: "INVIA",
    noMessages: "Nessun messaggio",
    firstMessage: "Scrivi il primo messaggio.",
    changeIdentity: "Cambia identità",
    points: "WHO POINTS",
    reputation: "Reputazione",
    level: "Livello",
    shopTitle: "WHO SHOP",
    shopSubtitle: "Personalizza la tua identità",
    buy: "SBLOCCA",
    owned: "POSSEDUTO",
    notEnough: "Non hai abbastanza WHO Points.",
    purchased: "Gadget sbloccato!",
    roomsTitle: "STANZE",
    enterRoom: "ENTRA",
    profileTitle: "IL TUO PROFILO",
    reports: "Segnalazioni confermate",
    goodStanding: "Profilo in regola",
    report: "Segnala",
    reportSent: "Segnalazione inviata alla moderazione.",
    reportInfo:
      "Una segnalazione da sola non toglie punti. I punti possono essere sottratti solo dopo una violazione confermata.",
    pointsInfo:
      "Partecipa positivamente, ricevi apprezzamenti e costruisci la tua reputazione.",
    founder: "FOUNDER",
  },

  en: {
    welcome: "WELCOME TO",
    slogan: "No names. No judgment. Just WHO.",
    enter: "ENTER WHO",
    identity: "YOUR IDENTITY",
    whoAreYou: "Who do you want to be?",
    nickname: "Choose a nickname...",
    chooseAvatar: "Choose your avatar",
    selected: "Selected",
    choose: "Choose",
    continue: "CONTINUE",
    home: "Home",
    rooms: "Rooms",
    shop: "Shop",
    profile: "Profile",
    general: "General",
    generalRoom: "General Room",
    publicChat: "PUBLIC CHAT",
    write: "Write a message...",
    send: "SEND",
    noMessages: "No messages",
    firstMessage: "Write the first message.",
    changeIdentity: "Change identity",
    points: "WHO POINTS",
    reputation: "Reputation",
    level: "Level",
    shopTitle: "WHO SHOP",
    shopSubtitle: "Customize your identity",
    buy: "UNLOCK",
    owned: "OWNED",
    notEnough: "You don't have enough WHO Points.",
    purchased: "Gadget unlocked!",
    roomsTitle: "ROOMS",
    enterRoom: "ENTER",
    profileTitle: "YOUR PROFILE",
    reports: "Confirmed reports",
    goodStanding: "Account in good standing",
    report: "Report",
    reportSent: "Report sent to moderation.",
    reportInfo:
      "A report alone does not remove points. Points can only be deducted after a confirmed violation.",
    pointsInfo:
      "Participate positively, receive appreciation and build your reputation.",
    founder: "FOUNDER",
  },
};

function avatarImage(name) {
  const found = avatars.find((item) => item.name === name);
  return found ? found.image : "/shadow.png";
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState("chat");

  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("Shadow");
  const [testo, setTesto] = useState("");

  const [language, setLanguage] = useState("it");

  // Per ora demo locale.
  // Successivamente questi dati saranno salvati in Supabase.
  const [points, setPoints] = useState(100);
  const [ownedItems, setOwnedItems] = useState([]);
  const [confirmedReports] = useState(0);

  const t = text[language];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("who-language");

    if (savedLanguage === "it" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }
  }, []);

  function changeLanguage(lang) {
    setLanguage(lang);
    localStorage.setItem("who-language", lang);
  }

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
      avatar,
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

  function compra(item) {
    if (ownedItems.includes(item.id)) return;

    if (points < item.price) {
      alert(t.notEnough);
      return;
    }

    setPoints((old) => old - item.price);
    setOwnedItems((old) => [...old, item.id]);

    alert(t.purchased);
  }

  function segnala() {
    alert(t.reportSent);
  }

  const cardStyle = {
    background:
      "linear-gradient(145deg, rgba(32,18,52,.96), rgba(13,10,25,.98))",
    border: "1px solid #5d2b85",
    borderRadius: "22px",
    color: "white",
    boxShadow: "0 8px 28px rgba(0,0,0,.28)",
  };

  const appStyle = {
    minHeight: "100vh",
    color: "white",
    background:
      "radial-gradient(circle at top, #30115b 0%, #12091f 38%, #07050d 100%)",
    paddingBottom: started === true ? "92px" : "30px",
  };

  const languageSelector = (
    <div
      style={{
        display: "flex",
        gap: "6px",
        justifyContent: "flex-end",
        padding: "14px 18px 0",
      }}
    >
      <button
        type="button"
        onClick={() => changeLanguage("it")}
        style={{
          border: language === "it" ? "1px solid #c65cff" : "1px solid #513067",
          background: language === "it" ? "#58217d" : "#17101f",
          color: "white",
          borderRadius: "20px",
          padding: "7px 11px",
        }}
      >
        🇮🇹 IT
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("en")}
        style={{
          border: language === "en" ? "1px solid #c65cff" : "1px solid #513067",
          background: language === "en" ? "#58217d" : "#17101f",
          color: "white",
          borderRadius: "20px",
          padding: "7px 11px",
        }}
      >
        🇬🇧 EN
      </button>
    </div>
  );

  // HOME INIZIALE
  if (started === false) {
    return (
      <main style={appStyle}>
        {languageSelector}

        <section
          style={{
            minHeight: "82vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              letterSpacing: "5px",
              color: "#d398ff",
              marginBottom: "10px",
            }}
          >
            {t.welcome}
          </div>

          <div
            style={{
              fontSize: "82px",
              lineHeight: 1,
              fontWeight: "900",
              letterSpacing: "-6px",
              background:
                "linear-gradient(90deg,#ffffff,#df8cff,#8e5cff,#57d9ff)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 0 18px rgba(186,70,255,.65))",
            }}
          >
            WHO
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              letterSpacing: "6px",
              color: "#9b68be",
            }}
          >
            BE ANYONE
          </div>

          <p
            style={{
              opacity: 0.76,
              marginTop: "28px",
              maxWidth: "330px",
            }}
          >
            {t.slogan}
          </p>

          <button
            type="button"
            onClick={() => setStarted("identita")}
            style={{
              marginTop: "24px",
              width: "100%",
              maxWidth: "360px",
              border: "1px solid #c658ff",
              borderRadius: "22px",
              padding: "18px",
              background:
                "linear-gradient(90deg,#66219a,#382168)",
              color: "white",
              fontWeight: "900",
              fontSize: "16px",
              boxShadow: "0 0 28px rgba(181,65,255,.25)",
            }}
          >
            {t.enter} →
          </button>
        </section>
      </main>
    );
  }

  // SCELTA IDENTITÀ
  if (started === "identita") {
    return (
      <main style={appStyle}>
        {languageSelector}

        <section style={{ padding: "10px 18px 18px" }}>
          <div
            style={{
              color: "#cf83ff",
              fontSize: "12px",
              letterSpacing: "3px",
            }}
          >
            {t.identity}
          </div>

          <h1 style={{ fontSize: "34px", margin: "8px 0 18px" }}>
            {t.whoAreYou}
          </h1>

          <input
            type="text"
            value={nickname}
            maxLength={20}
            placeholder={t.nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{
              ...cardStyle,
              boxSizing: "border-box",
              width: "100%",
              padding: "17px",
              fontSize: "16px",
              outline: "none",
            }}
          />

          <h3 style={{ marginTop: "26px" }}>{t.chooseAvatar}</h3>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            gap: "12px",
            padding: "0 18px",
          }}
        >
          {avatars.map((item) => {
            const selected = avatar === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setAvatar(item.name)}
                style={{
                  ...cardStyle,
                  padding: "14px 8px",
                  border: selected
                    ? "2px solid #cf63ff"
                    : "1px solid #5d2b85",
                  boxShadow: selected
                    ? "0 0 22px rgba(195,78,255,.45)"
                    : "none",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    maxWidth: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: selected
                      ? "3px solid #d870ff"
                      : "2px solid #653389",
                  }}
                />

                <strong
                  style={{
                    display: "block",
                    marginTop: "9px",
                    fontSize: "17px",
                  }}
                >
                  {selected ? "✓ " : ""}
                  {item.name}
                </strong>

                <small style={{ opacity: 0.65 }}>
                  {selected ? t.selected : t.choose}
                </small>
              </button>
            );
          })}
        </section>

        <section style={{ padding: "18px" }}>
          <button
            type="button"
            onClick={() => {
              if (!nickname.trim()) {
                alert(
                  language === "it"
                    ? "Scegli prima un nickname."
                    : "Choose a nickname first."
                );
                return;
              }

              setNickname(nickname.trim());
              setStarted(true);
              setPage("chat");
            }}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "20px",
              border: "1px solid #c75dff",
              background:
                "linear-gradient(90deg,#7026a4,#392267)",
              color: "white",
              fontWeight: "900",
            }}
          >
            {t.continue} →
          </button>
        </section>
      </main>
    );
  }

  function Navigation() {
    const items = [
      ["chat", "💬", t.home],
      ["rooms", "🌐", t.rooms],
      ["shop", "🛍️", t.shop],
      ["profile", "👤", t.profile],
    ];

    return (
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          padding: "9px 6px 12px",
          background: "rgba(8,5,14,.97)",
          borderTop: "1px solid #4e2768",
          backdropFilter: "blur(14px)",
        }}
      >
        {items.map(([id, icon, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPage(id)}
            style={{
              background: "transparent",
              border: "none",
              color: page === id ? "#dc8cff" : "#8f8199",
              fontWeight: page === id ? "800" : "500",
              fontSize: "11px",
              padding: "4px",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "22px",
                marginBottom: "3px",
              }}
            >
              {icon}
            </span>
            {label}
          </button>
        ))}
      </nav>
    );
  }

  // SHOP
  if (page === "shop") {
    return (
      <main style={appStyle}>
        {languageSelector}

        <section style={{ padding: "5px 18px 16px" }}>
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "3px",
              color: "#d17aff",
            }}
          >
            {t.shopTitle}
          </div>

          <h1 style={{ fontSize: "34px", margin: "6px 0" }}>
            {t.shop}
          </h1>

          <p style={{ opacity: 0.7 }}>{t.shopSubtitle}</p>

          <div
            style={{
              ...cardStyle,
              marginTop: "18px",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <small style={{ color: "#cb81ff" }}>{t.points}</small>
              <div style={{ fontSize: "30px", fontWeight: "900" }}>
                ✦ {points}
              </div>
            </div>

            <div style={{ fontSize: "36px" }}>💎</div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            gap: "12px",
            padding: "0 18px 22px",
          }}
        >
          {shopItems.map((item) => {
            const owned = ownedItems.includes(item.id);

            return (
              <div
                key={item.id}
                style={{
                  ...cardStyle,
                  padding: "17px 10px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "8px",
                    filter: "drop-shadow(0 0 10px #9d43ff)",
                  }}
                >
                  {item.icon}
                </div>

                <strong style={{ display: "block" }}>
                  {language === "it" ? item.nameIT : item.nameEN}
                </strong>

                <div
                  style={{
                    color: "#d693ff",
                    fontWeight: "800",
                    margin: "9px 0",
                  }}
                >
                  ✦ {item.price}
                </div>

                <button
                  type="button"
                  disabled={owned}
                  onClick={() => compra(item)}
                  style={{
                    width: "100%",
                    borderRadius: "14px",
                    padding: "10px 4px",
                    border: "1px solid #8642ae",
                    background: owned ? "#28202d" : "#542071",
                    color: "white",
                    fontWeight: "800",
                  }}
                >
                  {owned ? t.owned : t.buy}
                </button>
              </div>
            );
          })}
        </section>

        <Navigation />
      </main>
    );
  }

  // STANZE
  if (page === "rooms") {
    const rooms = [
      ["🌍", t.general, "LIVE"],
      ["💜", "Friends", "LIVE"],
      ["🎮", "Gaming", "LIVE"],
      ["🌙", "Night WHO", "LIVE"],
      ["🎵", "Music", "LIVE"],
      ["❤️", "Dating", "LIVE"],
    ];

    return (
      <main style={appStyle}>
        {languageSelector}

        <section style={{ padding: "5px 18px" }}>
          <div
            style={{
              color: "#d17aff",
              letterSpacing: "3px",
              fontSize: "12px",
            }}
          >
            {t.roomsTitle}
          </div>

          <h1 style={{ fontSize: "34px" }}>{t.rooms}</h1>

          {rooms.map(([icon, name, status]) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                if (name === t.general) setPage("chat");
              }}
              style={{
                ...cardStyle,
                width: "100%",
                marginBottom: "12px",
                padding: "17px",
                display: "flex",
                alignItems: "center",
                textAlign: "left",
                gap: "14px",
              }}
            >
              <span style={{ fontSize: "30px" }}>{icon}</span>

              <span style={{ flex: 1 }}>
                <strong style={{ display: "block" }}>{name}</strong>
                <small style={{ color: "#54e89a" }}>● {status}</small>
              </span>

              <strong style={{ color: "#ce75ff" }}>→</strong>
            </button>
          ))}
        </section>

        <Navigation />
      </main>
    );
  }

  // PROFILO
  if (page === "profile") {
    const level = Math.max(1, Math.floor(points / 100) + 1);

    return (
      <main style={appStyle}>
        {languageSelector}

        <section
          style={{
            padding: "8px 18px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#d17aff",
              letterSpacing: "3px",
              fontSize: "12px",
            }}
          >
            {t.profileTitle}
          </div>

          <img
            src={avatarImage(avatar)}
            alt={avatar}
            style={{
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid #c65cff",
              marginTop: "22px",
              boxShadow: "0 0 32px rgba(192,70,255,.5)",
            }}
          />

          <h1 style={{ marginBottom: "3px" }}>{nickname}</h1>
          <div style={{ color: "#bd78e8" }}>{avatar}</div>
        </section>

        <section style={{ padding: "15px 18px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div style={{ ...cardStyle, padding: "17px" }}>
              <small>{t.points}</small>
              <div style={{ fontSize: "28px", fontWeight: "900" }}>
                ✦ {points}
              </div>
            </div>

            <div style={{ ...cardStyle, padding: "17px" }}>
              <small>{t.level}</small>
              <div style={{ fontSize: "28px", fontWeight: "900" }}>
                {level}
              </div>
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              marginTop: "12px",
              padding: "17px",
            }}
          >
            <strong>🛡️ {t.reputation}</strong>

            <p style={{ opacity: 0.72, fontSize: "14px" }}>
              {t.pointsInfo}
            </p>

            <div style={{ color: "#61eaa3" }}>
              ✓ {t.goodStanding}
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              marginTop: "12px",
              padding: "17px",
            }}
          >
            <strong>⚠️ {t.reports}: {confirmedReports}</strong>

            <p
              style={{
                opacity: 0.65,
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              {t.reportInfo}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setStarted("identita")}
            style={{
              ...cardStyle,
              width: "100%",
              padding: "17px",
              marginTop: "12px",
            }}
          >
            {t.changeIdentity}
          </button>
        </section>

        <Navigation />
      </main>
    );
  }

  // CHAT GENERALE
  return (
    <main style={appStyle}>
      {languageSelector}

      <header
        style={{
          padding: "4px 18px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "27px",
              fontWeight: "900",
              color: "#d98cff",
              textShadow: "0 0 14px #8d38c8",
            }}
          >
            WHO
          </div>
          <small style={{ opacity: 0.65 }}>{t.generalRoom}</small>
        </div>

        <div
          style={{
            color: "#5ce89e",
            fontSize: "12px",
          }}
        >
          ● ONLINE
        </div>
      </header>

      <section style={{ padding: "0 18px 14px" }}>
        <div
          style={{
            color: "#ce7aff",
            letterSpacing: "2px",
            fontSize: "11px",
          }}
        >
          {t.publicChat}
        </div>

        <h1 style={{ fontSize: "34px", margin: "5px 0 14px" }}>
          {t.general}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src={avatarImage(avatar)}
            alt={avatar}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <div>
            <strong>{nickname}</strong>
            <small
              style={{
                display: "block",
                color: "#ad75c8",
              }}
            >
              {avatar} · ✦ {points}
            </small>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 18px" }}>
        {messages.length === 0 && (
          <div style={{ ...cardStyle, padding: "17px" }}>
            <strong>{t.noMessages}</strong>
            <small style={{ display: "block", opacity: 0.6 }}>
              {t.firstMessage}
            </small>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...cardStyle,
              padding: "15px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "11px",
                alignItems: "flex-start",
              }}
            >
              <img
                src={avatarImage(msg.avatar)}
                alt={msg.avatar || "Avatar"}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{msg.nickname || "Anonimo"}</strong>

                <small
                  style={{
                    display: "block",
                    color: "#aa72c5",
                  }}
                >
                  {msg.avatar || "Shadow"}
                </small>

                <p
                  style={{
                    margin: "9px 0 11px",
                    overflowWrap: "anywhere",
                  }}
                >
                  {msg.content || msg.message || msg.text || ""}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "7px",
                    flexWrap: "wrap",
                  }}
                >
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
                      vota(msg.id, "dislikes", msg.dislikes)
                    }
                  >
                    👎 {msg.dislikes || 0}
                  </button>

                  <button type="button" onClick={segnala}>
                    🚩 {t.report}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            ...cardStyle,
            padding: "12px",
            display: "flex",
            gap: "8px",
          }}
        >
          <input
            type="text"
            value={testo}
            placeholder={t.write}
            onChange={(e) => setTesto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") inviaMessaggio();
            }}
            style={{
              flex: 1,
              minWidth: 0,
              background: "#0e0916",
              border: "1px solid #593074",
              borderRadius: "14px",
              padding: "13px",
              color: "white",
              outline: "none",
            }}
          />

          <button
            type="button"
            onClick={inviaMessaggio}
            style={{
              background: "#67248b",
              color: "white",
              border: "1px solid #a94bd3",
              borderRadius: "14px",
              padding: "0 14px",
              fontWeight: "800",
            }}
          >
            {t.send}
          </button>
        </div>
      </section>

      <Navigation />
    </main>
  );
}
