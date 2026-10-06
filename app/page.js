"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

/* =========================================================
   WHO — AVATARS
   ========================================================= */

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

/* =========================================================
   WHO SHOP — VERSIONE CORRETTA
   ========================================================= */

const fallbackShopItems = [
  {
    id: "royal-crown",
    name: "ROYAL CROWN",
    category: "COSMETIC",
    rarity: "LEGENDARY",
    points_price: 1200,
    image_url: "/shop/royal/crown.png",
    symbol: "♛",
  },
  {
    id: "void-mask",
    name: "VOID MASK",
    category: "COSMETIC",
    rarity: "LEGENDARY",
    points_price: 1000,
    image_url: "/shop/void-mask.png",
    symbol: "◈",
  },
  {
    id: "glitch-eyes",
    name: "GLITCH EYES",
    category: "COSMETIC",
    rarity: "EPIC",
    points_price: 750,
    image_url: "/shop/glitch-eyes.png",
    symbol: "◉",
  },
  {
    id: "dual-aura",
    name: "DUAL AURA",
    category: "COSMETIC",
    rarity: "EPIC",
    points_price: 850,
    image_url: "/shop/dual-aura.png",
    symbol: "◯",
  },
  {
    id: "neon-visor",
    name: "NEON VISOR",
    category: "COSMETIC",
    rarity: "EPIC",
    points_price: 650,
    image_url: "/shop/neon-visor.png",
    symbol: "⌁",
  },
  {
    id: "nexus-frame",
    name: "NEXUS FRAME",
    category: "COSMETIC",
    rarity: "LIMITED",
    points_price: 1500,
    image_url: "/shop/nexus-frame.png",
    symbol: "◇",
  },
];

const shopSymbols = {
  "royal-crown": "♛",
  "void-mask": "◈",
  "glitch-eyes": "◉",
  "dual-aura": "◯",
  "neon-visor": "⌁",
  "nexus-frame": "◇",
};

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
    unlock: "SBLOCCA",
    owned: "POSSEDUTO",
    insufficient: "WHO Points insufficienti",
    level: "LIVELLO",
    reputation: "REPUTAZIONE",
    good: "IN REGOLA",
    inventory: "COLLEZIONE",
    change: "CAMBIA AVATAR",
    logout: "ESCI",
    noRooms: "Non ci sono ancora stanze community.",
    creator: "CREATOR",
    members: "membri",
    emptyChat: "Ancora nessun messaggio. Rompi il silenzio.",
    reporting: "Segnalazione inviata alla moderazione.",
    alreadyReported: "Hai già segnalato questo messaggio.",
    identityHint: "Il nickname è il tuo unico nome pubblico.",
    shopHint: "Sblocca oggetti esclusivi e costruisci il tuo stile WHO.",
    ownedItems: "Oggetti posseduti",
    founder: "FOUNDER",
    online: "ONLINE",
    report: "SEGNALA",
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
    unlock: "UNLOCK",
    owned: "OWNED",
    insufficient: "Not enough WHO Points",
    level: "LEVEL",
    reputation: "REPUTATION",
    good: "GOOD STANDING",
    inventory: "COLLECTION",
    change: "CHANGE AVATAR",
    logout: "LOG OUT",
    noRooms: "There are no community rooms yet.",
    creator: "CREATOR",
    members: "members",
    emptyChat: "No messages yet. Break the silence.",
    reporting: "Report sent to moderation.",
    alreadyReported: "You already reported this message.",
    identityHint: "Your nickname is your only public name.",
    shopHint: "Unlock exclusive items and build your WHO style.",
    ownedItems: "Owned items",
    founder: "FOUNDER",
    online: "ONLINE",
    report: "REPORT",
  },
};

function getAvatar(name) {
  if (name === "UNKNOWN") return ownerAvatar.image;

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

function getShopImage(item) {
  return item.image_url || `/shop/${item.id}.png`;
}

function getShopSymbol(item) {
  return item.symbol || shopSymbols[item.id] || "◇";
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

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

  const [myVotes, setMyVotes] = useState({});
  const [reportedMessages, setReportedMessages] = useState([]);

  const [language, setLanguage] = useState("it");

  const [points, setPoints] = useState(500);
  const [reputation, setReputation] = useState(100);

  const [shopItems, setShopItems] = useState(fallbackShopItems);
  const [owned, setOwned] = useState([]);

  const [rooms, setRooms] = useState([]);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomTheme, setRoomTheme] = useState("");
  const [roomPrivate, setRoomPrivate] = useState(false);

  const t = translations[language];

  const isFounder =
    profile?.role?.toUpperCase() === "FOUNDER";

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

  useEffect(() => {
    const savedLanguage = localStorage.getItem("who-language");

    if (savedLanguage === "it" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    async function initialize() {
      const { data } = await supabase.auth.getSession();
      const currentSession = data?.session || null;

      setSession(currentSession);

      if (currentSession) {
        await loadUserData(currentSession.user);
      }

      setLoading(false);
    }

    initialize();

    const { data } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);

        if (newSession) {
          await loadUserData(newSession.user);
        }

        setLoading(false);
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session || !started) return;

    loadMessages();
    loadRooms();
    loadShop();
    loadInventory();
    loadVotes();
    loadReports();

    const channel = supabase
      .channel("who-messages-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, started]);

  async function loadUserData(user) {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("PROFILE:", error);
      return;
    }

    if (data) {
      setProfile(data);
      setNickname(data.nickname || data.username || "");
      setAvatar(data.avatar || "Shadow");
      setPoints(Number(data.who_points ?? 500));
      setReputation(Number(data.reputation ?? 100));
      setStarted(true);
      return;
    }

    const username =
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      "who_user";

    const newProfile = {
      id: user.id,
      nickname: username,
      avatar: "Shadow",
    };

    const { data: created, error: createError } =
      await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single();

    if (createError) {
      console.error("CREATE PROFILE:", createError);
      return;
    }

    setProfile(created);
    setNickname(created.nickname);
    setAvatar(created.avatar || "Shadow");
    setPoints(Number(created.who_points ?? 500));
    setReputation(Number(created.reputation ?? 100));
    setStarted("identity");
  }

  async function refreshProfile() {
    if (!session?.user?.id) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
      setNickname(data.nickname || "");
      setAvatar(data.avatar || "Shadow");
      setPoints(Number(data.who_points ?? 500));
      setReputation(Number(data.reputation ?? 100));
    }
  }

  function changeLanguage(lang) {
    setLanguage(lang);
    localStorage.setItem("who-language", lang);
  }

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
        options: { data: { username } },
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      setNickname(username);
      setPassword("");

      if (data?.session) {
        setSession(data.session);
        await loadUserData(data.user);
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
      setPassword("");
      await loadUserData(data.user);
      setPage("chat");
    } finally {
      setAuthBusy(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();

    setSession(null);
    setProfile(null);
    setStarted(false);
    setPage("chat");
    setNickname("");
    setPassword("");
    setMessages([]);
    setOwned([]);
    setMyVotes({});
  }

  async function selectAvatar(name) {
    if (!session?.user?.id) return;
    if (name === "UNKNOWN" && !isFounder) return;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        avatar: name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setProfile(data);
    setAvatar(data.avatar);
  }

  async function loadMessages() {
    setMessagesLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room", "generale")
      .order("id", { ascending: true });

    if (!error) setMessages(data || []);

    setMessagesLoading(false);
  }

  async function sendMessage() {
    const cleanMessage = message.trim();

    if (!cleanMessage || sending || !session?.user?.id) return;

    setSending(true);

    const { error } = await supabase
      .from("messages")
      .insert({
        room: "generale",
        nickname: nickname || "Anonimo",
        avatar: avatar || "Shadow",
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

  async function loadVotes() {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from("message_votes")
      .select("message_id,vote")
      .eq("user_id", session.user.id);

    if (error) return;

    const map = {};

    (data || []).forEach((vote) => {
      map[vote.message_id] = Number(vote.vote);
    });

    setMyVotes(map);
  }

  async function vote(messageId, newVote) {
    if (!session?.user?.id) return;

    const previousVote = Number(myVotes[messageId] || 0);

    if (previousVote === newVote) {
      const { error } = await supabase
        .from("message_votes")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", session.user.id);

      if (error) {
        alert(error.message);
        return;
      }

      setMyVotes((old) => {
        const copy = { ...old };
        delete copy[messageId];
        return copy;
      });

      await syncMessageVoteCounts(messageId);
      return;
    }

    const { error } = await supabase
      .from("message_votes")
      .upsert(
        {
          message_id: messageId,
          user_id: session.user.id,
          vote: newVote,
        },
        { onConflict: "message_id,user_id" }
      );

    if (error) {
      alert(error.message);
      return;
    }

    setMyVotes((old) => ({
      ...old,
      [messageId]: newVote,
    }));

    await syncMessageVoteCounts(messageId);
  }

  async function syncMessageVoteCounts(messageId) {
    const { data, error } = await supabase
      .from("message_votes")
      .select("vote")
      .eq("message_id", messageId);

    if (error) return;

    const likes = (data || []).filter(
      (item) => Number(item.vote) === 1
    ).length;

    const dislikes = (data || []).filter(
      (item) => Number(item.vote) === -1
    ).length;

    await supabase
      .from("messages")
      .update({ likes, dislikes })
      .eq("id", messageId);

    setMessages((old) =>
      old.map((item) =>
        item.id === messageId
          ? { ...item, likes, dislikes }
          : item
      )
    );
  }

  async function loadReports() {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from("message_reports")
      .select("message_id")
      .eq("reporter_id", session.user.id);

    if (error) return;

    setReportedMessages(
      (data || []).map((item) => item.message_id)
    );
  }

  async function reportMessage(messageId) {
    if (!session?.user?.id) return;

    if (reportedMessages.includes(messageId)) {
      alert(t.alreadyReported);
      return;
    }

    const { error } = await supabase
      .from("message_reports")
      .insert({
        message_id: messageId,
        reporter_id: session.user.id,
        reason: "other",
        status: "pending",
      });

    if (error) {
      alert(error.message);
      return;
    }

    setReportedMessages((old) => [...old, messageId]);
    alert(t.reporting);
  }

  async function loadRooms() {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error) setRooms(data || []);
  }

  async function createRoom() {
    const cleanName = roomName.trim();

    if (!cleanName || !session?.user?.id) return;

    const { error } = await supabase
      .from("rooms")
      .insert({
        name: cleanName.slice(0, 30),
        description: roomTheme.trim().slice(0, 100),
        owner_id: session.user.id,
        is_private: roomPrivate,
        is_official: false,
        is_active: true,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setRoomName("");
    setRoomTheme("");
    setRoomPrivate(false);
    setCreatingRoom(false);
    await loadRooms();
  }

  /* SHOP CORRETTO:
     per ora utilizziamo i 6 prodotti definiti sopra,
     evitando che vecchi dati di shop_items rimettano
     prezzi a zero o nomi precedenti.
  */

  async function loadShop() {
    setShopItems(fallbackShopItems);
  }

  async function loadInventory() {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from("user_inventory")
      .select("item_id")
      .eq("user_id", session.user.id);

    if (error) return;

    setOwned((data || []).map((item) => item.item_id));
  }

  async function buy(item) {
    if (!session?.user?.id) return;
    if (owned.includes(item.id)) return;

    const price = Number(item.points_price ?? item.price ?? 0);

    if (points < price) {
      alert(t.insufficient);
      return;
    }

    const { error: inventoryError } = await supabase
      .from("user_inventory")
      .insert({
        user_id: session.user.id,
        item_id: item.id,
      });

    if (inventoryError) {
      alert(inventoryError.message);
      return;
    }

    const newPoints = points - price;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        who_points: newPoints,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)
      .select()
      .single();

    if (error) {
      await supabase
        .from("user_inventory")
        .delete()
        .eq("user_id", session.user.id)
        .eq("item_id", item.id);

      alert(error.message);
      return;
    }

    setPoints(Number(data.who_points));
    setProfile(data);
    setOwned((old) => [...old, item.id]);
  }
    /* =========================================================
     COMPONENTS
     ========================================================= */

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
              background: language === lang ? "#66258c" : "#15101c",
              border: "1px solid #663a7b",
              borderRadius: 20,
              padding: "7px 11px",
              color: "#fff",
              fontWeight: 700,
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
            filter: "drop-shadow(0 0 20px #922eff)",
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

  function SafeAvatar({ name, size = 50, border = false }) {
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
          borderTop: "1px solid rgba(116,53,151,.55)",
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
                color: active ? "#e69cff" : "#817589",
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
                  textShadow: active ? "0 0 12px #b34ee1" : "none",
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

  /* =========================================================
     LOADING
     ========================================================= */

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
     LOGIN
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
                setNickname(cleanNickname(e.target.value))
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
              onChange={(e) => setPassword(e.target.value)}
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
                  background: "rgba(150,35,70,.18)",
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
                  authMode === "login" ? "register" : "login"
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
     IDENTITY
     ========================================================= */

  if (started === "identity") {
    const availableAvatars = isFounder
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

          <h1 style={{ fontSize: 34 }}>{t.who}</h1>

          <p style={{ opacity: 0.6 }}>
            {t.identityHint}
          </p>

          <h3>{t.avatar}</h3>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            gap: 12,
            padding: "0 18px",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          {availableAvatars.map((item) => {
            const selected = avatar === item.name;

            return (
              <button
                key={item.name}
                onClick={() => selectAvatar(item.name)}
                style={{
                  ...card,
                  padding: "16px 7px",
                  border: selected
                    ? "2px solid #d168ff"
                    : card.border,
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/shadow.png";
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

                <small
                  style={{
                    display: "block",
                    marginTop: 10,
                    color: selected ? "#e39aff" : "#887c91",
                    fontWeight: 800,
                  }}
                >
                  {selected ? `✓ ${t.selected}` : t.choose}
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
     ROOMS
     ========================================================= */

  if (page === "rooms") {
    const officialRooms = rooms.filter(
      (room) => room.is_official
    );

    const communityRooms = rooms.filter(
      (room) => !room.is_official
    );

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

          <h1 style={{ fontSize: 36 }}>{t.rooms}</h1>

          <button
            onClick={() => setCreatingRoom(!creatingRoom)}
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
                onChange={(e) => setRoomName(e.target.value)}
                placeholder={t.roomName}
                style={inputStyle}
              />

              <input
                value={roomTheme}
                onChange={(e) => setRoomTheme(e.target.value)}
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
                  onClick={() => setRoomPrivate(!roomPrivate)}
                  style={{
                    flex: 1,
                    background: "#21142c",
                    border: "1px solid #583370",
                    color: "#fff",
                    borderRadius: 13,
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
                    padding: 12,
                  }}
                >
                  {t.create}
                </button>
              </div>
            </div>
          )}

          {officialRooms.map((room) => (
            <div
              key={room.id}
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
                }}
              >
                ◎
              </div>

              <div style={{ flex: 1 }}>
                <strong>{room.name}</strong>

                <small
                  style={{
                    display: "block",
                    color: "#50e99c",
                    marginTop: 4,
                  }}
                >
                  ● LIVE
                </small>
              </div>

              <span style={{ color: "#cf7aff" }}>›</span>
            </div>
          ))}

          <h3 style={{ marginTop: 28 }}>{t.community}</h3>

          {communityRooms.length === 0 && (
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

          {communityRooms.map((room) => (
            <div
              key={room.id}
              style={{
                ...card,
                padding: 17,
                marginBottom: 11,
              }}
            >
              <strong>
                {room.is_private ? "🔒 " : "◎ "}
                {room.name}
              </strong>

              <p
                style={{
                  opacity: 0.65,
                  fontSize: 13,
                }}
              >
                {room.description || "WHO Community"}
              </p>
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

          <h1 style={{ fontSize: 38 }}>{t.shop}</h1>

          <p style={{ opacity: 0.65 }}>
            {t.shopHint}
          </p>

          <div
            style={{
              ...card,
              padding: 17,
            }}
          >
            <small>{t.points}</small>

            <div
              style={{
                fontSize: 31,
                fontWeight: 950,
              }}
            >
              ✦ {points}
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            gap: 12,
            padding: "0 18px",
            maxWidth: 650,
            margin: "0 auto",
          }}
        >
          {shopItems.map((item) => {
            const isOwned = owned.includes(item.id);

            const price = Number(
              item.points_price ?? item.price ?? 0
            );

            return (
              <div
                key={item.id}
                style={{
                  ...card,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    height: 165,
                    position: "relative",
                    display: "grid",
                    placeItems: "center",
                    background:
                      "radial-gradient(circle,#55206f,#100817)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      fontSize: 64,
                      color: "#d996f5",
                      opacity: 0.85,
                    }}
                  >
                    {getShopSymbol(item)}
                  </div>

                  <img
                    src={getShopImage(item)}
                    alt={item.name}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    style={{
                      position: "relative",
                      zIndex: 2,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: 0,
                      boxSizing: "border-box",
                    }}
                  />

                  <small
                    style={{
                      position: "absolute",
                      zIndex: 3,
                      top: 8,
                      left: 8,
                      background: "rgba(8,5,12,.92)",
                      border: "1px solid rgba(173,91,211,.22)",
                      padding: "5px 7px",
                      borderRadius: 8,
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  >
                    {item.rarity}
                  </small>
                </div>

                <div
                  style={{
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <strong
                    style={{
                      fontSize: 14,
                      minHeight: 34,
                    }}
                  >
                    {item.name}
                  </strong>

                  <div
                    style={{
                      color: "#df94ff",
                      fontWeight: 900,
                      margin: "8px 0 11px",
                    }}
                  >
                    ✦ {price}
                  </div>

                  <button
                    disabled={isOwned}
                    onClick={() => buy(item)}
                    style={{
                      width: "100%",
                      padding: 11,
                      marginTop: "auto",
                      borderRadius: 12,
                      border: "1px solid #784093",
                      background: isOwned
                        ? "#242027"
                        : "linear-gradient(135deg,#702394,#51176f)",
                      color: "#fff",
                      fontWeight: 900,
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
     PROFILE
     ========================================================= */

  if (page === "profile") {
    const level = Math.max(
      1,
      Math.floor(points / 250) + 1
    );

    const ownedProducts = shopItems.filter((item) =>
      owned.includes(item.id)
    );

    return (
      <main style={background}>
        <Language />

        <section
          style={{
            textAlign: "center",
            padding: 20,
          }}
        >
          <SafeAvatar
            name={avatar}
            size={135}
            border
          />

          <h1>@{nickname}</h1>

          <span
            style={{
              color: isFounder ? "#e7a3ff" : "#6de0ad",
              fontWeight: 900,
            }}
          >
            {isFounder
              ? "♛ WHO FOUNDER"
              : "● WHO MEMBER"}
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
              gridTemplateColumns: "1fr 1fr",
              gap: 11,
            }}
          >
            <div style={{ ...card, padding: 17 }}>
              <small>{t.points}</small>
              <div
                style={{
                  fontSize: 27,
                  fontWeight: 900,
                }}
              >
                ✦ {points}
              </div>
            </div>

            <div style={{ ...card, padding: 17 }}>
              <small>{t.level}</small>
              <div
                style={{
                  fontSize: 27,
                  fontWeight: 900,
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
            <small>{t.reputation}</small>

            <h3 style={{ color: "#5ce5a1" }}>
              ✓ {t.good}
            </h3>

            <div
              style={{
                fontSize: 13,
                opacity: 0.7,
              }}
            >
              WHO Reputation: {reputation}
            </div>
          </div>

          <div
            style={{
              ...card,
              padding: 17,
              marginTop: 11,
            }}
          >
            <small>{t.inventory}</small>

            <h2>{owned.length}</h2>

            <span
              style={{
                opacity: 0.6,
                fontSize: 13,
              }}
            >
              {t.ownedItems}
            </span>

            {ownedProducts.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 7,
                  marginTop: 13,
                }}
              >
                {ownedProducts.map((item) => (
                  <span
                    key={item.id}
                    style={{
                      padding: "7px 10px",
                      borderRadius: 20,
                      background: "#281335",
                      border: "1px solid #603476",
                      fontSize: 10,
                    }}
                  >
                    {getShopSymbol(item)} {item.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setStarted("identity")}
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
              border: "1px solid #74354e",
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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong
              style={{
                display: "block",
                fontSize: 28,
                color: "#dc8dff",
              }}
            >
              WHO
            </strong>

            <small style={{ opacity: 0.55 }}>
              GENERAL ROOM
            </small>
          </div>

          <small
            style={{
              color: "#52e69c",
              border: "1px solid rgba(82,230,156,.22)",
              borderRadius: 20,
              padding: "7px 10px",
            }}
          >
            ● {t.online}
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
            <SafeAvatar name={avatar} size={52} />

            <div style={{ flex: 1 }}>
              <strong>@{nickname}</strong>

              <small
                style={{
                  display: "block",
                  color: "#bd82d4",
                }}
              >
                ✦ {points} WHO Points
              </small>
            </div>

            {isFounder && (
              <small
                style={{
                  color: "#e59cff",
                  fontWeight: 900,
                }}
              >
                ♛ FOUNDER
              </small>
            )}
          </div>
        </section>

        <section style={{ padding: "0 18px" }}>
          {!messagesLoading && messages.length === 0 && (
            <div
              style={{
                ...card,
                padding: 20,
                textAlign: "center",
                opacity: 0.6,
              }}
            >
              {t.emptyChat}
            </div>
          )}

          {messages.map((msg) => {
            const userVote = Number(myVotes[msg.id] || 0);
            const reported = reportedMessages.includes(msg.id);

            return (
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
                  }}
                >
                  <SafeAvatar
                    name={msg.avatar || "Shadow"}
                    size={48}
                  />

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <strong>
                      @{msg.nickname || "anonimo"}
                    </strong>

                    <p
                      style={{
                        overflowWrap: "anywhere",
                        lineHeight: 1.45,
                        margin: "8px 0 12px",
                      }}
                    >
                      {msg.content}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: 7,
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => vote(msg.id, 1)}
                        style={{
                          border:
                            userVote === 1
                              ? "1px solid #ce72f4"
                              : "1px solid #4d3a5b",
                          background:
                            userVote === 1
                              ? "#48205a"
                              : "#151019",
                          color:
                            userVote === 1
                              ? "#efb2ff"
                              : "#c9bdcf",
                          borderRadius: 20,
                          padding: "7px 11px",
                          fontWeight: 900,
                        }}
                      >
                        ♡ {Number(msg.likes || 0)}
                      </button>

                      <button
                        onClick={() => vote(msg.id, -1)}
                        style={{
                          border:
                            userVote === -1
                              ? "1px solid #d45d83"
                              : "1px solid #4d3a5b",
                          background:
                            userVote === -1
                              ? "#491d2c"
                              : "#151019",
                          color:
                            userVote === -1
                              ? "#ff9cb9"
                              : "#c9bdcf",
                          borderRadius: 20,
                          padding: "7px 11px",
                          fontWeight: 900,
                        }}
                      >
                        ⌄ {Number(msg.dislikes || 0)}
                      </button>

                      <button
                        disabled={reported}
                        onClick={() => reportMessage(msg.id)}
                        style={{
                          marginLeft: "auto",
                          border: reported
                            ? "1px solid #563946"
                            : "1px solid #49374f",
                          background: reported
                            ? "#25161c"
                            : "#110d14",
                          color: reported
                            ? "#8d6673"
                            : "#b5a3bb",
                          borderRadius: 20,
                          padding: "7px 10px",
                          fontSize: 11,
                        }}
                      >
                        ⚑ {reported ? "SEGNALATO" : t.report}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div
            style={{
              ...card,
              padding: 10,
              display: "flex",
              gap: 8,
              position: "sticky",
              bottom: 83,
              zIndex: 20,
            }}
          >
            <input
              value={message}
              maxLength={500}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={t.write}
              style={{
                flex: 1,
                minWidth: 0,
                background: "#0d0913",
                border: "1px solid #533069",
                borderRadius: 14,
                color: "#fff",
                padding: 13,
                outline: 0,
              }}
            />

            <button
              disabled={sending || !message.trim()}
              onClick={sendMessage}
              style={{
                ...primaryButton,
                padding: "0 17px",
                opacity:
                  sending || !message.trim()
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
