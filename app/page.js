"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

/* =========================================================
   WHO
   Main page
   ========================================================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

/* =========================
   AVATAR
   Il nome serve SOLO internamente.
   Nell'interfaccia pubblica mostriamo il nickname.
   ========================= */

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
].map((name) => ({
  name,
  image: `/${name.toLowerCase()}.png`,
}));

const ownerAvatar = {
  name: "UNKNOWN",
  image: "/file_000000005e3881f4b9b9109dab033a80.png",
};

/* =========================
   SHOP
   ========================= */

const shopItems = [
  {
    id: "void-crown",
    name: "VOID CROWN",
    rarity: "LEGENDARY",
    price: 1200,
    image: "/shop/void-crown.png",
    symbol: "♛",
  },
  {
    id: "phantom-mask",
    name: "PHANTOM MASK",
    rarity: "LEGENDARY",
    price: 1000,
    image: "/shop/phantom-mask.png",
    symbol: "◈",
  },
  {
    id: "neon-halo",
    name: "NEON HALO",
    rarity: "EPIC",
    price: 650,
    image: "/shop/neon-halo.png",
    symbol: "◯",
  },
  {
    id: "cyber-visor",
    name: "CYBER VISOR",
    rarity: "EPIC",
    price: 550,
    image: "/shop/cyber-visor.png",
    symbol: "⌁",
  },
  {
    id: "dark-wings",
    name: "DARK WINGS",
    rarity: "LIMITED",
    price: 1500,
    image: "/shop/dark-wings.png",
    symbol: "◆",
  },
  {
    id: "plasma-frame",
    name: "PLASMA FRAME",
    rarity: "RARE",
    price: 350,
    image: "/shop/plasma-frame.png",
    symbol: "◇",
  },
];

/* =========================
   TRADUZIONI
   ========================= */

const translations = {
  it: {
    slogan: "Nessun nome. Nessun giudizio. Solo WHO.",
    login: "ACCEDI",
    register: "CREA ACCOUNT",
    loginTitle: "Bentornato in WHO",
    registerTitle: "Crea il tuo account WHO",
    nickname: "Nickname",
    password: "Password",
    noAccount: "Non hai un account?",
    haveAccount: "Hai già un account?",
    identity: "LA TUA IDENTITÀ",
    who: "Chi vuoi essere?",
    avatar: "Scegli il tuo avatar",
    selected: "SELEZIONATO",
    choose: "SCEGLI",
    continue: "CONTINUA",
    chat: "Chat",
    rooms: "Stanze",
    shop: "Shop",
    profile: "Profilo",
    general: "Generale",
    publicChat: "CHAT PUBBLICA",
    write: "Scrivi un messaggio...",
    send: "INVIA",
    report: "Segnala",
    points: "WHO POINTS",
    createRoom: "CREA UNA STANZA",
    roomName: "Nome della stanza",
    roomTheme: "Tema / descrizione",
    public: "Pubblica",
    private: "Privata",
    create: "CREA",
    official: "STANZE WHO",
    community: "CREATE DALLA COMMUNITY",
    shopTitle: "WHO SHOP",
    collection: "Rendi unica la tua identità.",
    unlock: "SBLOCCA",
    owned: "POSSEDUTO",
    insufficient: "WHO Points insufficienti",
    level: "LIVELLO",
    reputation: "REPUTAZIONE",
    good: "IN REGOLA",
    inventory: "COLLEZIONE",
    change: "CAMBIA AVATAR",
    logout: "ESCI",
    noRooms: "Non hai ancora creato stanze.",
    creator: "CREATOR",
    members: "membri",
    emptyChat: "Ancora nessun messaggio. Rompi il silenzio.",
    reporting: "Segnalazione inviata alla moderazione.",
    identityHint: "Il tuo nickname sarà il tuo unico nome pubblico.",
    shopHint: "Sblocca oggetti esclusivi e costruisci il tuo stile WHO.",
    ownedItems: "Oggetti posseduti",
  },

  en: {
    slogan: "No names. No judgment. Just WHO.",
    login: "SIGN IN",
    register: "CREATE ACCOUNT",
    loginTitle: "Welcome back to WHO",
    registerTitle: "Create your WHO account",
    nickname: "Nickname",
    password: "Password",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    identity: "YOUR IDENTITY",
    who: "Who do you want to be?",
    avatar: "Choose your avatar",
    selected: "SELECTED",
    choose: "CHOOSE",
    continue: "CONTINUE",
    chat: "Chat",
    rooms: "Rooms",
    shop: "Shop",
    profile: "Profile",
    general: "General",
    publicChat: "PUBLIC CHAT",
    write: "Write a message...",
    send: "SEND",
    report: "Report",
    points: "WHO POINTS",
    createRoom: "CREATE A ROOM",
    roomName: "Room name",
    roomTheme: "Theme / description",
    public: "Public",
    private: "Private",
    create: "CREATE",
    official: "WHO ROOMS",
    community: "CREATED BY THE COMMUNITY",
    shopTitle: "WHO SHOP",
    collection: "Make your identity unique.",
    unlock: "UNLOCK",
    owned: "OWNED",
    insufficient: "Not enough WHO Points",
    level: "LEVEL",
    reputation: "REPUTATION",
    good: "GOOD STANDING",
    inventory: "COLLECTION",
    change: "CHANGE AVATAR",
    logout: "LOG OUT",
    noRooms: "You haven't created any rooms yet.",
    creator: "CREATOR",
    members: "members",
    emptyChat: "No messages yet. Break the silence.",
    reporting: "Report sent to moderation.",
    identityHint: "Your nickname will be your only public name.",
    shopHint: "Unlock exclusive items and build your WHO style.",
    ownedItems: "Owned items",
  },
};

/* =========================
   FUNZIONI UTILI
   ========================= */

function getAvatar(name) {
  if (name === ownerAvatar.name) return ownerAvatar.image;

  return (
    avatars.find((item) => item.name === name)?.image ||
    "/shadow.png"
  );
}

function cleanNickname(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);
}

function internalEmail(nickname) {
  return `${cleanNickname(nickname)}@account.who.local`;
}

/* =========================================================
   APP
   ========================================================= */

export default function Home() {
  const [loading, setLoading] = useState(true);

  const [session, setSession] = useState(null);

  const [authMode, setAuthMode] = useState("login");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  const [started, setStarted] = useState(false);
  const [page, setPage] = useState("chat");

  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("Shadow");

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [language, setLanguage] = useState("it");

  const [points, setPoints] = useState(500);
  const [owned, setOwned] = useState([]);

  const [rooms, setRooms] = useState([]);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomTheme, setRoomTheme] = useState("");
  const [roomPrivate, setRoomPrivate] = useState(false);

  const t = translations[language];

  /* =========================
     STILI
     ========================= */

  const background = {
    minHeight: "100vh",
    color: "#fff",
    background:
      "radial-gradient(circle at 50% -10%,#3c1064 0,#170921 35%,#08050d 72%,#050308 100%)",
    paddingBottom: session && started ? 105 : 25,
  };

  const card = {
    background:
      "linear-gradient(145deg,rgba(37,18,56,.97),rgba(12,8,20,.98))",
    border: "1px solid rgba(137,66,177,.45)",
    borderRadius: 22,
    color: "#fff",
    boxShadow: "0 12px 35px rgba(0,0,0,.32)",
  };

  const inputStyle = {
    boxSizing: "border-box",
    width: "100%",
    padding: 15,
    borderRadius: 15,
    border: "1px solid #55306c",
    background: "#0d0913",
    color: "#fff",
    outline: 0,
    fontSize: 16,
  };

  const primaryButton = {
    borderRadius: 16,
    border: "1px solid #b954e5",
    background:
      "linear-gradient(135deg,#7825a4,#4d1d75)",
    color: "#fff",
    fontWeight: 900,
    boxShadow: "0 8px 24px rgba(109,36,151,.25)",
  };

  /* =========================
     CARICAMENTO DATI LOCALI
     + SESSIONE
     ========================= */

  useEffect(() => {
    const savedLanguage = localStorage.getItem("who-language");

    if (savedLanguage === "it" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    const savedAvatar = localStorage.getItem("who-avatar");

    if (savedAvatar) {
      setAvatar(savedAvatar);
    }

    const savedPoints = localStorage.getItem("who-points");

    if (savedPoints !== null) {
      const n = Number(savedPoints);

      if (Number.isFinite(n) && n >= 0) {
        setPoints(n);
      }
    }

    const savedOwned = localStorage.getItem("who-owned");

    if (savedOwned) {
      try {
        const parsed = JSON.parse(savedOwned);

        if (Array.isArray(parsed)) {
          setOwned(parsed);
        }
      } catch {}
    }

    const savedRooms = localStorage.getItem("who-rooms");

    if (savedRooms) {
      try {
        const parsed = JSON.parse(savedRooms);

        if (Array.isArray(parsed)) {
          setRooms(parsed);
        }
      } catch {}
    }

    supabase.auth.getSession().then(({ data }) => {
      const currentSession = data?.session || null;

      setSession(currentSession);

      if (currentSession) {
        const savedName =
          currentSession.user?.user_metadata?.username ||
          currentSession.user?.email?.split("@")[0] ||
          "";

        setNickname(savedName);
        setStarted(true);
      }

      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);

        if (newSession) {
          const savedName =
            newSession.user?.user_metadata?.username ||
            newSession.user?.email?.split("@")[0] ||
            "";

          setNickname(savedName);
        }

        setLoading(false);
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session && started === true) {
      loadMessages();
    }
  }, [session, started]);

  /* =========================
     LINGUA
     ========================= */

  function changeLanguage(lang) {
    setLanguage(lang);
    localStorage.setItem("who-language", lang);
  }

  /* =========================
     ACCOUNT
     ========================= */

  async function registerAccount() {
    setAuthError("");

    const username = cleanNickname(nickname);

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      setAuthError(
        language === "it"
          ? "Nickname: da 3 a 20 caratteri. Usa lettere, numeri o _"
          : "Nickname: 3-20 characters. Use letters, numbers or _"
      );
      return;
    }

    if (password.length < 8) {
      setAuthError(
        language === "it"
          ? "La password deve avere almeno 8 caratteri."
          : "Password must contain at least 8 characters."
      );
      return;
    }

    setAuthBusy(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: internalEmail(username),
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      setNickname(username);
      setPassword("");

      if (data?.session) {
        setSession(data.session);
        setStarted("identity");
      } else {
        setAuthMode("login");

        setAuthError(
          language === "it"
            ? "Account creato. Ora accedi."
            : "Account created. Now sign in."
        );
      }
    } finally {
      setAuthBusy(false);
    }
  }

  async function loginAccount() {
    setAuthError("");

    const username = cleanNickname(nickname);

    if (!username || !password) {
      setAuthError(
        language === "it"
          ? "Inserisci nickname e password."
          : "Enter nickname and password."
      );
      return;
    }

    setAuthBusy(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: internalEmail(username),
          password,
        });

      if (error) {
        setAuthError(
          language === "it"
            ? "Nickname o password non corretti."
            : "Incorrect nickname or password."
        );
        return;
      }

      setSession(data.session);
      setNickname(username);
      setPassword("");
      setStarted(true);
      setPage("chat");
    } finally {
      setAuthBusy(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();

    setSession(null);
    setStarted(false);
    setPage("chat");
    setNickname("");
    setPassword("");
    setMessage("");
    setMessages([]);
  }

  /* =========================
     CHAT
     ========================= */

  async function loadMessages() {
    setMessagesLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room", "generale")
      .order("id", { ascending: true });

    if (!error) {
      setMessages(data || []);
    }

    setMessagesLoading(false);
  }

  async function sendMessage() {
    const cleanMessage = message.trim();

    if (!cleanMessage || sending) return;

    setSending(true);

    const { error } = await supabase
      .from("messages")
      .insert({
        room: "generale",
        nickname: nickname || "Anonimo",
        avatar,
        content: cleanMessage,
        likes: 0,
        dislikes: 0,
      });

    if (error) {
      alert(error.message);
      setSending(false);
      return;
    }

    setMessage("");
    await loadMessages();

    setSending(false);
  }

  async function vote(id, type, current) {
    const value = Number(current || 0) + 1;

    const { error } = await supabase
      .from("messages")
      .update({
        [type]: value,
      })
      .eq("id", id);

    if (error) return;

    setMessages((old) =>
      old.map((item) =>
        item.id === id
          ? {
              ...item,
              [type]: value,
            }
          : item
      )
    );
  }

  function reportMessage() {
    alert(t.reporting);
  }

  /* =========================
     STANZE
     ========================= */

  function createRoom() {
    const cleanName = roomName.trim();

    if (!cleanName) return;

    const newRoom = {
      id: Date.now(),
      name: cleanName.slice(0, 30),
      theme: roomTheme.trim().slice(0, 100),
      private: roomPrivate,
      creator: nickname,
      members: 1,
    };

    const updated = [newRoom, ...rooms];

    setRooms(updated);

    localStorage.setItem(
      "who-rooms",
      JSON.stringify(updated)
    );

    setRoomName("");
    setRoomTheme("");
    setRoomPrivate(false);
    setCreatingRoom(false);
  }

  /* =========================
     SHOP
     ========================= */

  function buy(item) {
    if (owned.includes(item.id)) return;

    if (points < item.price) {
      alert(t.insufficient);
      return;
    }

    const newPoints = points - item.price;
    const newOwned = [...owned, item.id];

    setPoints(newPoints);
    setOwned(newOwned);

    localStorage.setItem(
      "who-points",
      String(newPoints)
    );

    localStorage.setItem(
      "who-owned",
      JSON.stringify(newOwned)
    );
  }

  /* =========================
     AVATAR
     ========================= */

  function selectAvatar(name) {
    setAvatar(name);

    localStorage.setItem(
      "who-avatar",
      name
    );
  }

  /* =========================
     COMPONENTI
     ========================= */

  function Language() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 6,
          padding: "13px 17px",
        }}
      >
        {["it", "en"].map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            style={{
              background:
                language === lang
                  ? "#66258c"
                  : "#15101c",
              border: "1px solid #663a7b",
              borderRadius: 20,
              padding: "7px 11px",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {lang === "it"
              ? "🇮🇹 IT"
              : "🇬🇧 EN"}
          </button>
        ))}
      </div>
    );
  }

  function Logo() {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 74,
            lineHeight: 1,
            fontWeight: 950,
            letterSpacing: -6,
            background:
              "linear-gradient(90deg,#fff,#e993ff,#8c59ff,#5ee8ff)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            filter:
              "drop-shadow(0 0 20px #922eff)",
          }}
        >
          WHO
        </div>

        <div
          style={{
            fontSize: 10,
            letterSpacing: 7,
            color: "#ad75ca",
            marginTop: 8,
          }}
        >
          BE ANYONE
        </div>
      </div>
    );
  }

  function SafeAvatar({
    name,
    size = 50,
    border = false,
  }) {
    return (
      <img
        src={getAvatar(name)}
        alt=""
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = "/shadow.png";
        }}
        style={{
          width: size,
          height: size,
          objectFit: "cover",
          borderRadius: "50%",
          flexShrink: 0,
          border: border
            ? "3px solid #c75af1"
            : "1px solid #5b3470",
          boxShadow: border
            ? "0 0 24px rgba(178,69,221,.4)"
            : "none",
        }}
      />
    );
  }

  function Nav() {
    const nav = [
      ["chat", "◌", t.chat],
      ["rooms", "◎", t.rooms],
      ["shop", "◇", t.shop],
      ["profile", "◉", t.profile],
    ];

    return (
      <nav
        style={{
          position: "fixed",
          zIndex: 100,
          bottom: 0,
          left: 0,
          right: 0,
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          background: "rgba(7,4,12,.96)",
          borderTop:
            "1px solid rgba(116,53,151,.55)",
          padding: "9px 4px 13px",
          backdropFilter: "blur(18px)",
        }}
      >
        {nav.map(([id, icon, label]) => {
          const active = page === id;

          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                background: active
                  ? "linear-gradient(180deg,rgba(115,38,155,.25),transparent)"
                  : "transparent",
                border: 0,
                borderRadius: 14,
                color: active
                  ? "#e69cff"
                  : "#817589",
                fontSize: 11,
                fontWeight: 800,
                padding: "5px 2px",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: 23,
                  marginBottom: 3,
                  textShadow: active
                    ? "0 0 12px #b34ee1"
                    : "none",
                }}
              >
                {icon}
              </span>

              {label}
            </button>
          );
        })}
      </nav>
    );
  }

  /* =========================
     LOADING
     ========================= */

  if (loading) {
    return (
      <main
        style={{
          ...background,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Logo />
      </main>
    );
  }

  /* =========================================================
     LOGIN / REGISTRAZIONE
     ========================================================= */

  if (!session) {
    return (
      <main style={background}>
        <Language />

        <section
          style={{
            minHeight: "82vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 22,
            maxWidth: 430,
            margin: "0 auto",
          }}
        >
          <Logo />

          <p
            style={{
              opacity: 0.72,
              textAlign: "center",
              marginTop: 25,
            }}
          >
            {t.slogan}
          </p>

          <div
            style={{
              ...card,
              padding: 20,
              marginTop: 15,
            }}
          >
            <small
              style={{
                color: "#d285f6",
                letterSpacing: 2,
              }}
            >
              WHO ACCOUNT
            </small>

            <h2>
              {authMode === "login"
                ? t.loginTitle
                : t.registerTitle}
            </h2>

            <input
              value={nickname}
              onChange={(e) =>
                setNickname(
                  cleanNickname(e.target.value)
                )
              }
              placeholder={t.nickname}
              autoCapitalize="none"
              autoCorrect="off"
              maxLength={20}
              style={inputStyle}
            />

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder={`${t.password} · min. 8`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  authMode === "login"
                    ? loginAccount()
                    : registerAccount();
                }
              }}
              style={{
                ...inputStyle,
                marginTop: 10,
              }}
            />

            {authError && (
              <div
                style={{
                  marginTop: 12,
                  padding: 11,
                  borderRadius: 12,
                  background:
                    "rgba(150,35,70,.18)",
                  border: "1px solid #7d3150",
                  fontSize: 13,
                }}
              >
                {authError}
              </div>
            )}

            <button
              disabled={authBusy}
              onClick={
                authMode === "login"
                  ? loginAccount
                  : registerAccount
              }
              style={{
                ...primaryButton,
                width: "100%",
                padding: 16,
                marginTop: 16,
                opacity: authBusy ? 0.6 : 1,
              }}
            >
              {authBusy
                ? "..."
                : authMode === "login"
                ? t.login
                : t.register}
            </button>

            <button
              onClick={() => {
                setAuthError("");
                setPassword("");

                setAuthMode(
                  authMode === "login"
                    ? "register"
                    : "login"
                );
              }}
              style={{
                width: "100%",
                marginTop: 14,
                background: "transparent",
                border: 0,
                color: "#d58cf5",
              }}
            >
              {authMode === "login"
                ? `${t.noAccount} ${t.register}`
                : `${t.haveAccount} ${t.login}`}
            </button>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     SCELTA AVATAR
     ========================================================= */

  if (started === "identity") {
    const availableAvatars =
      nickname.toLowerCase() === "unknown"
        ? [ownerAvatar, ...avatars]
        : avatars;

    return (
      <main style={background}>
        <Language />

        <section
          style={{
            padding: "5px 18px 20px",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <small
            style={{
              color: "#d285f6",
              letterSpacing: 3,
            }}
          >
            {t.identity}
          </small>

          <h1
            style={{
              fontSize: 34,
              marginBottom: 5,
            }}
          >
            {t.who}
          </h1>

          <p
            style={{
              opacity: 0.6,
              marginTop: 0,
            }}
          >
            {t.identityHint}
          </p>

          <h3>{t.avatar}</h3>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2,minmax(0,1fr))",
            gap: 12,
            padding: "0 18px",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          {availableAvatars.map((item) => {
            const selected =
              avatar === item.name;

            return (
              <button
                key={item.name}
                onClick={() =>
                  selectAvatar(item.name)
                }
                aria-label={`Avatar ${item.name}`}
                style={{
                  ...card,
                  padding: "16px 7px",
                  border: selected
                    ? "2px solid #d168ff"
                    : card.border,
                  boxShadow: selected
                    ? "0 0 24px rgba(196,79,239,.25)"
                    : card.boxShadow,
                }}
              >
                <img
                  src={item.image}
                  alt={`Avatar ${item.name}`}
                  onError={(event) => {
                    event.currentTarget.onerror =
                      null;

                    event.currentTarget.src =
                      "/shadow.png";
                  }}
                  style={{
                    width: 105,
                    height: 105,
                    maxWidth: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: selected
                      ? "3px solid #d86cff"
                      : "2px solid #5b3470",
                  }}
                />

                {/* Il nome tecnico dell'avatar
                    NON viene mostrato all'utente */}

                <small
                  style={{
                    display: "block",
                    marginTop: 10,
                    color: selected
                      ? "#e39aff"
                      : "#887c91",
                    fontWeight: 800,
                  }}
                >
                  {selected
                    ? `✓ ${t.selected}`
                    : t.choose}
                </small>
              </button>
            );
          })}
        </section>

        <div
          style={{
            padding: 18,
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <button
            onClick={() => {
              localStorage.setItem(
                "who-avatar",
                avatar
              );

              setStarted(true);
              setPage("chat");
            }}
            style={{
              ...primaryButton,
              width: "100%",
              padding: 18,
            }}
          >
            {t.continue} →
          </button>
        </div>
      </main>
    );
  }

  /* =========================================================
     STANZE
     ========================================================= */

  if (page === "rooms") {
    const officialRooms = [
      ["WHO GENERAL", "◎", "LIVE"],
      ["NIGHT WHO", "☾", "LIVE"],
      ["GAMING", "◇", "LIVE"],
      ["MUSIC", "♫", "LIVE"],
      ["MEET PEOPLE", "✦", "LIVE"],
    ];

    return (
      <main style={background}>
        <Language />

        <section
          style={{
            padding: "0 18px",
            maxWidth: 650,
            margin: "0 auto",
          }}
        >
          <small
            style={{
              color: "#d486fa",
              letterSpacing: 3,
            }}
          >
            {t.official}
          </small>

          <h1
            style={{
              fontSize: 36,
              margin: "7px 0 18px",
            }}
          >
            {t.rooms}
          </h1>

          <button
            onClick={() =>
              setCreatingRoom(
                !creatingRoom
              )
            }
            style={{
              ...primaryButton,
              width: "100%",
              padding: 17,
              marginBottom: 18,
            }}
          >
            ＋ {t.createRoom}
          </button>

          {creatingRoom && (
            <div
              style={{
                ...card,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <input
                value={roomName}
                maxLength={30}
                onChange={(e) =>
                  setRoomName(
                    e.target.value
                  )
                }
                placeholder={t.roomName}
                style={inputStyle}
              />

              <input
                value={roomTheme}
                maxLength={100}
                onChange={(e) =>
                  setRoomTheme(
                    e.target.value
                  )
                }
                placeholder={t.roomTheme}
                style={{
                  ...inputStyle,
                  marginTop: 9,
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <button
                  onClick={() =>
                    setRoomPrivate(
                      !roomPrivate
                    )
                  }
                  style={{
                    flex: 1,
                    background: "#21142c",
                    border:
                      "1px solid #583370",
                    color: "#fff",
                    borderRadius: 13,
                    padding: "11px 10px",
                  }}
                >
                  {roomPrivate
                    ? `🔒 ${t.private}`
                    : `◎ ${t.public}`}
                </button>

                <button
                  onClick={createRoom}
                  style={{
                    ...primaryButton,
                    flex: 1,
                    padding: "11px 10px",
                  }}
                >
                  {t.create}
                </button>
              </div>
            </div>
          )}

          {officialRooms.map(
            ([name, icon, status]) => (
              <div
                key={name}
                style={{
                  ...card,
                  padding: 17,
                  marginBottom: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 16,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 25,
                    background:
                      "linear-gradient(145deg,#35164c,#1a0c26)",
                    border:
                      "1px solid #5e3275",
                  }}
                >
                  {icon}
                </div>

                <div style={{ flex: 1 }}>
                  <strong>{name}</strong>

                  <small
                    style={{
                      display: "block",
                      color: "#50e99c",
                      marginTop: 4,
                    }}
                  >
                    ● {status}
                  </small>
                </div>

                <span
                  style={{
                    color: "#cf7aff",
                    fontSize: 20,
                  }}
                >
                  ›
                </span>
              </div>
            )
          )}

          <h3 style={{ marginTop: 28 }}>
            {t.community}
          </h3>

          {rooms.length === 0 && (
            <div
              style={{
                ...card,
                padding: 18,
                opacity: 0.7,
              }}
            >
              {t.noRooms}
            </div>
          )}

          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                ...card,
                padding: 17,
                marginBottom: 11,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 10,
                }}
              >
                <strong>
                  {room.private
                    ? "🔒 "
                    : "◎ "}
                  {room.name}
                </strong>

                <small
                  style={{
                    color: "#d181f5",
                  }}
                >
                  {t.creator}
                </small>
              </div>

              <p
                style={{
                  opacity: 0.65,
                  fontSize: 13,
                }}
              >
                {room.theme ||
                  "WHO Community"}
              </p>

              <small
                style={{
                  opacity: 0.7,
                }}
              >
                {room.creator} ·{" "}
                {room.members} {t.members}
              </small>
            </div>
          ))}
        </section>

        <Nav />
      </main>
    );
  }

  /* =========================================================
     SHOP
     ========================================================= */

  if (page === "shop") {
    return (
      <main style={background}>
        <Language />

        <section
          style={{
            padding: "0 18px 15px",
            maxWidth: 650,
            margin: "0 auto",
          }}
        >
          <small
            style={{
              color: "#d687ff",
              letterSpacing: 3,
            }}
          >
            {t.shopTitle}
          </small>

          <h1
            style={{
              fontSize: 38,
              margin: "5px 0",
            }}
          >
            {t.shop}
          </h1>

          <p
            style={{
              opacity: 0.65,
            }}
          >
            {t.shopHint}
          </p>

          <div
            style={{
              ...card,
              padding: 17,
              marginTop: 17,
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <small
                style={{
                  color: "#cf83f5",
                }}
              >
                {t.points}
              </small>

              <div
                style={{
                  fontSize: 31,
                  fontWeight: 950,
                }}
              >
                ✦ {points}
              </div>
            </div>

            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background:
                  "radial-gradient(circle,#71308f,#281036)",
                border:
                  "1px solid #a44cc8",
                fontSize: 21,
              }}
            >
              ✦
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2,minmax(0,1fr))",
            gap: 12,
            padding: "0 18px 20px",
            maxWidth: 650,
            margin: "0 auto",
          }}
        >
          {shopItems.map((item) => {
            const isOwned =
              owned.includes(item.id);

            return (
              <div
                key={item.id}
                style={{
                  ...card,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: 165,
                    position: "relative",
                    display: "grid",
                    placeItems: "center",
                    overflow: "hidden",
                    background:
                      "radial-gradient(circle at 50% 45%,#55206f 0,#271033 45%,#100817 100%)",
                  }}
                >
                  {/* FALLBACK:
                      rimane visibile anche
                      se il PNG non esiste */}

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 64,
                      color: "#d996f5",
                      textShadow:
                        "0 0 30px #a53ed1",
                    }}
                  >
                    {item.symbol}
                  </div>

                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                    style={{
                      position: "relative",
                      zIndex: 2,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: 8,
                      boxSizing:
                        "border-box",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      zIndex: 3,
                      top: 8,
                      left: 8,
                      background:
                        "rgba(5,3,9,.82)",
                      border:
                        "1px solid #754095",
                      borderRadius: 10,
                      padding: "5px 7px",
                      fontSize: 9,
                      fontWeight: 900,
                      letterSpacing: 1,
                    }}
                  >
                    {item.rarity}
                  </div>

                  {isOwned && (
                    <div
                      style={{
                        position:
                          "absolute",
                        zIndex: 3,
                        top: 8,
                        right: 8,
                        width: 26,
                        height: 26,
                        display: "grid",
                        placeItems:
                          "center",
                        borderRadius:
                          "50%",
                        background:
                          "#4dba82",
                        color: "#07130d",
                        fontWeight: 950,
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>

                <div
                  style={{
                    padding: 12,
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      minHeight: 32,
                      fontSize: 13,
                      letterSpacing: 0.4,
                    }}
                  >
                    {item.name}
                  </strong>

                  <div
                    style={{
                      color: "#df94ff",
                      fontWeight: 900,
                      margin: "8px 0",
                    }}
                  >
                    ✦ {item.price}
                  </div>

                  <button
                    disabled={isOwned}
                    onClick={() =>
                      buy(item)
                    }
                    style={{
                      width: "100%",
                      padding: 11,
                      borderRadius: 12,
                      border:
                        "1px solid #784093",
                      background: isOwned
                        ? "#242027"
                        : "linear-gradient(135deg,#67228b,#43175e)",
                      color: isOwned
                        ? "#8f8494"
                        : "#fff",
                      fontWeight: 900,
                      fontSize: 11,
                    }}
                  >
                    {isOwned
                      ? `✓ ${t.owned}`
                      : t.unlock}
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <Nav />
      </main>
    );
  }

  /* =========================================================
     PROFILO
     ========================================================= */

  if (page === "profile") {
    const level = Math.max(
      1,
      Math.floor(points / 250) + 1
    );

    const ownedProducts =
      shopItems.filter((item) =>
        owned.includes(item.id)
      );

    return (
      <main style={background}>
        <Language />

        <section
          style={{
            textAlign: "center",
            padding: "5px 18px 20px",
          }}
        >
          <SafeAvatar
            name={avatar}
            size={135}
            border
          />

          {/* SOLO nickname.
              Nessun secondo nome avatar. */}

          <h1
            style={{
              marginBottom: 4,
              fontSize: 32,
            }}
          >
            @{nickname}
          </h1>

          <span
            style={{
              color: "#6de0ad",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1,
            }}
          >
            ● WHO MEMBER
          </span>
        </section>

        <section
          style={{
            padding: "0 18px",
            maxWidth: 650,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 11,
            }}
          >
            <div
              style={{
                ...card,
                padding: 17,
              }}
            >
              <small
                style={{
                  opacity: 0.6,
                }}
              >
                {t.points}
              </small>

              <div
                style={{
                  fontSize: 27,
                  fontWeight: 900,
                  marginTop: 4,
                }}
              >
                ✦ {points}
              </div>
            </div>

            <div
              style={{
                ...card,
                padding: 17,
              }}
            >
              <small
                style={{
                  opacity: 0.6,
                }}
              >
                {t.level}
              </small>

              <div
                style={{
                  fontSize: 27,
                  fontWeight: 900,
                  marginTop: 4,
                }}
              >
                {level}
              </div>
            </div>
          </div>

          <div
            style={{
              ...card,
              padding: 17,
              marginTop: 11,
            }}
          >
            <small
              style={{
                opacity: 0.6,
              }}
            >
              {t.reputation}
            </small>

            <h3
              style={{
                color: "#5ce5a1",
                marginBottom: 3,
              }}
            >
              ✓ {t.good}
            </h3>

            <p
              style={{
                opacity: 0.6,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {language === "it"
                ? "Le segnalazioni vengono controllate dalla moderazione prima di eventuali penalità."
                : "Reports are reviewed by moderation before any penalties are applied."}
            </p>
          </div>

          <div
            style={{
              ...card,
              padding: 17,
              marginTop: 11,
            }}
          >
            <small
              style={{
                opacity: 0.6,
              }}
            >
              {t.inventory}
            </small>

            <h2
              style={{
                marginBottom: 4,
              }}
            >
              {owned.length}
            </h2>

            <span
              style={{
                opacity: 0.6,
                fontSize: 13,
              }}
            >
              {t.ownedItems}
            </span>

            {ownedProducts.length >
              0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 7,
                  marginTop: 13,
                }}
              >
                {ownedProducts.map(
                  (item) => (
                    <span
                      key={item.id}
                      style={{
                        padding:
                          "7px 10px",
                        borderRadius: 20,
                        background:
                          "#281335",
                        border:
                          "1px solid #603476",
                        fontSize: 10,
                        fontWeight: 800,
                      }}
                    >
                      {item.symbol}{" "}
                      {item.name}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          <button
            onClick={() =>
              setStarted("identity")
            }
            style={{
              ...card,
              width: "100%",
              padding: 17,
              marginTop: 11,
              fontWeight: 900,
            }}
          >
            ◉ {t.change}
          </button>

          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: 17,
              marginTop: 11,
              borderRadius: 20,
              border:
                "1px solid #74354e",
              background: "#29121c",
              color: "#ff9db6",
              fontWeight: 900,
            }}
          >
            {t.logout}
          </button>
        </section>

        <Nav />
      </main>
    );
  }

  /* =========================================================
     CHAT
     ========================================================= */

  return (
    <main style={background}>
      <Language />

      <div
        style={{
          maxWidth: 650,
          margin: "0 auto",
        }}
      >
        <header
          style={{
            padding: "0 18px 15px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong
              style={{
                display: "block",
                fontSize: 28,
                color: "#dc8dff",
                textShadow:
                  "0 0 13px #7927a5",
              }}
            >
              WHO
            </strong>

            <small
              style={{
                opacity: 0.55,
                letterSpacing: 1,
              }}
            >
              GENERAL ROOM
            </small>
          </div>

          <small
            style={{
              color: "#52e69c",
              background:
                "rgba(55,190,126,.08)",
              border:
                "1px solid rgba(82,230,156,.22)",
              borderRadius: 20,
              padding: "7px 10px",
            }}
          >
            ● ONLINE
          </small>
        </header>

        <section
          style={{
            padding: "0 18px 14px",
          }}
        >
          <small
            style={{
              color: "#cd7af3",
              letterSpacing: 2,
            }}
          >
            {t.publicChat}
          </small>

          <h1
            style={{
              fontSize: 35,
              margin: "5px 0 15px",
            }}
          >
            {t.general}
          </h1>

          <div
            style={{
              ...card,
              padding: 12,
              display: "flex",
              gap: 11,
              alignItems: "center",
            }}
          >
            <SafeAvatar
              name={avatar}
              size={52}
            />

            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              {/* QUI ORA APPARE SOLO
                  IL NICKNAME */}

              <strong
                style={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow:
                    "ellipsis",
                }}
              >
                @{nickname}
              </strong>

              <small
                style={{
                  display: "block",
                  color: "#bd82d4",
                  marginTop: 3,
                }}
              >
                ✦ {points} WHO Points
              </small>
            </div>

            <span
              style={{
                color: "#58dfa0",
                fontSize: 11,
              }}
            >
              ●
            </span>
          </div>
        </section>

        <section
          style={{
            padding: "0 18px",
          }}
        >
          {messagesLoading &&
            messages.length === 0 && (
              <div
                style={{
                  ...card,
                  padding: 20,
                  marginBottom: 11,
                  textAlign: "center",
                  opacity: 0.65,
                }}
              >
                •••
              </div>
            )}

          {!messagesLoading &&
            messages.length === 0 && (
              <div
                style={{
                  ...card,
                  padding: 20,
                  marginBottom: 11,
                  textAlign: "center",
                  opacity: 0.6,
                  fontSize: 13,
                }}
              >
                {t.emptyChat}
              </div>
            )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...card,
                padding: 15,
                marginBottom: 11,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 11,
                  alignItems:
                    "flex-start",
                }}
              >
                <SafeAvatar
                  name={
                    msg.avatar ||
                    "Shadow"
                  }
                  size={48}
                />

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {/* NICKNAME = UNICO NOME
                      PUBBLICO */}

                  <strong
                    style={{
                      color: "#f4e8fa",
                      fontSize: 14,
                    }}
                  >
                    @
                    {msg.nickname ||
                      "anonimo"}
                  </strong>

                  {/* NIENTE Shadow/Luna/
                      Pixie sotto al nickname */}

                  <p
                    style={{
                      overflowWrap:
                        "anywhere",
                      lineHeight: 1.45,
                      margin:
                        "8px 0 12px",
                      color: "#eee8f1",
                    }}
                  >
                    {msg.content ||
                      msg.message ||
                      msg.text}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: 7,
                      flexWrap: "wrap",
                      alignItems:
                        "center",
                    }}
                  >
                    <button
                      onClick={() =>
                        vote(
                          msg.id,
                          "likes",
                          msg.likes
                        )
                      }
                      aria-label="Like"
                      style={{
                        border:
                          "1px solid #4d3a5b",
                        background:
                          "#151019",
                        color: "#c9bdcf",
                        borderRadius: 20,
                        padding:
                          "7px 11px",
                        fontWeight: 800,
                      }}
                    >
                      ♡{" "}
                      {Number(
                        msg.likes || 0
                      )}
                    </button>

                    <button
                      onClick={() =>
                        vote(
                          msg.id,
                          "dislikes",
                          msg.dislikes
                        )
                      }
                      aria-label="Dislike"
                      style={{
                        border:
                          "1px solid #4d3a5b",
                        background:
                          "#151019",
                        color: "#c9bdcf",
                        borderRadius: 20,
                        padding:
                          "7px 11px",
                        fontWeight: 800,
                      }}
                    >
                      ⌄{" "}
                      {Number(
                        msg.dislikes || 0
                      )}
                    </button>

                    <button
                      onClick={
                        reportMessage
                      }
                      aria-label={t.report}
                      style={{
                        marginLeft:
                          "auto",
                        border: 0,
                        background:
                          "transparent",
                        color: "#8e7e96",
                        borderRadius: 20,
                        padding:
                          "7px 5px",
                        fontSize: 11,
                      }}
                    >
                      ◇ {t.report}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div
            style={{
              ...card,
              padding: 10,
              display: "flex",
              gap: 8,
              position: "sticky",
              bottom: 83,
              zIndex: 20,
              backdropFilter:
                "blur(15px)",
            }}
          >
            <input
              value={message}
              maxLength={500}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={t.write}
              style={{
                flex: 1,
                minWidth: 0,
                background: "#0d0913",
                border:
                  "1px solid #533069",
                borderRadius: 14,
                color: "#fff",
                padding: 13,
                outline: 0,
                fontSize: 15,
              }}
            />

            <button
              disabled={
                sending ||
                !message.trim()
              }
              onClick={sendMessage}
              style={{
                ...primaryButton,
                padding: "0 15px",
                opacity:
                  sending ||
                  !message.trim()
                    ? 0.45
                    : 1,
              }}
            >
              {sending ? "…" : "➤"}
            </button>
          </div>
        </section>
      </div>

      <Nav />
    </main>
  );
}
