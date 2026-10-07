"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

/* =========================================================
   WHO — DESIGN
   ========================================================= */

const C = {
  bg: "#07050a",
  panel: "#100b16",
  panel2: "#17101f",
  purple: "#b54cff",
  purple2: "#7928ca",
  pink: "#ef7dff",
  cyan: "#64e8ff",
  text: "#f8f4fb",
  muted: "#978b9f",
  border: "rgba(190,100,255,.20)",
  green: "#61e5a4",
  red: "#ff7295",
};

const font =
  '"Trebuchet MS","Arial Narrow",Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';

const displayFont =
  '"Arial Black","Trebuchet MS",Inter,system-ui,sans-serif';

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
   WHO — ROOMS
   ========================================================= */

const defaultOfficialRooms = [
  {
    id: "who-general",
    room_key: "generale",
    name: "WHO GENERAL",
    description: "La community principale di WHO",
    is_official: true,
    is_private: false,
    is_active: true,
  },
  {
    id: "night-who",
    room_key: "night-who",
    name: "NIGHT WHO",
    description: "Chat notturna",
    is_official: true,
    is_private: false,
    is_active: true,
  },
  {
    id: "gaming",
    room_key: "gaming",
    name: "GAMING",
    description: "Gaming community",
    is_official: true,
    is_private: false,
    is_active: true,
  },
  {
    id: "music",
    room_key: "music",
    name: "MUSIC",
    description: "Musica e nuove scoperte",
    is_official: true,
    is_private: false,
    is_active: true,
  },
  {
    id: "meet-people",
    room_key: "meet-people",
    name: "MEET PEOPLE",
    description: "Conosci nuove persone",
    is_official: true,
    is_private: false,
    is_active: true,
  },
];

/* =========================================================
   WHO — SHOP
   ========================================================= */

const fallbackShopItems = [
  {
    id: "royal-crown",
    name: "ROYAL CROWN",
    rarity: "LEGENDARY",
    points_price: 1200,
    image_url: "/shop/royal/crown.png",
  },
  {
    id: "void-mask",
    name: "VOID MASK",
    rarity: "LEGENDARY",
    points_price: 1000,
    image_url: "/shop/void-mask.png",
  },
  {
    id: "glitch-eyes",
    name: "GLITCH EYES",
    rarity: "EPIC",
    points_price: 750,
    image_url: "/shop/glitch-eyes.png",
  },
  {
    id: "dual-aura",
    name: "DUAL AURA",
    rarity: "EPIC",
    points_price: 850,
    image_url: "/shop/dual-aura.png",
  },
  {
    id: "neon-visor",
    name: "NEON VISOR",
    rarity: "EPIC",
    points_price: 650,
    image_url: "/shop/neon-visor.png",
  },
  {
    id: "nexus-frame",
    name: "NEXUS FRAME",
    rarity: "LIMITED",
    points_price: 1500,
    image_url: "/shop/nexus-frame.png",
  },
];

/* =========================================================
   TRANSLATIONS
   ========================================================= */

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
    publicChat: "CHAT PUBBLICA",
    write: "Scrivi qualcosa...",
    points: "WHO POINTS",
    createRoom: "CREA UNA STANZA",
    roomName: "Nome della stanza",
    roomTheme: "Tema / descrizione",
    public: "Pubblica",
    private: "Privata",
    create: "CREA",
    official: "STANZE UFFICIALI",
    community: "COMMUNITY",
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
    noRooms: "Nessuna stanza community per ora.",
    emptyChat: "Qui è ancora tutto silenzioso. Scrivi il primo messaggio.",
    reporting: "Segnalazione inviata alla moderazione.",
    alreadyReported: "Hai già segnalato questo messaggio.",
    identityHint: "Il nickname sarà la tua identità pubblica.",
    shopHint: "Oggetti esclusivi per costruire la tua identità WHO.",
    ownedItems: "Oggetti posseduti",
    report: "Segnala",
    reported: "Segnalato",
    founder: "WHO FOUNDER",
    member: "WHO MEMBER",
    collectionEmpty: "La tua collezione è ancora vuota.",
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
    publicChat: "PUBLIC CHAT",
    write: "Say something...",
    points: "WHO POINTS",
    createRoom: "CREATE A ROOM",
    roomName: "Room name",
    roomTheme: "Theme / description",
    public: "Public",
    private: "Private",
    create: "CREATE",
    official: "OFFICIAL ROOMS",
    community: "COMMUNITY",
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
    noRooms: "No community rooms yet.",
    emptyChat: "It's quiet here. Send the first message.",
    reporting: "Report sent to moderation.",
    alreadyReported: "You already reported this message.",
    identityHint: "Your nickname will be your public identity.",
    shopHint: "Exclusive items to build your WHO identity.",
    ownedItems: "Owned items",
    report: "Report",
    reported: "Reported",
    founder: "WHO FOUNDER",
    member: "WHO MEMBER",
    collectionEmpty: "Your collection is still empty.",
  },
};

/* =========================================================
   HELPERS
   ========================================================= */

function cleanNickname(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);
}

function internalEmail(nickname) {
  return `${cleanNickname(nickname)}@account.who.local`;
}

function getAvatar(name) {
  if (name === "UNKNOWN") return ownerAvatar.image;

  return (
    avatars.find((item) => item.name === name)?.image ||
    "/shadow.png"
  );
}

function getShopImage(item) {
  return item.image_url || `/shop/${item.id}.png`;
}

function makeRoomKey(room) {
  if (room?.room_key) return room.room_key;
  if (room?.id === "who-general") return "generale";

  return String(room?.id || room?.name || "generale")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-");
}

function rarityStyle(rarity) {
  switch (rarity) {
    case "LEGENDARY":
      return {
        color: "#ffd879",
        border: "rgba(255,216,121,.45)",
        bg: "rgba(255,190,70,.10)",
      };
    case "LIMITED":
      return {
        color: "#ff80d7",
        border: "rgba(255,80,190,.45)",
        bg: "rgba(255,80,190,.10)",
      };
    case "EPIC":
      return {
        color: "#c790ff",
        border: "rgba(184,110,255,.45)",
        bg: "rgba(170,80,255,.10)",
      };
    default:
      return {
        color: "#77eaff",
        border: "rgba(90,220,255,.4)",
        bg: "rgba(90,220,255,.08)",
      };
  }
}

/* =========================================================
   APP
   ========================================================= */

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

  const [language, setLanguage] = useState("it");

  const [points, setPoints] = useState(500);
  const [reputation, setReputation] = useState(100);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [myVotes, setMyVotes] = useState({});
  const [reportedMessages, setReportedMessages] = useState([]);

  const [rooms, setRooms] = useState(defaultOfficialRooms);
  const [activeRoom, setActiveRoom] = useState(defaultOfficialRooms[0]);

  const [creatingRoom, setCreatingRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomTheme, setRoomTheme] = useState("");
  const [roomPrivate, setRoomPrivate] = useState(false);

  const [shopItems] = useState(fallbackShopItems);
  const [owned, setOwned] = useState([]);
  const [buying, setBuying] = useState(null);

  const t = translations[language];

  const isFounder =
    String(profile?.role || "").toUpperCase() === "FOUNDER";

  const currentRoomKey = makeRoomKey(activeRoom);

  const level = Math.max(1, Math.floor(points / 250) + 1);

  const ownedProducts = useMemo(
    () => shopItems.filter((item) => owned.includes(item.id)),
    [shopItems, owned]
  );

  const background = {
    minHeight: "100dvh",
    color: C.text,
    fontFamily: font,
    background: `
      radial-gradient(circle at 50% -15%, rgba(137,42,190,.38), transparent 35%),
      radial-gradient(circle at 100% 30%, rgba(49,39,150,.16), transparent 30%),
      linear-gradient(180deg,#0b0710 0%,#07050a 48%,#050407 100%)
    `,
    paddingBottom: session && started ? 108 : 25,
  };

  const card = {
    background:
      "linear-gradient(145deg,rgba(27,17,36,.96),rgba(12,8,17,.97))",
    border: `1px solid ${C.border}`,
    borderRadius: 22,
    color: C.text,
    boxShadow:
      "0 16px 45px rgba(0,0,0,.26), inset 0 1px rgba(255,255,255,.025)",
  };

  const inputStyle = {
    boxSizing: "border-box",
    width: "100%",
    padding: "15px 16px",
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    background: "rgba(5,4,8,.75)",
    color: C.text,
    outline: 0,
    fontFamily: font,
    fontSize: 16,
  };

  const primaryButton = {
    borderRadius: 16,
    border: "1px solid rgba(220,110,255,.65)",
    background:
      "linear-gradient(135deg,#a23bd1 0%,#7020a0 55%,#4e176f 100%)",
    color: "#fff",
    fontFamily: font,
    fontWeight: 900,
    letterSpacing: ".4px",
    boxShadow: "0 10px 28px rgba(132,42,177,.25)",
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

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !started || started === "identity") return;

    loadRooms();
    loadInventory();
    loadVotes();
    loadReports();
  }, [session, started]);

  useEffect(() => {
    if (!session || !started || started === "identity") return;

    loadMessages();

    const channel = supabase
      .channel(`who-room-${currentRoomKey}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `room=eq.${currentRoomKey}`,
        },
        () => loadMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, started, currentRoomKey]);

  /* =========================================================
     PROFILE
     ========================================================= */

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

    const { data: created, error: createError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        nickname: username,
        avatar: "Shadow",
      })
      .select()
      .single();

    if (createError) {
      console.error("CREATE PROFILE:", createError);
      return;
    }

    setProfile(created);
    setNickname(created.nickname || username);
    setAvatar(created.avatar || "Shadow");
    setPoints(Number(created.who_points ?? 500));
    setReputation(Number(created.reputation ?? 100));
    setStarted("identity");
  }

  function changeLanguage(lang) {
    setLanguage(lang);
    localStorage.setItem("who-language", lang);
  }

  /* =========================================================
     AUTH
     ========================================================= */

  async function registerAccount() {
    setAuthError("");

    const username = cleanNickname(nickname);

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      setAuthError(
        language === "it"
          ? "Nickname: 3-20 caratteri. Usa lettere, numeri o _"
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
          data: { username },
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
      const { data, error } = await supabase.auth.signInWithPassword({
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

      setActiveRoom(defaultOfficialRooms[0]);
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
    setReportedMessages([]);
    setActiveRoom(defaultOfficialRooms[0]);
  }

  /* =========================================================
     AVATAR
     ========================================================= */

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

  /* =========================================================
     CHAT
     ========================================================= */

  async function loadMessages() {
    setMessagesLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room", currentRoomKey)
      .order("id", { ascending: true });

    if (!error) setMessages(data || []);

    setMessagesLoading(false);
  }

  async function sendMessage() {
    const cleanMessage = message.trim();

    if (!cleanMessage || sending || !session?.user?.id) return;

    setSending(true);

    const publicNickname =
      profile?.nickname || profile?.username || nickname || "anonimo";

    const publicAvatar = profile?.avatar || avatar || "Shadow";

    const { error } = await supabase.from("messages").insert({
      room: currentRoomKey,
      nickname: publicNickname,
      avatar: publicAvatar,
      content: cleanMessage.slice(0, 500),
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

  /* =========================================================
     VOTES
     ========================================================= */

  async function loadVotes() {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from("message_votes")
      .select("message_id,vote")
      .eq("user_id", session.user.id);

    if (error) return;

    const map = {};

    (data || []).forEach((item) => {
      map[item.message_id] = Number(item.vote);
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

    const { error } = await supabase.from("message_votes").upsert(
      {
        message_id: messageId,
        user_id: session.user.id,
        vote: newVote,
      },
      {
        onConflict: "message_id,user_id",
      }
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
        item.id === messageId ? { ...item, likes, dislikes } : item
      )
    );
  }

  /* =========================================================
     REPORTS
     ========================================================= */

  async function loadReports() {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from("message_reports")
      .select("message_id")
      .eq("reporter_id", session.user.id);

    if (error) return;

    setReportedMessages((data || []).map((item) => item.message_id));
  }

  async function reportMessage(messageId) {
    if (!session?.user?.id) return;

    if (reportedMessages.includes(messageId)) {
      alert(t.alreadyReported);
      return;
    }

    const { error } = await supabase.from("message_reports").insert({
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

  /* =========================================================
     ROOMS
     ========================================================= */

  async function loadRooms() {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    const databaseRooms = error ? [] : data || [];

    const communityRooms = databaseRooms.filter(
      (room) => !room.is_official
    );

    const databaseOfficial = databaseRooms.filter(
      (room) => room.is_official
    );

    setRooms([
      ...(databaseOfficial.length
        ? databaseOfficial
        : defaultOfficialRooms),
      ...communityRooms,
    ]);
  }

  function enterRoom(room) {
    setActiveRoom(room);
    setMessages([]);
    setMessage("");
    setPage("chat");
  }

  async function createRoom() {
    const cleanName = roomName.trim();

    if (!cleanName || !session?.user?.id) return;

    const { data, error } = await supabase
      .from("rooms")
      .insert({
        name: cleanName.slice(0, 30),
        description: roomTheme.trim().slice(0, 100),
        owner_id: session.user.id,
        is_private: roomPrivate,
        is_official: false,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setRoomName("");
    setRoomTheme("");
    setRoomPrivate(false);
    setCreatingRoom(false);

    await loadRooms();

    if (data) enterRoom(data);
  }

  /* =========================================================
     INVENTORY
     ========================================================= */

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
    if (!session?.user?.id || buying) return;
    if (owned.includes(item.id)) return;

    const price = Number(item.points_price || 0);

    if (points < price) {
      alert(t.insufficient);
      return;
    }

    setBuying(item.id);

    try {
      const inventoryCheck = await supabase
        .from("user_inventory")
        .select("item_id")
        .eq("user_id", session.user.id)
        .eq("item_id", item.id)
        .maybeSingle();

      if (inventoryCheck.data) {
        setOwned((old) =>
          old.includes(item.id) ? old : [...old, item.id]
        );
        return;
      }

      const oldPoints = points;
      const newPoints = oldPoints - price;

      const { data: updatedProfile, error: pointsError } = await supabase
        .from("profiles")
        .update({
          who_points: newPoints,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id)
        .select()
        .single();

      if (pointsError) {
        alert(pointsError.message);
        return;
      }

      const { error: inventoryError } = await supabase
        .from("user_inventory")
        .insert({
          user_id: session.user.id,
          item_id: item.id,
        });

      if (inventoryError) {
        await supabase
          .from("profiles")
          .update({ who_points: oldPoints })
          .eq("id", session.user.id);

        alert(inventoryError.message);
        return;
      }

      setProfile(updatedProfile);
      setPoints(Number(updatedProfile.who_points));
      setOwned((old) => [...old, item.id]);
    } finally {
      setBuying(null);
    }
  }

  /* =========================================================
     UI COMPONENTS
     ========================================================= */

  function Language() {
    return (
      <div
        style={{
          maxWidth: 650,
          margin: "0 auto",
          display: "flex",
          justifyContent: "flex-end",
          gap: 7,
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
                  ? "linear-gradient(135deg,#71308e,#371448)"
                  : "rgba(17,12,22,.85)",
              border: `1px solid ${
                language === lang
                  ? "rgba(213,110,255,.55)"
                  : C.border
              }`,
              borderRadius: 30,
              padding: "7px 11px",
              color: "#fff",
              fontFamily: font,
              fontWeight: 900,
              fontSize: 11,
            }}
          >
            {lang === "it" ? "🇮🇹 IT" : "🇬🇧 EN"}
          </button>
        ))}
      </div>
    );
  }

  function Logo({ compact = false }) {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: compact ? 44 : 76,
            lineHeight: 0.9,
            fontWeight: 950,
            letterSpacing: compact ? -3 : -6,
            background:
              "linear-gradient(100deg,#ffffff 5%,#f0a7ff 42%,#a963ff 70%,#6eeeff)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 0 20px rgba(173,66,255,.40))",
          }}
        >
          WHO
        </div>

        {!compact && (
          <div
            style={{
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: 8,
              color: "#bc78d8",
              marginTop: 12,
            }}
          >
            BE ANYONE
          </div>
        )}
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
            ? "3px solid rgba(218,104,255,.85)"
            : "1px solid rgba(174,94,211,.32)",
          boxShadow: border
            ? "0 0 0 5px rgba(176,70,220,.08),0 0 32px rgba(178,69,221,.30)"
            : "none",
        }}
      />
    );
  }

  function SectionLabel({ children }) {
    return (
      <small
        style={{
          color: "#c97af0",
          letterSpacing: 2.7,
          fontWeight: 900,
          fontSize: 10,
        }}
      >
        {children}
      </small>
    );
  }

  function Nav() {
    const nav = [
      ["chat", "✦", t.chat],
      ["rooms", "◉", t.rooms],
      ["shop", "◇", t.shop],
      ["profile", "●", t.profile],
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
          background: "rgba(7,5,10,.94)",
          borderTop: "1px solid rgba(166,77,210,.20)",
          padding:
            "8px 5px calc(10px + env(safe-area-inset-bottom,0px))",
          backdropFilter: "blur(24px)",
          boxShadow: "0 -12px 35px rgba(0,0,0,.32)",
        }}
      >
        {nav.map(([id, icon, label]) => {
          const active = page === id;

          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                position: "relative",
                background: active
                  ? "linear-gradient(180deg,rgba(167,67,218,.15),transparent)"
                  : "transparent",
                border: 0,
                borderRadius: 15,
                color: active ? "#edb0ff" : "#786f7d",
                fontFamily: font,
                fontSize: 10,
                fontWeight: 900,
                padding: "6px 2px 4px",
              }}
            >
              {active && (
                <span
                  style={{
                    position: "absolute",
                    top: -8,
                    left: "32%",
                    right: "32%",
                    height: 2,
                    borderRadius: 5,
                    background: "#c65cff",
                    boxShadow: "0 0 12px #b54cff",
                  }}
                />
              )}

              <span
                style={{
                  display: "block",
                  fontSize: 20,
                  lineHeight: 1,
                  marginBottom: 5,
                  textShadow: active
                    ? "0 0 13px rgba(206,87,255,.9)"
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
            minHeight: "80dvh",
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
              color: C.muted,
              textAlign: "center",
              margin: "28px 0 17px",
              fontSize: 14,
            }}
          >
            {t.slogan}
          </p>

          <div style={{ ...card, padding: 21 }}>
            <SectionLabel>WHO ACCOUNT</SectionLabel>

            <h2
              style={{
                fontFamily: displayFont,
                fontSize: 23,
                letterSpacing: "-.7px",
                margin: "9px 0 19px",
              }}
            >
              {authMode === "login" ? t.loginTitle : t.registerTitle}
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
              style={{ ...inputStyle, marginTop: 10 }}
            />

            {authError && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderRadius: 13,
                  background: "rgba(160,42,82,.12)",
                  border: "1px solid rgba(255,92,140,.25)",
                  color: "#ffb2c8",
                  fontSize: 12,
                }}
              >
                {authError}
              </div>
            )}

            <button
              disabled={authBusy}
              onClick={
                authMode === "login" ? loginAccount : registerAccount
              }
              style={{
                ...primaryButton,
                width: "100%",
                padding: 16,
                marginTop: 16,
                opacity: authBusy ? 0.55 : 1,
              }}
            >
              {authBusy
                ? "•••"
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
                marginTop: 15,
                padding: 5,
                background: "transparent",
                border: 0,
                color: "#d796f0",
                fontFamily: font,
                fontSize: 12,
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
            padding: "6px 18px 17px",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <SectionLabel>{t.identity}</SectionLabel>

          <h1
            style={{
              fontFamily: displayFont,
              fontSize: 35,
              letterSpacing: "-1.4px",
              margin: "7px 0",
            }}
          >
            {t.who}
          </h1>

          <p
            style={{
              color: C.muted,
              marginTop: 6,
              fontSize: 13,
            }}
          >
            {t.identityHint}
          </p>
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
                  position: "relative",
                  padding: "14px 8px",
                  border: selected
                    ? "1px solid rgba(220,100,255,.85)"
                    : card.border,
                  boxShadow: selected
                    ? "0 0 0 1px rgba(196,76,255,.18),0 15px 40px rgba(114,32,160,.22)"
                    : card.boxShadow,
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
                    width: 110,
                    height: 110,
                    maxWidth: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: selected
                      ? "3px solid #d86cff"
                      : "2px solid rgba(111,62,135,.6)",
                  }}
                />

                {item.name === "UNKNOWN" && (
                  <div
                    style={{
                      color: "#f0b3ff",
                      fontSize: 9,
                      letterSpacing: 1,
                      fontWeight: 900,
                      marginTop: 9,
                    }}
                  >
                    ♛ FOUNDER EXCLUSIVE
                  </div>
                )}

                <small
                  style={{
                    display: "block",
                    marginTop: 9,
                    color: selected ? "#efaaff" : C.muted,
                    fontWeight: 900,
                    letterSpacing: ".6px",
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
    const officialRooms = rooms.filter((room) => room.is_official);
    const communityRooms = rooms.filter((room) => !room.is_official);

    function RoomCard({ room, index }) {
      const symbols = ["✦", "☾", "◆", "♫", "◎"];
      const symbol = room.is_private
        ? "◆"
        : symbols[index % symbols.length];

      return (
        <button
          onClick={() => enterRoom(room)}
          style={{
            ...card,
            width: "100%",
            padding: 15,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 13,
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              flexShrink: 0,
              borderRadius: 16,
              display: "grid",
              placeItems: "center",
              fontSize: 21,
              color: "#dc94ff",
              background:
                "radial-gradient(circle at 40% 30%,#54206c,#1a0c24 70%)",
              border: "1px solid rgba(181,76,255,.20)",
              boxShadow: "inset 0 0 20px rgba(181,76,255,.08)",
            }}
          >
            {symbol}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <strong
              style={{
                fontFamily: displayFont,
                fontSize: 14,
                letterSpacing: ".2px",
              }}
            >
              {room.is_private ? "🔒 " : ""}
              {room.name}
            </strong>

            {room.description && (
              <small
                style={{
                  display: "block",
                  color: C.muted,
                  marginTop: 5,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: 11,
                }}
              >
                {room.description}
              </small>
            )}
          </div>

          <span
            style={{
              color: "#c872ed",
              fontSize: 24,
              fontWeight: 900,
            }}
          >
            ›
          </span>
        </button>
      );
    }

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
          <SectionLabel>WHO NETWORK</SectionLabel>

          <h1
            style={{
              fontFamily: displayFont,
              fontSize: 37,
              letterSpacing: "-1.5px",
              margin: "7px 0 17px",
            }}
          >
            {t.rooms}
          </h1>

          <button
            onClick={() => setCreatingRoom(!creatingRoom)}
            style={{
              ...primaryButton,
              width: "100%",
              padding: 16,
              marginBottom: 19,
            }}
          >
            ＋ {t.createRoom}
          </button>

          {creatingRoom && (
            <div style={{ ...card, padding: 16, marginBottom: 21 }}>
              <input
                value={roomName}
                maxLength={30}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder={t.roomName}
                style={inputStyle}
              />

              <input
                value={roomTheme}
                maxLength={100}
                onChange={(e) => setRoomTheme(e.target.value)}
                placeholder={t.roomTheme}
                style={{ ...inputStyle, marginTop: 9 }}
              />

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 11,
                }}
              >
                <button
                  onClick={() => setRoomPrivate(!roomPrivate)}
                  style={{
                    flex: 1,
                    padding: 12,
                    background: "#17101f",
                    border: `1px solid ${C.border}`,
                    color: "#fff",
                    borderRadius: 13,
                    fontFamily: font,
                    fontWeight: 900,
                  }}
                >
                  {roomPrivate ? `◆ ${t.private}` : `◎ ${t.public}`}
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

          <SectionLabel>{t.official}</SectionLabel>

          <div style={{ marginTop: 10 }}>
            {officialRooms.map((room, index) => (
              <RoomCard
                key={room.id}
                room={room}
                index={index}
              />
            ))}
          </div>

          <div style={{ margin: "28px 0 10px" }}>
            <SectionLabel>{t.community}</SectionLabel>
          </div>

          {communityRooms.length === 0 ? (
            <div
              style={{
                ...card,
                padding: 18,
                color: C.muted,
                fontSize: 12,
              }}
            >
              {t.noRooms}
            </div>
          ) : (
            communityRooms.map((room, index) => (
              <RoomCard
                key={room.id}
                room={room}
                index={index + 2}
              />
            ))
          )}
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
            padding: "0 18px 16px",
            maxWidth: 650,
            margin: "0 auto",
          }}
        >
          <SectionLabel>{t.shopTitle}</SectionLabel>

          <h1
            style={{
              fontFamily: displayFont,
              fontSize: 38,
              letterSpacing: "-1.7px",
              margin: "7px 0 6px",
            }}
          >
            {t.shop}
          </h1>

          <p
            style={{
              color: C.muted,
              fontSize: 12,
              marginBottom: 17,
            }}
          >
            {t.shopHint}
          </p>

          <div
            style={{
              ...card,
              padding: 17,
              background:
                "radial-gradient(circle at 85% 0%,rgba(171,66,222,.18),transparent 38%),linear-gradient(145deg,#1c1026,#0d0912)",
            }}
          >
            <SectionLabel>{t.points}</SectionLabel>

            <div
              style={{
                fontFamily: displayFont,
                fontSize: 31,
                marginTop: 4,
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
            gap: 11,
            padding: "0 18px",
            maxWidth: 650,
            margin: "0 auto",
          }}
        >
          {shopItems.map((item) => {
            const isOwned = owned.includes(item.id);
            const price = Number(item.points_price || 0);
            const isBuying = buying === item.id;
            const rarity = rarityStyle(item.rarity);

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
                    height: 168,
                    position: "relative",
                    display: "grid",
                    placeItems: "center",
                    background:
                      "radial-gradient(circle at 50% 45%,rgba(130,50,165,.28),rgba(12,7,17,.95) 67%)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: 110,
                      height: 110,
                      borderRadius: "50%",
                      background: rarity.bg,
                      filter: "blur(16px)",
                    }}
                  />

                  <img
                    src={getShopImage(item)}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.style.display = "none";
                    }}
                    style={{
                      position: "relative",
                      zIndex: 2,
                      width: "90%",
                      height: "90%",
                      objectFit: "contain",
                      display: "block",
                      filter: "drop-shadow(0 10px 18px rgba(0,0,0,.45))",
                    }}
                  />

                  <small
                    style={{
                      position: "absolute",
                      zIndex: 3,
                      top: 9,
                      left: 9,
                      background: "rgba(7,5,10,.88)",
                      border: `1px solid ${rarity.border}`,
                      color: rarity.color,
                      padding: "5px 7px",
                      borderRadius: 8,
                      fontSize: 8,
                      letterSpacing: ".7px",
                      fontWeight: 900,
                    }}
                  >
                    {item.rarity}
                  </small>

                  {isOwned && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 4,
                        right: 8,
                        top: 8,
                        borderRadius: 20,
                        background: "rgba(27,111,75,.92)",
                        border: "1px solid rgba(91,231,163,.25)",
                        padding: "5px 7px",
                        fontSize: 8,
                        fontWeight: 900,
                      }}
                    >
                      ✓ {t.owned}
                    </div>
                  )}
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
                      fontFamily: displayFont,
                      fontSize: 12,
                      minHeight: 31,
                      letterSpacing: ".2px",
                    }}
                  >
                    {item.name}
                  </strong>

                  <div
                    style={{
                      color: "#e2a0ff",
                      fontWeight: 900,
                      margin: "7px 0 11px",
                      fontSize: 13,
                    }}
                  >
                    ✦ {price}
                  </div>

                  <button
                    disabled={isOwned || Boolean(buying)}
                    onClick={() => buy(item)}
                    style={{
                      width: "100%",
                      padding: 11,
                      marginTop: "auto",
                      borderRadius: 12,
                      border: isOwned
                        ? "1px solid rgba(255,255,255,.06)"
                        : "1px solid rgba(192,84,230,.40)",
                      background: isOwned
                        ? "#19161b"
                        : "linear-gradient(135deg,#7d28a2,#4c1768)",
                      color: isOwned ? "#817b84" : "#fff",
                      fontFamily: font,
                      fontSize: 10,
                      letterSpacing: ".5px",
                      fontWeight: 900,
                      opacity:
                        Boolean(buying) && !isBuying ? 0.45 : 1,
                    }}
                  >
                    {isOwned
                      ? `✓ ${t.owned}`
                      : isBuying
                      ? "•••"
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
    return (
      <main style={background}>
        <Language />

        <section
          style={{
            textAlign: "center",
            padding: "10px 20px 21px",
          }}
        >
          <SafeAvatar name={avatar} size={136} border />

          <h1
            style={{
              fontFamily: displayFont,
              fontSize: 28,
              letterSpacing: "-.8px",
              margin: "16px 0 7px",
            }}
          >
            @{nickname}
          </h1>

          <span
            style={{
              display: "inline-block",
              borderRadius: 30,
              padding: "6px 10px",
              border: `1px solid ${
                isFounder
                  ? "rgba(220,112,255,.32)"
                  : "rgba(87,225,159,.25)"
              }`,
              background: isFounder
                ? "rgba(176,62,219,.10)"
                : "rgba(60,190,130,.08)",
              color: isFounder ? "#e7a3ff" : C.green,
              fontSize: 9,
              letterSpacing: 1,
              fontWeight: 900,
            }}
          >
            {isFounder ? `♛ ${t.founder}` : `● ${t.member}`}
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
              gap: 10,
            }}
          >
            <div style={{ ...card, padding: 17 }}>
              <SectionLabel>{t.points}</SectionLabel>

              <div
                style={{
                  fontFamily: displayFont,
                  fontSize: 26,
                  marginTop: 5,
                }}
              >
                ✦ {points}
              </div>
            </div>

            <div style={{ ...card, padding: 17 }}>
              <SectionLabel>{t.level}</SectionLabel>

              <div
                style={{
                  fontFamily: displayFont,
                  fontSize: 26,
                  marginTop: 5,
                }}
              >
                {level}
              </div>
            </div>
          </div>

          <div style={{ ...card, padding: 17, marginTop: 10 }}>
            <SectionLabel>{t.reputation}</SectionLabel>

            <h3
              style={{
                color: C.green,
                margin: "7px 0 5px",
                fontFamily: displayFont,
                fontSize: 16,
              }}
            >
              ✓ {t.good}
            </h3>

            <div
              style={{
                height: 5,
                borderRadius: 20,
                background: "#211723",
                overflow: "hidden",
                margin: "10px 0 7px",
              }}
            >
              <div
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, reputation)
                  )}%`,
                  height: "100%",
                  borderRadius: 20,
                  background:
                    "linear-gradient(90deg,#5ee3a0,#a2efcb)",
                }}
              />
            </div>

            <div style={{ fontSize: 11, color: C.muted }}>
              WHO Reputation · {reputation}/100
            </div>
          </div>

          <div style={{ ...card, padding: 17, marginTop: 10 }}>
            <SectionLabel>{t.inventory}</SectionLabel>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 7,
                marginTop: 5,
              }}
            >
              <strong
                style={{
                  fontFamily: displayFont,
                  fontSize: 27,
                }}
              >
                {owned.length}
              </strong>

              <span style={{ color: C.muted, fontSize: 11 }}>
                {t.ownedItems}
              </span>
            </div>

            {ownedProducts.length === 0 ? (
              <div
                style={{
                  marginTop: 13,
                  color: C.muted,
                  fontSize: 11,
                }}
              >
                {t.collectionEmpty}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 8,
                  marginTop: 14,
                }}
              >
                {ownedProducts.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background:
                        "radial-gradient(circle,#281333,#0d0911)",
                      border: `1px solid ${C.border}`,
                      borderRadius: 14,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={getShopImage(item)}
                      alt=""
                      style={{
                        width: "100%",
                        aspectRatio: "1/1",
                        objectFit: "contain",
                        display: "block",
                      }}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />

                    <div
                      style={{
                        padding: "6px 4px",
                        fontSize: 7,
                        letterSpacing: ".3px",
                        fontWeight: 900,
                        textAlign: "center",
                      }}
                    >
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setStarted("identity")}
            style={{
              ...card,
              width: "100%",
              padding: 16,
              marginTop: 10,
              fontFamily: font,
              fontWeight: 900,
            }}
          >
            ◉ {t.change}
          </button>

          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: 16,
              marginTop: 10,
              borderRadius: 20,
              border: "1px solid rgba(255,91,137,.25)",
              background: "rgba(100,30,51,.16)",
              color: "#ff9db6",
              fontFamily: font,
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

      <div style={{ maxWidth: 650, margin: "0 auto" }}>
        <header
          style={{
            padding: "0 18px 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Logo compact />

          <button
            onClick={() => setPage("rooms")}
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 30,
              padding: "8px 12px",
              background: "rgba(20,11,28,.85)",
              color: "#dda0f6",
              fontFamily: font,
              fontSize: 10,
              fontWeight: 900,
            }}
          >
            ◉ {t.rooms}
          </button>
        </header>

        <section style={{ padding: "0 18px 12px" }}>
          <SectionLabel>
            {activeRoom?.is_private ? "PRIVATE CHAT" : t.publicChat}
          </SectionLabel>

          <h1
            style={{
              fontFamily: displayFont,
              fontSize: 31,
              letterSpacing: "-1.1px",
              margin: "5px 0 13px",
            }}
          >
            {activeRoom?.name || "WHO GENERAL"}
          </h1>

          <div
            style={{
              ...card,
              padding: 11,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <SafeAvatar name={avatar} size={48} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <strong
                style={{
                  fontFamily: displayFont,
                  fontSize: 13,
                }}
              >
                @{nickname}
              </strong>

              <small
                style={{
                  display: "block",
                  color: "#bd82d4",
                  marginTop: 3,
                  fontSize: 10,
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
                  fontSize: 8,
                  letterSpacing: ".7px",
                }}
              >
                ♛ FOUNDER
              </small>
            )}
          </div>
        </section>

        <section style={{ padding: "0 18px" }}>
          {messagesLoading && messages.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: C.muted,
                padding: 20,
              }}
            >
              •••
            </div>
          )}

          {!messagesLoading && messages.length === 0 && (
            <div
              style={{
                ...card,
                padding: 20,
                textAlign: "center",
                color: C.muted,
                fontSize: 12,
              }}
            >
              {t.emptyChat}
            </div>
          )}

          {messages.map((msg) => {
            const userVote = Number(myVotes[msg.id] || 0);
            const reported = reportedMessages.includes(msg.id);

            return (
              <article
                key={msg.id}
                style={{
                  ...card,
                  padding: 12,
                  marginBottom: 8,
                  borderRadius: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <SafeAvatar
                    name={msg.avatar || "Shadow"}
                    size={42}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong
                      style={{
                        fontFamily: displayFont,
                        fontSize: 12,
                        letterSpacing: ".1px",
                      }}
                    >
                      @{msg.nickname || "anonimo"}
                    </strong>

                    <p
                      style={{
                        overflowWrap: "anywhere",
                        lineHeight: 1.48,
                        margin: "5px 0 11px",
                        fontSize: 14,
                        color: "#f2edf4",
                      }}
                    >
                      {msg.content}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <button
                        aria-label="Like"
                        onClick={() => vote(msg.id, 1)}
                        style={{
                          border:
                            userVote === 1
                              ? "1px solid rgba(198,91,244,.70)"
                              : "1px solid rgba(255,255,255,.08)",
                          background:
                            userVote === 1
                              ? "rgba(150,55,190,.24)"
                              : "rgba(8,6,10,.60)",
                          color:
                            userVote === 1
                              ? "#efb2ff"
                              : "#9f95a4",
                          borderRadius: 20,
                          minWidth: 48,
                          padding: "6px 9px",
                          fontFamily: font,
                          fontSize: 11,
                          fontWeight: 900,
                        }}
                      >
                        ♡ {Number(msg.likes || 0)}
                      </button>

                      <button
                        aria-label="Dislike"
                        onClick={() => vote(msg.id, -1)}
                        style={{
                          border:
                            userVote === -1
                              ? "1px solid rgba(255,93,135,.55)"
                              : "1px solid rgba(255,255,255,.08)",
                          background:
                            userVote === -1
                              ? "rgba(160,45,77,.20)"
                              : "rgba(8,6,10,.60)",
                          color:
                            userVote === -1
                              ? "#ff9ab6"
                              : "#9f95a4",
                          borderRadius: 20,
                          minWidth: 48,
                          padding: "6px 9px",
                          fontFamily: font,
                          fontSize: 11,
                          fontWeight: 900,
                        }}
                      >
                        ◇ {Number(msg.dislikes || 0)}
                      </button>

                      <button
                        disabled={reported}
                        onClick={() => reportMessage(msg.id)}
                        style={{
                          marginLeft: "auto",
                          border: 0,
                          background: "transparent",
                          color: reported ? "#715b65" : "#8c818f",
                          padding: "6px",
                          fontFamily: font,
                          fontSize: 9,
                          fontWeight: 800,
                        }}
                      >
                        ⚑ {reported ? t.reported : t.report}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <div
            style={{
              padding: "10px 0 6px",
              position: "sticky",
              bottom: 78,
              zIndex: 20,
              marginTop: 8,
              background:
                "linear-gradient(180deg,transparent,#07050a 25%)",
            }}
          >
            <div
              style={{
                ...card,
                padding: 8,
                display: "flex",
                gap: 7,
                borderRadius: 20,
                boxShadow:
                  "0 12px 35px rgba(0,0,0,.45),0 0 0 1px rgba(169,72,215,.05)",
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
                  background: "transparent",
                  border: 0,
                  color: "#fff",
                  padding: "11px 10px",
                  outline: 0,
                  fontFamily: font,
                  fontSize: 14,
                }}
              />

              <button
                disabled={sending || !message.trim()}
                onClick={sendMessage}
                style={{
                  ...primaryButton,
                  width: 46,
                  height: 44,
                  borderRadius: 15,
                  fontSize: 17,
                  opacity:
                    sending || !message.trim() ? 0.35 : 1,
                }}
              >
                {sending ? "…" : "➤"}
              </button>
            </div>
          </div>
        </section>
      </div>

      <Nav />
    </main>
  );
      }
