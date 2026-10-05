"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const avatars = [
  "Shadow","Pixie","King","Azra","Zero","Luna",
  "Ranger","Neon","Ares","Vix","Nova","Ghost"
].map((name) => ({
  name,
  image: `/${name.toLowerCase()}.png`
}));

const shopItems = [
  { id:"void-crown", name:"VOID CROWN", rarity:"LEGENDARY", price:1200, image:"/shop/void-crown.png" },
  { id:"phantom-mask", name:"PHANTOM MASK", rarity:"LEGENDARY", price:1000, image:"/shop/phantom-mask.png" },
  { id:"neon-halo", name:"NEON HALO", rarity:"EPIC", price:650, image:"/shop/neon-halo.png" },
  { id:"cyber-visor", name:"CYBER VISOR", rarity:"EPIC", price:550, image:"/shop/cyber-visor.png" },
  { id:"dark-wings", name:"DARK WINGS", rarity:"LIMITED", price:1500, image:"/shop/dark-wings.png" },
  { id:"plasma-frame", name:"PLASMA FRAME", rarity:"RARE", price:350, image:"/shop/plasma-frame.png" }
];

const translations = {
  it: {
    enter:"ENTRA IN WHO",
    slogan:"Nessun nome. Nessun giudizio. Solo WHO.",
    login:"ACCEDI",
    register:"CREA ACCOUNT",
    nickname:"Nickname",
    password:"Password",
    passwordHint:"Minimo 8 caratteri",
    loginTitle:"Bentornato in WHO",
    registerTitle:"Crea la tua identità",
    noAccount:"Non hai un account?",
    haveAccount:"Hai già un account?",
    logout:"ESCI DALL'ACCOUNT",
    identity:"LA TUA IDENTITÀ",
    who:"Chi vuoi essere?",
    nick:"Scegli un nickname...",
    avatar:"Scegli il tuo avatar",
    selected:"SELEZIONATO",
    choose:"SCEGLI",
    continue:"CONTINUA",
    chat:"Chat",
    rooms:"Stanze",
    shop:"Shop",
    profile:"Profilo",
    general:"Generale",
    publicChat:"CHAT PUBBLICA",
    write:"Scrivi un messaggio...",
    send:"INVIA",
    report:"Segnala",
    points:"WHO POINTS",
    createRoom:"CREA UNA STANZA",
    roomName:"Nome della stanza",
    roomTheme:"Tema / descrizione",
    public:"Pubblica",
    private:"Privata",
    create:"CREA",
    official:"STANZE WHO",
    community:"CREATE DALLA COMMUNITY",
    shopTitle:"WHO SHOP",
    collection:"Costruisci la tua identità.",
    unlock:"SBLOCCA",
    owned:"POSSEDUTO",
    insufficient:"WHO Points insufficienti",
    level:"LIVELLO",
    reputation:"REPUTAZIONE",
    good:"IN REGOLA",
    inventory:"COLLEZIONE",
    change:"CAMBIA AVATAR",
    noRooms:"Non hai ancora creato stanze.",
    creator:"CREATOR",
    members:"membri"
  },

  en: {
    enter:"ENTER WHO",
    slogan:"No names. No judgment. Just WHO.",
    login:"SIGN IN",
    register:"CREATE ACCOUNT",
    nickname:"Nickname",
    password:"Password",
    passwordHint:"Minimum 8 characters",
    loginTitle:"Welcome back to WHO",
    registerTitle:"Create your identity",
    noAccount:"Don't have an account?",
    haveAccount:"Already have an account?",
    logout:"LOG OUT",
    identity:"YOUR IDENTITY",
    who:"Who do you want to be?",
    nick:"Choose a nickname...",
    avatar:"Choose your avatar",
    selected:"SELECTED",
    choose:"CHOOSE",
    continue:"CONTINUE",
    chat:"Chat",
    rooms:"Rooms",
    shop:"Shop",
    profile:"Profile",
    general:"General",
    publicChat:"PUBLIC CHAT",
    write:"Write a message...",
    send:"SEND",
    report:"Report",
    points:"WHO POINTS",
    createRoom:"CREATE A ROOM",
    roomName:"Room name",
    roomTheme:"Theme / description",
    public:"Public",
    private:"Private",
    create:"CREATE",
    official:"WHO ROOMS",
    community:"CREATED BY THE COMMUNITY",
    shopTitle:"WHO SHOP",
    collection:"Build your identity.",
    unlock:"UNLOCK",
    owned:"OWNED",
    insufficient:"Not enough WHO Points",
    level:"LEVEL",
    reputation:"REPUTATION",
    good:"GOOD STANDING",
    inventory:"COLLECTION",
    change:"CHANGE AVATAR",
    noRooms:"You haven't created any rooms yet.",
    creator:"CREATOR",
    members:"members"
  }
};

function getAvatar(name) {
  return avatars.find((a) => a.name === name)?.image || "/shadow.png";
}

function normalizeUsername(value) {
  return value.trim().toLowerCase();
}

/*
  Supabase Auth richiede un identificatore email per il provider email/password.
  L'utente non vede né deve inserire questa email tecnica.
*/
function authEmail(username) {
  return `${normalizeUsername(username)}@account.who.local`;
}

export default function Home() {
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [session, setSession] = useState(null);
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  const [started, setStarted] = useState(false);
  const [page, setPage] = useState("chat");

  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("Shadow");

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [language, setLanguage] = useState("it");

  const [points, setPoints] = useState(500);
  const [owned, setOwned] = useState([]);

  const [rooms, setRooms] = useState([]);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomTheme, setRoomTheme] = useState("");
  const [roomPrivate, setRoomPrivate] = useState(false);

  const t = translations[language];

  useEffect(() => {
    const savedLanguage = localStorage.getItem("who-language");

    if (savedLanguage === "it" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    const savedRooms = localStorage.getItem("who-rooms");

    if (savedRooms) {
      try {
        setRooms(JSON.parse(savedRooms));
      } catch {}
    }

    const savedAvatar = localStorage.getItem("who-avatar");

    if (savedAvatar) {
      setAvatar(savedAvatar);
    }

    const savedPoints = Number(localStorage.getItem("who-points"));

    if (Number.isFinite(savedPoints) && savedPoints >= 0) {
      setPoints(savedPoints);
    }

    const savedOwned = localStorage.getItem("who-owned");

    if (savedOwned) {
      try {
        setOwned(JSON.parse(savedOwned));
      } catch {}
    }

    supabase.auth.getSession().then(({ data }) => {
      const currentSession = data?.session || null;

      setSession(currentSession);

      if (currentSession) {
        const username =
          currentSession.user?.user_metadata?.username ||
          currentSession.user?.email?.split("@")[0] ||
          "";

        setNickname(username);
        setStarted(true);
      }

      setAuthLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);

      if (newSession) {
        const username =
          newSession.user?.user_metadata?.username ||
          newSession.user?.email?.split("@")[0] ||
          "";

        setNickname(username);
        setStarted(true);
      } else {
        setStarted(false);
        setPage("chat");
      }

      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      loadMessages();
    }
  }, [session]);

  function changeLanguage(lang) {
    setLanguage(lang);
    localStorage.setItem("who-language", lang);
  }

  async function registerAccount() {
    setAuthError("");

    const username = normalizeUsername(nickname);

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      setAuthError(
        language === "it"
          ? "Il nickname deve avere 3-20 caratteri: lettere, numeri o _."
          : "Nickname must be 3-20 characters: letters, numbers or _."
      );
      return;
    }

    if (authPassword.length < 8) {
      setAuthError(
        language === "it"
          ? "La password deve contenere almeno 8 caratteri."
          : "Password must contain at least 8 characters."
      );
      return;
    }

    setAuthBusy(true);

    const { data, error } = await supabase.auth.signUp({
      email: authEmail(username),
      password: authPassword,
      options: {
        data: {
          username
        }
      }
    });

    if (error) {
      setAuthError(error.message);
      setAuthBusy(false);
      return;
    }

    /*
      Creiamo/aggiorniamo il profilo solo usando le colonne
      che abbiamo verificato: id e username.
    */
    if (data?.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: data.user.id,
            username
          },
          {
            onConflict: "id"
          }
        );

      if (profileError) {
        console.error("WHO profile:", profileError.message);
      }
    }

    setNickname(username);
    setAuthPassword("");
    setAuthBusy(false);

    if (data?.session) {
      setSession(data.session);
      setStarted("identity");
    } else {
      setAuthError(
        language === "it"
          ? "Account creato. Ora prova ad accedere."
          : "Account created. Now sign in."
      );
      setAuthMode("login");
    }
  }

  async function loginAccount() {
    setAuthError("");

    const username = normalizeUsername(nickname);

    if (!username || !authPassword) {
      setAuthError(
        language === "it"
          ? "Inserisci nickname e password."
          : "Enter nickname and password."
      );
      return;
    }

    setAuthBusy(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail(username),
      password: authPassword
    });

    if (error) {
      setAuthError(
        language === "it"
          ? "Nickname o password non corretti."
          : "Incorrect nickname or password."
      );
      setAuthBusy(false);
      return;
    }

    setSession(data.session);
    setNickname(username);
    setAuthPassword("");
    setStarted(true);
    setPage("chat");
    setAuthBusy(false);
  }

  async function logout() {
    await supabase.auth.signOut();

    setSession(null);
    setStarted(false);
    setPage("chat");
    setNickname("");
    setAuthPassword("");
    setMessage("");
  }

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room", "generale")
      .order("id", { ascending: true });

    if (!error) {
      setMessages(data || []);
    }
  }

  async function sendMessage() {
    if (!message.trim() || !session) return;

    const { error } = await supabase
      .from("messages")
      .insert({
        room: "generale",
        nickname: nickname || "Anonimo",
        avatar,
        content: message.trim(),
        likes: 0,
        dislikes: 0
      });

    if (error) {
      alert(error.message);
      return;
    }

    setMessage("");
    loadMessages();
  }

  async function vote(id, type, current) {
    const value = (current || 0) + 1;

    const { error } = await supabase
      .from("messages")
      .update({ [type]: value })
      .eq("id", id);

    if (error) return;

    setMessages((old) =>
      old.map((m) =>
        m.id === id ? { ...m, [type]: value } : m
      )
    );
  }

  function createRoom() {
    if (!roomName.trim()) return;

    const newRoom = {
      id: Date.now(),
      name: roomName.trim(),
      theme: roomTheme.trim(),
      private: roomPrivate,
      creator: nickname,
      members: 1
    };

    const updated = [newRoom, ...rooms];

    setRooms(updated);
    localStorage.setItem("who-rooms", JSON.stringify(updated));

    setRoomName("");
    setRoomTheme("");
    setRoomPrivate(false);
    setCreatingRoom(false);
  }

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

    localStorage.setItem("who-points", String(newPoints));
    localStorage.setItem("who-owned", JSON.stringify(newOwned));
  }

  function selectAvatar(name) {
    setAvatar(name);
    localStorage.setItem("who-avatar", name);
  }

  const background = {
    minHeight: "100vh",
    color: "#fff",
    background:
      "radial-gradient(circle at 50% -10%,#38105f 0,#150921 35%,#07050c 75%)",
    paddingBottom: started === true ? 90 : 25
  };

  const card = {
    background:
      "linear-gradient(145deg,rgba(35,18,54,.96),rgba(12,8,20,.97))",
    border: "1px solid #542975",
    borderRadius: 22,
    color: "#fff",
    boxShadow: "0 12px 35px rgba(0,0,0,.3)"
  };

  const inputStyle = {
    boxSizing: "border-box",
    width: "100%",
    padding: 16,
    borderRadius: 16,
    border: "1px solid #55306c",
    background: "#0d0913",
    color: "#fff",
    outline: 0,
    fontSize: 16
  };

  function Language() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 6,
          padding: "13px 17px"
        }}
      >
        {["it", "en"].map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            style={{
              background: language === lang ? "#66258c" : "#15101c",
              border: "1px solid #663a7b",
              borderRadius: 20,
              padding: "7px 11px",
              color: "#fff"
            }}
          >
            {lang === "it" ? "🇮🇹 IT" : "🇬🇧 EN"}
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
            filter: "drop-shadow(0 0 20px #922eff)"
          }}
        >
          WHO
        </div>

        <div
          style={{
            fontSize: 10,
            letterSpacing: 7,
            color: "#ad75ca",
            marginTop: 8
          }}
        >
          BE ANYONE
        </div>
      </div>
    );
  }

  function Nav() {
    const nav = [
      ["chat", "💬", t.chat],
      ["rooms", "◉", t.rooms],
      ["shop", "◆", t.shop],
      ["profile", "●", t.profile]
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
          background: "rgba(7,4,12,.97)",
          borderTop: "1px solid #48245f",
          padding: "9px 4px 12px",
          backdropFilter: "blur(15px)"
        }}
      >
        {nav.map(([id, icon, label]) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            style={{
              background: "transparent",
              border: 0,
              color: page === id ? "#df91ff" : "#817589",
              fontSize: 11,
              fontWeight: 700
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: 21,
                marginBottom: 3
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

  /* LOADING */

  if (authLoading) {
    return (
      <main
        style={{
          ...background,
          display: "grid",
          placeItems: "center"
        }}
      >
        <Logo />
      </main>
    );
  }

  /* LOGIN / REGISTER */

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
            margin: "0 auto"
          }}
        >
          <Logo />

          <p
            style={{
              opacity: 0.72,
              textAlign: "center",
              marginTop: 24,
              marginBottom: 28
            }}
          >
            {t.slogan}
          </p>

          <div style={{ ...card, padding: 20 }}>
            <small
              style={{
                color: "#d285f6",
                letterSpacing: 2
              }}
            >
              WHO ACCOUNT
            </small>

            <h2 style={{ marginTop: 8 }}>
              {authMode === "login"
                ? t.loginTitle
                : t.registerTitle}
            </h2>

            <input
              value={nickname}
              onChange={(e) =>
                setNickname(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9_]/g, "")
                )
              }
              placeholder={t.nickname}
              maxLength={20}
              autoCapitalize="none"
              autoCorrect="off"
              style={inputStyle}
            />

            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder={t.password}
              minLength={8}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (authMode === "login") {
                    loginAccount();
                  } else {
                    registerAccount();
                  }
                }
              }}
              style={{
                ...inputStyle,
                marginTop: 10
              }}
            />

            <small
              style={{
                display: "block",
                opacity: 0.55,
                marginTop: 7
              }}
            >
              {t.passwordHint}
            </small>

            {authError && (
              <div
                style={{
                  marginTop: 12,
                  padding: 11,
                  borderRadius: 12,
                  background: "rgba(150,35,70,.18)",
                  border: "1px solid #7d3150",
                  fontSize: 13
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
                width: "100%",
                padding: 16,
                marginTop: 16,
                borderRadius: 16,
                border: "1px solid #d066ff",
                background:
                  "linear-gradient(90deg,#7725a6,#382065)",
                color: "#fff",
                fontWeight: 900,
                opacity: authBusy ? 0.6 : 1
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
                setAuthPassword("");
                setAuthMode(
                  authMode === "login"
                    ? "register"
                    : "login"
                );
              }}
              style={{
                width: "100%",
                background: "transparent",
                border: 0,
                color: "#cf88ed",
                marginTop: 15
              }}
            >
              {authMode === "login"
                ? `${t.noAccount} ${t.register}`
                : `${t.haveAccount} ${t.login}`}
            </button>
          </
