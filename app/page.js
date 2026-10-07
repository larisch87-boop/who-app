"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const C = {
  bg: "#07050a",
  panel: "#100b16",
  panel2: "#17101f",
  purple: "#b54cff",
  pink: "#ef7dff",
  cyan: "#64e8ff",
  text: "#f8f4fb",
  muted: "#978b9f",
  border: "rgba(190,100,255,.20)",
  green: "#61e5a4",
  red: "#ff7295",
};

const font =
  '"Trebuchet MS",Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';

const displayFont =
  '"Arial Black","Trebuchet MS",Inter,system-ui,sans-serif';

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

const roomsDefault = [
  {
    id: "who-general",
    room_key: "generale",
    name: "WHO GENERAL",
    description: "La community principale di WHO",
    is_official: true,
    is_private: false,
  },
  {
    id: "night-who",
    room_key: "night-who",
    name: "NIGHT WHO",
    description: "Chat notturna",
    is_official: true,
    is_private: false,
  },
  {
    id: "gaming",
    room_key: "gaming",
    name: "GAMING",
    description: "Gaming community",
    is_official: true,
    is_private: false,
  },
  {
    id: "music",
    room_key: "music",
    name: "MUSIC",
    description: "Musica e nuove scoperte",
    is_official: true,
    is_private: false,
  },
  {
    id: "meet-people",
    room_key: "meet-people",
    name: "MEET PEOPLE",
    description: "Conosci nuove persone",
    is_official: true,
    is_private: false,
  },
];

const shopItems = [
  {
    id: "royal-crown",
    name: "ROYAL CROWN",
    rarity: "LEGENDARY",
    price: 1200,
    image: "/shop/royal/crown.png",
  },
  {
    id: "void-mask",
    name: "VOID MASK",
    rarity: "LEGENDARY",
    price: 1000,
    image: "/shop/void-mask.png",
  },
  {
    id: "glitch-eyes",
    name: "GLITCH EYES",
    rarity: "EPIC",
    price: 750,
    image: "/shop/glitch-eyes.png",
  },
  {
    id: "dual-aura",
    name: "DUAL AURA",
    rarity: "EPIC",
    price: 850,
    image: "/shop/dual-aura.png",
  },
  {
    id: "neon-visor",
    name: "NEON VISOR",
    rarity: "EPIC",
    price: 650,
    image: "/shop/neon-visor.png",
  },
  {
    id: "nexus-frame",
    name: "NEXUS FRAME",
    rarity: "LIMITED",
    price: 1500,
    image: "/shop/nexus-frame.png",
  },
];

function cleanNickname(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);
}

function internalEmail(nickname) {
  return `${cleanNickname(nickname)}@account.who.local`;
}

function avatarImage(name) {
  if (name === "UNKNOWN") return ownerAvatar.image;
  return avatars.find((a) => a.name === name)?.image || "/shadow.png";
}

function roomKey(room) {
  if (room?.room_key) return room.room_key;

  return String(room?.id || "generale")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-");
}

function getMessageColor(value) {
  const colors = {
    purple: "#e4a7ff",
    cyan: "#64e8ff",
    pink: "#ff8fda",
    red: "#ff728f",
    green: "#61e5a4",
    white: "#f8f4fb",
  };

  return colors[value] || colors.purple;
}

function getMessageFont(value) {
  const fonts = {
    standard:
      '"Trebuchet MS",Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    tech: '"Courier New",Courier,monospace',
    bold: '"Arial Black","Trebuchet MS",sans-serif',
    elegant: 'Georgia,"Times New Roman",serif',
  };

  return fonts[value] || fonts.standard;
}

function formatPrivateTime(value) {
  if (!value) return "";

  try {
    return new Date(value).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function Home() {
  const [loading, setLoading] = useState(true);

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");

  const [started, setStarted] = useState(false);
  const [page, setPage] = useState("chat");

  const [avatar, setAvatar] = useState("Shadow");
  const [points, setPoints] = useState(500);
  const [vibe, setVibe] = useState(100);
  const [reputation, setReputation] = useState(100);

  const [dmPrivacy, setDmPrivacy] = useState("vibe");
  const [dmMinVibe, setDmMinVibe] = useState(100);

  const [messageColor, setMessageColor] = useState("purple");
  const [messageFont, setMessageFont] = useState("standard");

  const [rooms, setRooms] = useState(roomsDefault);
  const [activeRoom, setActiveRoom] = useState(roomsDefault[0]);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [sending, setSending] = useState(false);

  const [myVotes, setMyVotes] = useState({});
  const [reportedMessages, setReportedMessages] = useState([]);

  const [chatMode, setChatMode] = useState("public");

  const [requests, setRequests] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [conversationDetails, setConversationDetails] = useState({});

  const [privateConversation, setPrivateConversation] = useState(null);
  const [privatePeer, setPrivatePeer] = useState(null);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [privateMessage, setPrivateMessage] = useState("");
  const [privateReply, setPrivateReply] = useState(null);

  const [blocked, setBlocked] = useState([]);
  const [owned, setOwned] = useState([]);

  const [showNewMessages, setShowNewMessages] = useState(false);

  const publicChatRef = useRef(null);
  const publicBottomRef = useRef(null);
  const privateBottomRef = useRef(null);
  const publicAtBottomRef = useRef(true);
  const firstPublicLoadRef = useRef(true);

  const isFounder =
    String(profile?.role || "").toUpperCase() === "FOUNDER";

  const currentRoom = roomKey(activeRoom);
  const level = Math.max(1, Math.floor(points / 250) + 1);

  const incomingRequests = useMemo(
    () =>
      requests.filter(
        (r) =>
          r.receiver_id === session?.user?.id &&
          r.status === "pending"
      ),
    [requests, session]
  );

  const totalUnreadPrivate = useMemo(() => {
    return Object.values(conversationDetails).reduce(
      (sum, item) => sum + Number(item?.unread || 0),
      0
    );
  }, [conversationDetails]);

  const background = {
    minHeight: "100dvh",
    color: C.text,
    fontFamily: font,
    background:
      "radial-gradient(circle at 50% -15%,rgba(137,42,190,.38),transparent 35%),linear-gradient(180deg,#0b0710,#050407)",
    paddingBottom: session && started ? 88 : 25,
  };

  const card = {
    background:
      "linear-gradient(145deg,rgba(27,17,36,.96),rgba(12,8,17,.97))",
    border: `1px solid ${C.border}`,
    borderRadius: 18,
    color: C.text,
  };

  const input = {
    width: "100%",
    boxSizing: "border-box",
    padding: 14,
    borderRadius: 15,
    border: `1px solid ${C.border}`,
    background: "#08060b",
    color: "#fff",
    outline: 0,
    fontFamily: font,
  };

  const purpleButton = {
    border: "1px solid rgba(220,110,255,.55)",
    background: "linear-gradient(135deg,#9c38cc,#5b1a7d)",
    color: "#fff",
    borderRadius: 14,
    fontWeight: 900,
    fontFamily: font,
  };

  /* MIGLIORATO: pulsanti azione chat */
  const tinyButton = {
    border: "1px solid rgba(190,100,255,.10)",
    background: "rgba(255,255,255,.025)",
    color: "#a999b1",
    borderRadius: 8,
    minHeight: 24,
    padding: "3px 7px",
    fontSize: 9,
    lineHeight: 1,
    fontWeight: 900,
    fontFamily: font,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  };

  useEffect(() => {
    initialize();

    const { data } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);

        if (newSession) {
          await loadProfile(newSession.user);
        }

        setLoading(false);
      }
    );

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !started) return;

    firstPublicLoadRef.current = true;
    publicAtBottomRef.current = true;
    setShowNewMessages(false);

    loadMessages(true);
    loadRooms();
    loadInventory();
    loadPrivateData();
    loadBlocks();
    loadVotes();
    loadReports();

    const channel = supabase
      .channel(`who-public-${currentRoom}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `room=eq.${currentRoom}`,
        },
        () => loadMessages(false)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session, started, currentRoom]);

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel(`who-private-${session.user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "private_requests",
        },
        () => loadPrivateData()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "private_messages",
        },
        async () => {
          await loadPrivateData();

          if (privateConversation) {
            await loadPrivateMessages(privateConversation.id);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session, privateConversation?.id]);

  useEffect(() => {
    if (
      chatMode === "private" &&
      privateConversation &&
      privateMessages.length
    ) {
      setTimeout(() => {
        privateBottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 80);
    }
  }, [privateMessages.length, chatMode, privateConversation?.id]);

  async function initialize() {
    const { data } = await supabase.auth.getSession();
    const current = data?.session || null;

    setSession(current);

    if (current) {
      await loadProfile(current.user);
    }

    setLoading(false);
  }

  async function loadProfile(user, preferredNickname = "") {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    const preferred =
      cleanNickname(preferredNickname) ||
      cleanNickname(user.user_metadata?.username) ||
      cleanNickname(user.user_metadata?.nickname);

    if (!data) {
      const username =
        preferred ||
        cleanNickname(user.email?.split("@")[0]) ||
        `who_${user.id.slice(0, 8)}`;

      const created = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          nickname: username,
          avatar: "Shadow",
          message_color: "purple",
          message_font: "standard",
        })
        .select()
        .single();

      if (created.data) {
        applyProfile(created.data);
        setStarted("identity");
      }

      return;
    }

    let finalProfile = data;

    const currentNickname = String(data.nickname || "");
    const looksAutomatic = /^who_[a-z0-9]{6,}$/i.test(currentNickname);

    if (
      preferred &&
      looksAutomatic &&
      cleanNickname(currentNickname) !== preferred
    ) {
      const repaired = await supabase
        .from("profiles")
        .update({
          nickname: preferred,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (!repaired.error && repaired.data) {
        finalProfile = repaired.data;
      }
    }

    applyProfile(finalProfile);
    setStarted(true);
  }

  function applyProfile(data) {
    setProfile(data);
    setNickname(data.nickname || data.username || "");
    setAvatar(data.avatar || "Shadow");
    setPoints(Number(data.who_points ?? 500));
    setVibe(Number(data.vibe ?? 100));
    setReputation(Number(data.reputation ?? 100));
    setDmPrivacy(data.dm_privacy || "vibe");
    setDmMinVibe(Number(data.dm_min_vibe ?? 100));
    setMessageColor(data.message_color || "purple");
    setMessageFont(data.message_font || "standard");
  }

  async function register() {
    const username = cleanNickname(nickname);

    if (username.length < 3) {
      setAuthError("Nickname minimo 3 caratteri.");
      return;
    }

    if (password.length < 8) {
      setAuthError("Password minimo 8 caratteri.");
      return;
    }

    setAuthError("");

    const { data, error } = await supabase.auth.signUp({
      email: internalEmail(username),
      password,
      options: {
        data: {
          username,
          nickname: username,
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (data.session && data.user) {
      setSession(data.session);

      const existing = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (existing.data) {
        await supabase
          .from("profiles")
          .update({
            nickname: username,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.user.id);
      } else {
        await supabase.from("profiles").insert({
          id: data.user.id,
          nickname: username,
          avatar: "Shadow",
          message_color: "purple",
          message_font: "standard",
        });
      }

      await loadProfile(data.user, username);
      setStarted("identity");
    } else {
      setAuthMode("login");
      setAuthError("Account creato. Ora accedi.");
    }
  }

  async function login() {
    const username = cleanNickname(nickname);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: internalEmail(username),
      password,
    });

    if (error) {
      setAuthError("Nickname o password non corretti.");
      return;
    }

    setSession(data.session);
    await loadProfile(data.user, username);
  }

  async function logout() {
    await supabase.auth.signOut();

    setSession(null);
    setProfile(null);
    setStarted(false);
    setMessages([]);
    setPrivateMessages([]);
    setConversationDetails({});
  }

  async function selectAvatar(name) {
    if (!session) return;
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

    if (!error && data) {
      applyProfile(data);
    }
  }

  async function saveMessageStyle(color, fontStyle) {
    if (!session) return;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        message_color: color,
        message_font: fontStyle,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    applyProfile(data);
  }

  async function saveDmSettings(mode, minimum = dmMinVibe) {
    if (!session) return;

    const min = Math.max(0, Number(minimum) || 0);

    const { data, error } = await supabase
      .from("profiles")
      .update({
        dm_privacy: mode,
        dm_min_vibe: min,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    applyProfile(data);
  }

  function scrollPublicToBottom(behavior = "smooth") {
    setTimeout(() => {
      publicBottomRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });

      publicAtBottomRef.current = true;
      setShowNewMessages(false);
    }, 60);
  }

  function handlePublicScroll() {
    const el = publicChatRef.current;
    if (!el) return;

    const distance =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    const nearBottom = distance < 100;
    publicAtBottomRef.current = nearBottom;

    if (nearBottom) {
      setShowNewMessages(false);
    }
  }

  async function loadMessages(forceBottom = false) {
    const wasAtBottom = publicAtBottomRef.current;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room", currentRoom)
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    const next = data || [];

    setMessages((old) => {
      if (
        next.length > old.length &&
        !wasAtBottom &&
        !forceBottom &&
        !firstPublicLoadRef.current
      ) {
        setShowNewMessages(true);
      }

      return next;
    });

    if (
      forceBottom ||
      wasAtBottom ||
      firstPublicLoadRef.current
    ) {
      firstPublicLoadRef.current = false;
      scrollPublicToBottom(forceBottom ? "auto" : "smooth");
    }
  }

  async function sendMessage() {
    const text = message.trim();

    if (!text || sending || !session) return;

    setSending(true);

    const mentionMatch = text.match(/@([a-z0-9_]{3,20})/i);

    let mentionedUserId = null;
    let mentionedNickname = null;

    if (mentionMatch) {
      const target = await supabase
        .from("profiles")
        .select("id,nickname")
        .ilike("nickname", mentionMatch[1])
        .maybeSingle();

      if (target.data) {
        mentionedUserId = target.data.id;
        mentionedNickname = target.data.nickname;
      }
    }

    const { error } = await supabase
      .from("messages")
      .insert({
        room: currentRoom,
        user_id: session.user.id,
        nickname: profile?.nickname || nickname,
        avatar,
        content: text.slice(0, 500),
        likes: 0,
        dislikes: 0,
        reply_to_id: replyingTo?.id || null,
        reply_to_nickname: replyingTo?.nickname || null,
        reply_preview: replyingTo?.content?.slice(0, 100) || null,
        mentioned_user_id: mentionedUserId,
        mentioned_nickname: mentionedNickname,
        message_color: messageColor,
        message_font: messageFont,
      });

    if (error) {
      alert(error.message);
    } else {
      setMessage("");
      setReplyingTo(null);
      publicAtBottomRef.current = true;
      await loadMessages(true);
    }

    setSending(false);
  }

  function mentionUser(msg) {
    if (!msg.nickname) return;

    setMessage((old) => {
      const mention = `@${msg.nickname} `;

      if (old.includes(mention)) return old;

      return `${old}${old ? " " : ""}${mention}`;
    });
  }

  function renderMessageText(text = "") {
    const parts = String(text).split(/(@[a-zA-Z0-9_]+)/g);

    return parts.map((part, index) => {
      if (/^@[a-zA-Z0-9_]+$/.test(part)) {
        return (
          <span
            key={index}
            style={{
              color: C.cyan,
              fontWeight: 900,
            }}
          >
            {part}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  }

  async function loadVotes() {
    if (!session) return;

    const { data, error } = await supabase
      .from("message_votes")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) return;

    const map = {};

    (data || []).forEach((v) => {
      map[v.message_id] = v.vote;
    });

    setMyVotes(map);
  }

  async function voteMessage(msg, vote) {
    if (!session) return;

    const oldVote = myVotes[msg.id];
    if (oldVote === vote) return;

    const existing = await supabase
      .from("message_votes")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("message_id", msg.id)
      .maybeSingle();

    let error = null;

    if (existing.data) {
      const result = await supabase
        .from("message_votes")
        .update({ vote })
        .eq("user_id", session.user.id)
        .eq("message_id", msg.id);

      error = result.error;
    } else {
      const result = await supabase
        .from("message_votes")
        .insert({
          user_id: session.user.id,
          message_id: msg.id,
          vote,
        });

      error = result.error;
    }

    if (error) {
      alert(error.message);
      return;
    }

    let likes = Number(msg.likes || 0);
    let dislikes = Number(msg.dislikes || 0);

    if (oldVote === "like") likes = Math.max(0, likes - 1);
    if (oldVote === "dislike") dislikes = Math.max(0, dislikes - 1);

    if (vote === "like") likes += 1;
    if (vote === "dislike") dislikes += 1;

    const update = await supabase
      .from("messages")
      .update({ likes, dislikes })
      .eq("id", msg.id);

    if (update.error) {
      alert(update.error.message);
      return;
    }

    setMyVotes((old) => ({
      ...old,
      [msg.id]: vote,
    }));

    await loadMessages(false);
  }

  async function loadReports() {
    if (!session) return;

    const { data, error } = await supabase
      .from("message_reports")
      .select("message_id")
      .eq("user_id", session.user.id);

    if (error) return;

    setReportedMessages((data || []).map((x) => x.message_id));
  }

  async function reportMessage(msg) {
    if (!session) return;

    if (reportedMessages.includes(msg.id)) {
      alert("Hai già segnalato questo messaggio.");
      return;
    }

    const ok = confirm(
      `Segnalare il messaggio di @${msg.nickname || "anonimo"}?`
    );

    if (!ok) return;

    const { error } = await supabase
      .from("message_reports")
      .insert({
        message_id: msg.id,
        user_id: session.user.id,
        reason: "user_report",
      });

    if (error) {
      alert(error.message);
      return;
    }

    setReportedMessages((old) => [...old, msg.id]);
    alert("Segnalazione inviata.");
  }

  async function requestPrivate(msg) {
    if (!session) return;
    if (msg.user_id === session.user.id) return;

    let targetId = msg.user_id;

    if (!targetId) {
      const result = await supabase
        .from("profiles")
        .select("id")
        .ilike("nickname", msg.nickname)
        .maybeSingle();

      targetId = result.data?.id;
    }

    if (!targetId) {
      alert(
        "Questo è un vecchio messaggio e non è collegato a un account."
      );
      return;
    }

    const check = await supabase.rpc("can_private_message", {
      target_user: targetId,
    });

    const result = check.data;

    if (!result?.allowed) {
      if (result?.reason === "vibe_too_low") {
        alert(
          `Questo utente richiede almeno ${result.required_vibe} VIBE. Tu ne hai ${result.your_vibe}.`
        );
      } else if (result?.reason === "private_disabled") {
        alert("Questo utente non accetta messaggi privati.");
      } else if (result?.reason === "blocked") {
        alert("Il contatto privato non è disponibile.");
      } else {
        alert("Non puoi contattare questo utente.");
      }

      return;
    }

    const existingConversation = conversations.find(
      (c) => c.user_one === targetId || c.user_two === targetId
    );

    if (existingConversation) {
      openConversation(
        existingConversation,
        msg.nickname,
        msg.avatar,
        targetId
      );
      return;
    }

    const existingRequest = requests.find(
      (r) =>
        r.sender_id === session.user.id &&
        r.receiver_id === targetId &&
        r.status === "pending"
    );

    if (existingRequest) {
      alert("Richiesta privata già inviata.");
      return;
    }

    const { error } = await supabase
      .from("private_requests")
      .insert({
        sender_id: session.user.id,
        receiver_id: targetId,
        status: "pending",
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Richiesta privata inviata.");
    await loadPrivateData();
  }

  async function loadPrivateData() {
    if (!session) return;

    const uid = session.user.id;

    const [requestResult, conversationResult] = await Promise.all([
      supabase
        .from("private_requests")
        .select("*")
        .or(`sender_id.eq.${uid},receiver_id.eq.${uid}`)
        .order("created_at", { ascending: false }),

      supabase
        .from("private_conversations")
        .select("*")
        .or(`user_one.eq.${uid},user_two.eq.${uid}`)
        .order("updated_at", { ascending: false }),
    ]);

    const reqs = requestResult.data || [];
    const convs = conversationResult.data || [];

    setRequests(reqs);
    setConversations(convs);

    const details = {};

    await Promise.all(
      convs.map(async (conv) => {
        const peerId =
          conv.user_one === uid ? conv.user_two : conv.user_one;

        const [peerResult, lastMessageResult, unreadResult] =
          await Promise.all([
            supabase
              .from("profiles")
              .select("id,nickname,avatar")
              .eq("id", peerId)
              .maybeSingle(),

            supabase
              .from("private_messages")
              .select("id,content,sender_id,created_at,is_read")
              .eq("conversation_id", conv.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle(),

            supabase
              .from("private_messages")
              .select("id", {
                count: "exact",
                head: true,
              })
              .eq("conversation_id", conv.id)
              .neq("sender_id", uid)
              .eq("is_read", false),
          ]);

        const peer = peerResult.data;
        const lastMessage = lastMessageResult.data;

        details[conv.id] = {
          peerId,
          nickname: peer?.nickname || "WHO",
          avatar: peer?.avatar || "Shadow",
          lastMessage: lastMessage?.content || "",
          lastMessageAt:
            lastMessage?.created_at ||
            conv.updated_at ||
            conv.created_at,
          lastSenderId: lastMessage?.sender_id || null,
          unread: unreadResult.count || 0,
        };
      })
    );

    setConversationDetails(details);
  }

  async function acceptRequest(req) {
    const { data, error } = await supabase.rpc(
      "accept_private_request",
      {
        request_id: req.id,
      }
    );

    if (error) {
      alert(error.message);
      return;
    }

    await loadPrivateData();

    const { data: conversation } = await supabase
      .from("private_conversations")
      .select("*")
      .eq("id", data)
      .single();

    if (conversation) {
      const peerId = req.sender_id;

      const peer = await supabase
        .from("profiles")
        .select("nickname,avatar")
        .eq("id", peerId)
        .maybeSingle();

      openConversation(
        conversation,
        peer.data?.nickname || "WHO",
        peer.data?.avatar || "Shadow",
        peerId
      );
    }
  }

  async function declineRequest(req) {
    const { error } = await supabase
      .from("private_requests")
      .update({
        status: "declined",
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadPrivateData();
  }

  async function openConversation(
    conversation,
    peerName,
    peerAvatar,
    peerId
  ) {
    setPrivateConversation(conversation);

    setPrivatePeer({
      id: peerId,
      nickname: peerName || "WHO",
      avatar: peerAvatar || "Shadow",
    });

    setChatMode("private");
    await loadPrivateMessages(conversation.id);
    await loadPrivateData();
  }

  async function openConversationFromList(conv) {
    const info = conversationDetails[conv.id];

    if (info) {
      await openConversation(
        conv,
        info.nickname,
        info.avatar,
        info.peerId
      );
      return;
    }

    const uid = session.user.id;

    const peerId =
      conv.user_one === uid ? conv.user_two : conv.user_one;

    const peer = await supabase
      .from("profiles")
      .select("nickname,avatar")
      .eq("id", peerId)
      .maybeSingle();

    await openConversation(
      conv,
      peer.data?.nickname || "WHO",
      peer.data?.avatar || "Shadow",
      peerId
    );
  }

  async function loadPrivateMessages(conversationId) {
    if (!conversationId || !session) return;

    const { data, error } = await supabase
      .from("private_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setPrivateMessages(data || []);

    await supabase
      .from("private_messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", session.user.id)
      .eq("is_read", false);
  }

  async function sendPrivateMessage() {
    const text = privateMessage.trim();

    if (!text || !privateConversation || !session) return;

    const { error } = await supabase
      .from("private_messages")
      .insert({
        conversation_id: privateConversation.id,
        sender_id: session.user.id,
        content: text.slice(0, 1000),
        reply_to_id: privateReply?.id || null,
        reply_to_nickname: privateReply?.nickname || null,
        reply_preview: privateReply?.content?.slice(0, 100) || null,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setPrivateMessage("");
    setPrivateReply(null);

    await loadPrivateMessages(privateConversation.id);
    await loadPrivateData();
  }

  async function blockUser(userId) {
    if (!session || !userId) return;
    if (!confirm("Vuoi bloccare questo utente?")) return;

    const { error } = await supabase
      .from("user_blocks")
      .upsert(
        {
          blocker_id: session.user.id,
          blocked_id: userId,
        },
        {
          onConflict: "blocker_id,blocked_id",
        }
      );

    if (error) {
      alert(error.message);
      return;
    }

    setPrivateConversation(null);
    setPrivatePeer(null);
    setPrivateMessages([]);

    await loadBlocks();

    alert("Utente bloccato.");
  }

  async function loadBlocks() {
    if (!session) return;

    const { data } = await supabase
      .from("user_blocks")
      .select("blocked_id")
      .eq("blocker_id", session.user.id);

    setBlocked((data || []).map((x) => x.blocked_id));
  }

  async function loadRooms() {
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    const db = data || [];

    const official = db.filter((r) => r.is_official);
    const community = db.filter((r) => !r.is_official);

    setRooms([
      ...(official.length ? official : roomsDefault),
      ...community,
    ]);
  }

  async function loadInventory() {
    if (!session) return;

    const { data } = await supabase
      .from("user_inventory")
      .select("item_id")
      .eq("user_id", session.user.id);

    setOwned((data || []).map((x) => x.item_id));
  }

  async function buyItem(item) {
    if (owned.includes(item.id) || points < item.price) {
      if (points < item.price) {
        alert("WHO Points insufficienti.");
      }
      return;
    }

    const newPoints = points - item.price;

    const update = await supabase
      .from("profiles")
      .update({
        who_points: newPoints,
      })
      .eq("id", session.user.id)
      .select()
      .single();

    if (update.error) {
      alert(update.error.message);
      return;
    }

    const inventory = await supabase
      .from("user_inventory")
      .insert({
        user_id: session.user.id,
        item_id: item.id,
      });

    if (inventory.error) {
      alert(inventory.error.message);
      return;
    }

    setPoints(newPoints);
    setOwned((old) => [...old, item.id]);
  }

  function Avatar({ name, size = 46 }) {
    return (
      <img
        src={avatarImage(name)}
        alt=""
        onError={(e) => {
          e.currentTarget.src = "/shadow.png";
        }}
        style={{
          width: size,
          height: size,
          objectFit: "cover",
          borderRadius: "50%",
          flexShrink: 0,
          border: "1px solid rgba(200,100,255,.35)",
        }}
      />
    );
  }

  /* MIGLIORATO: WHO non viene più tagliato */
  function Logo() {
    return (
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 39,
          fontWeight: 900,
          lineHeight: 1.12,
          letterSpacing: "-1.5px",
          padding: "5px 6px 6px 2px",
          display: "inline-block",
          overflow: "visible",
          background:
            "linear-gradient(90deg,#ffffff 0%,#f0b4ff 35%,#9b63ff 68%,#6eeeff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
      >
        WHO
      </div>
    );
  }

  function Nav() {
    return (
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          background: "rgba(7,5,10,.98)",
          borderTop: `1px solid ${C.border}`,
          padding: "8px 4px 12px",
          backdropFilter: "blur(15px)",
        }}
      >
        {[
          ["chat", "✦", "Chat"],
          ["rooms", "◉", "Stanze"],
          ["shop", "◇", "Shop"],
          ["profile", "●", "Profilo"],
        ].map(([id, icon, label]) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            style={{
              border: 0,
              background: "transparent",
              color: page === id ? "#edaaff" : "#776d7b",
              fontFamily: font,
              fontWeight: 900,
              fontSize: 10,
            }}
          >
            <div style={{ fontSize: 19 }}>{icon}</div>
            {label}
          </button>
        ))}
      </nav>
    );
  }

  function ReplyBox({ data, cancel }) {
    if (!data) return null;

    return (
      <div
        style={{
          background: "rgba(181,76,255,.08)",
          borderLeft: "2px solid #c75cff",
          borderRadius: 10,
          padding: "7px 9px",
          marginBottom: 6,
          display: "flex",
          gap: 8,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ color: "#df9cff", fontSize: 10 }}>
            ↩ @{data.nickname}
          </strong>

          <div
            style={{
              color: C.muted,
              fontSize: 10,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.content}
          </div>
        </div>

        <button
          onClick={cancel}
          style={{
            border: 0,
            background: "transparent",
            color: "#aaa",
          }}
        >
          ✕
        </button>
      </div>
    );
  }

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

  if (!session) {
    return (
      <main style={background}>
        <section
          style={{
            maxWidth: 420,
            margin: "0 auto",
            padding: "80px 20px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <Logo />

            <div style={{ color: C.muted, marginTop: 10 }}>
              Nessun nome. Nessun giudizio. Solo WHO.
            </div>
          </div>

          <div style={{ ...card, padding: 20 }}>
            <h2>
              {authMode === "login"
                ? "Bentornato in WHO"
                : "Crea il tuo account WHO"}
            </h2>

            <input
              value={nickname}
              onChange={(e) =>
                setNickname(cleanNickname(e.target.value))
              }
              placeholder="Nickname"
              style={input}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ ...input, marginTop: 9 }}
            />

            {authError && (
              <div
                style={{
                  color: "#ff9ab6",
                  marginTop: 10,
                  fontSize: 12,
                }}
              >
                {authError}
              </div>
            )}

            <button
              onClick={authMode === "login" ? login : register}
              style={{
                ...purpleButton,
                width: "100%",
                padding: 15,
                marginTop: 14,
              }}
            >
              {authMode === "login" ? "ACCEDI" : "CREA ACCOUNT"}
            </button>

            <button
              onClick={() => {
                setAuthMode(
                  authMode === "login" ? "register" : "login"
                );
                setAuthError("");
              }}
              style={{
                width: "100%",
                background: "transparent",
                border: 0,
                color: "#d996f1",
                marginTop: 14,
              }}
            >
              {authMode === "login"
                ? "Non hai un account? Registrati"
                : "Hai già un account? Accedi"}
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (started === "identity") {
    const available = isFounder
      ? [ownerAvatar, ...avatars]
      : avatars;

    return (
      <main style={background}>
        <section
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: 20,
          }}
        >
          <h1>Scegli la tua identità</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 10,
            }}
          >
            {available.map((a) => (
              <button
                key={a.name}
                onClick={() => selectAvatar(a.name)}
                style={{ ...card, padding: 13 }}
              >
                <img
                  src={a.image}
                  alt=""
                  style={{
                    width: 105,
                    height: 105,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <div
                  style={{
                    color:
                      avatar === a.name ? "#efaaff" : C.muted,
                    marginTop: 8,
                    fontWeight: 900,
                  }}
                >
                  {avatar === a.name ? "✓ SELEZIONATO" : "SCEGLI"}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStarted(true)}
            style={{
              ...purpleButton,
              width: "100%",
              padding: 16,
              marginTop: 15,
            }}
          >
            CONTINUA →
          </button>
        </section>
      </main>
    );
  }

  if (page === "rooms") {
    return (
      <main style={background}>
        <section
          style={{
            maxWidth: 650,
            margin: "0 auto",
            padding: 18,
          }}
        >
          <h1
            style={{
              fontFamily: displayFont,
              fontSize: 35,
            }}
          >
            Stanze
          </h1>

          {rooms.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setActiveRoom(r);
                setPage("chat");
                setChatMode("public");
                firstPublicLoadRef.current = true;
              }}
              style={{
                ...card,
                width: "100%",
                padding: 15,
                marginBottom: 9,
                textAlign: "left",
              }}
            >
              <strong>
                {r.is_private ? "🔒 " : "✦ "}
                {r.name}
              </strong>

              <div
                style={{
                  color: C.muted,
                  fontSize: 11,
                  marginTop: 5,
                }}
              >
                {r.description}
              </div>
            </button>
          ))}
        </section>

        <Nav />
      </main>
    );
  }

  if (page === "shop") {
    return (
      <main style={background}>
        <section
          style={{
            maxWidth: 650,
            margin: "0 auto",
            padding: 18,
          }}
        >
          <h1
            style={{
              fontFamily: displayFont,
              fontSize: 35,
            }}
          >
            WHO SHOP
          </h1>

          <div style={{ ...card, padding: 15, marginBottom: 15 }}>
            ✦ {points} WHO Points
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 10,
            }}
          >
            {shopItems.map((item) => (
              <div
                key={item.id}
                style={{
                  ...card,
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "contain",
                  }}
                />

                <div style={{ padding: 12 }}>
                  <strong>{item.name}</strong>

                  <div
                    style={{
                      color: "#dc9aff",
                      margin: "8px 0",
                    }}
                  >
                    ✦ {item.price}
                  </div>

                  <button
                    disabled={owned.includes(item.id)}
                    onClick={() => buyItem(item)}
                    style={{
                      ...purpleButton,
                      width: "100%",
                      padding: 10,
                      opacity: owned.includes(item.id) ? 0.4 : 1,
                    }}
                  >
                    {owned.includes(item.id)
                      ? "✓ POSSEDUTO"
                      : "SBLOCCA"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Nav />
      </main>
    );
  }

  if (page === "profile") {
    return (
      <main style={background}>
        <section
          style={{
            maxWidth: 650,
            margin: "0 auto",
            padding: 20,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Avatar name={avatar} size={130} />

            <h1>@{nickname}</h1>

            {isFounder && (
              <div
                style={{
                  color: "#e8a0ff",
                  fontWeight: 900,
                }}
              >
                ♛ WHO FOUNDER
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 8,
              marginTop: 20,
            }}
          >
            <div style={{ ...card, padding: 13 }}>
              <small>POINTS</small>
              <h2>✦ {points}</h2>
            </div>

            <div style={{ ...card, padding: 13 }}>
              <small>VIBE</small>
              <h2>⚡ {vibe}</h2>
            </div>

            <div style={{ ...card, padding: 13 }}>
              <small>LEVEL</small>
              <h2>{level}</h2>
            </div>
          </div>

          <div style={{ ...card, padding: 16, marginTop: 10 }}>
            <strong>STILE MESSAGGI</strong>

            <p style={{ color: C.muted, fontSize: 11 }}>
              Crea il tuo stile personale nella chat pubblica.
            </p>

            <div
              style={{
                background: "#09070c",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 12,
                marginBottom: 14,
                color: getMessageColor(messageColor),
                fontFamily: getMessageFont(messageFont),
                fontSize: 14,
              }}
            >
              Questo è il mio stile WHO.
            </div>

            <small>COLORE</small>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 7,
                marginTop: 7,
              }}
            >
              {[
                ["purple", "VIOLA"],
                ["cyan", "CIANO"],
                ["pink", "ROSA"],
                ["red", "ROSSO"],
                ["green", "VERDE"],
                ["white", "BIANCO"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => {
                    setMessageColor(value);
                    saveMessageStyle(value, messageFont);
                  }}
                  style={{
                    padding: 10,
                    borderRadius: 11,
                    border:
                      messageColor === value
                        ? `1px solid ${getMessageColor(value)}`
                        : `1px solid ${C.border}`,
                    background:
                      messageColor === value
                        ? "rgba(181,76,255,.14)"
                        : "#0c0910",
                    color: getMessageColor(value),
                    fontSize: 9,
                    fontWeight: 900,
                  }}
                >
                  ● {label}
                </button>
              ))}
            </div>

            <small
              style={{
                display: "block",
                marginTop: 15,
              }}
            >
              CARATTERE
            </small>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 7,
                marginTop: 7,
              }}
            >
              {[
                ["standard", "STANDARD"],
                ["tech", "TECH"],
                ["bold", "BOLD"],
                ["elegant", "ELEGANT"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => {
                    setMessageFont(value);
                    saveMessageStyle(messageColor, value);
                  }}
                  style={{
                    padding: 11,
                    borderRadius: 11,
                    border:
                      messageFont === value
                        ? "1px solid #cf6cff"
                        : `1px solid ${C.border}`,
                    background:
                      messageFont === value
                        ? "rgba(181,76,255,.16)"
                        : "#0c0910",
                    color: "#fff",
                    fontFamily: getMessageFont(value),
                    fontSize: 10,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...card, padding: 16, marginTop: 10 }}>
            <strong>PRIVACY MESSAGGI</strong>

            <p style={{ color: C.muted, fontSize: 11 }}>
              Decidi chi può inviarti una richiesta privata.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 6,
              }}
            >
              {[
                ["everyone", "TUTTI"],
                ["vibe", "VIBE"],
                ["nobody", "NESSUNO"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => saveDmSettings(value)}
                  style={{
                    padding: 10,
                    borderRadius: 12,
                    border:
                      dmPrivacy === value
                        ? "1px solid #cf6cff"
                        : `1px solid ${C.border}`,
                    background:
                      dmPrivacy === value
                        ? "rgba(181,76,255,.18)"
                        : "#0c0910",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 9,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {dmPrivacy === "vibe" && (
              <div style={{ marginTop: 14 }}>
                <small>VIBE MINIMA PER CONTATTARTI</small>

                <input
                  type="number"
                  min="0"
                  value={dmMinVibe}
                  onChange={(e) =>
                    setDmMinVibe(Number(e.target.value))
                  }
                  style={{ ...input, marginTop: 7 }}
                />

                <button
                  onClick={() =>
                    saveDmSettings("vibe", dmMinVibe)
                  }
                  style={{
                    ...purpleButton,
                    width: "100%",
                    padding: 11,
                    marginTop: 8,
                  }}
                >
                  SALVA SOGLIA
                </button>
              </div>
            )}
          </div>

          <div style={{ ...card, padding: 16, marginTop: 10 }}>
            <strong>REPUTAZIONE</strong>

            <h3 style={{ color: C.green }}>✓ IN REGOLA</h3>

            <div style={{ color: C.muted, fontSize: 11 }}>
              {reputation}/100
            </div>
          </div>

          <button
            onClick={() => setStarted("identity")}
            style={{
              ...card,
              width: "100%",
              padding: 15,
              marginTop: 10,
            }}
          >
            CAMBIA AVATAR
          </button>

          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: 15,
              marginTop: 10,
              borderRadius: 15,
              border: "1px solid rgba(255,90,130,.3)",
              background: "rgba(120,30,55,.15)",
              color: "#ff9ab6",
            }}
          >
            ESCI
          </button>
        </section>

        <Nav />
      </main>
    );
  }

  return (
    <main
      style={{
        ...background,
        height: "100dvh",
        overflow: "hidden",
        paddingBottom: 0,
      }}
    >
      <section
        style={{
          maxWidth: 650,
          height: "100%",
          margin: "0 auto",
          padding: "12px 14px 76px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
            minHeight: 58,
            overflow: "visible",
          }}
        >
          <Logo />

          <button
            onClick={() => setPage("rooms")}
            style={{
              ...card,
              padding: "8px 12px",
              fontSize: 11,
            }}
          >
            ◉ Stanze
          </button>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 7,
            margin: "6px 0 9px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => {
              setChatMode("public");
              setPrivateConversation(null);

              setTimeout(() => {
                scrollPublicToBottom("auto");
              }, 80);
            }}
            style={{
              padding: 10,
              borderRadius: 12,
              border:
                chatMode === "public"
                  ? "1px solid #c65cff"
                  : `1px solid ${C.border}`,
              background:
                chatMode === "public"
                  ? "rgba(181,76,255,.17)"
                  : "#0d0911",
              color: "#fff",
              fontWeight: 900,
              fontSize: 11,
            }}
          >
            ✦ PUBBLICA
          </button>

          <button
            onClick={() => {
              setChatMode("inbox");
              setPrivateConversation(null);
              loadPrivateData();
            }}
            style={{
              padding: 10,
              borderRadius: 12,
              border:
                chatMode !== "public"
                  ? "1px solid #c65cff"
                  : `1px solid ${C.border}`,
              background:
                chatMode !== "public"
                  ? "rgba(181,76,255,.17)"
                  : "#0d0911",
              color: "#fff",
              fontWeight: 900,
              fontSize: 11,
            }}
          >
            ✉ PRIVATI
            {incomingRequests.length + totalUnreadPrivate > 0
              ? ` · ${incomingRequests.length + totalUnreadPrivate}`
              : ""}
          </button>
        </div>

        {chatMode === "inbox" && !privateConversation && (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingBottom: 10,
            }}
          >
            <h2>Richieste</h2>

            {incomingRequests.length === 0 && (
              <div style={{ ...card, padding: 15, color: C.muted }}>
                Nessuna nuova richiesta.
              </div>
            )}

            {incomingRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  ...card,
                  padding: 13,
                  marginBottom: 8,
                }}
              >
                <strong>✉ Nuova richiesta privata</strong>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginTop: 10,
                  }}
                >
                  <button
                    onClick={() => acceptRequest(req)}
                    style={{
                      ...purpleButton,
                      flex: 1,
                      padding: 10,
                    }}
                  >
                    ACCETTA
                  </button>

                  <button
                    onClick={() => declineRequest(req)}
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 12,
                      border: "1px solid rgba(255,100,140,.3)",
                      background: "#160b10",
                      color: "#ff9ab6",
                    }}
                  >
                    RIFIUTA
                  </button>
                </div>
              </div>
            ))}

            <h2 style={{ marginTop: 25 }}>Conversazioni</h2>

            {conversations.length === 0 && (
              <div style={{ ...card, padding: 15, color: C.muted }}>
                Nessuna conversazione privata.
              </div>
            )}

            {conversations.map((conv) => {
              const info = conversationDetails[conv.id];

              return (
                <button
                  key={conv.id}
                  onClick={() => openConversationFromList(conv)}
                  style={{
                    ...card,
                    width: "100%",
                    padding: 11,
                    marginBottom: 7,
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    position: "relative",
                  }}
                >
                  <Avatar
                    name={info?.avatar || "Shadow"}
                    size={45}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <strong
                        style={{
                          color: "#fff",
                          fontSize: 13,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        @{info?.nickname || "WHO"}
                      </strong>

                      <span
                        style={{
                          color: C.muted,
                          fontSize: 8,
                          flexShrink: 0,
                        }}
                      >
                        {formatPrivateTime(info?.lastMessageAt)}
                      </span>
                    </div>

                    <div
                      style={{
                        color:
                          info?.unread > 0 ? "#f1c0ff" : C.muted,
                        fontWeight: info?.unread > 0 ? 900 : 400,
                        fontSize: 10,
                        marginTop: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {info?.lastMessage
                        ? `${
                            info.lastSenderId === session.user.id
                              ? "Tu: "
                              : ""
                          }${info.lastMessage}`
                        : "Nuova conversazione"}
                    </div>
                  </div>

                  {info?.unread > 0 && (
                    <div
                      style={{
                        minWidth: 20,
                        height: 20,
                        padding: "0 5px",
                        borderRadius: 20,
                        display: "grid",
                        placeItems: "center",
                        background:
                          "linear-gradient(135deg,#d95cff,#7b2dff)",
                        color: "#fff",
                        fontSize: 9,
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      {info.unread > 99 ? "99+" : info.unread}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {chatMode === "private" && privateConversation && (
          <>
            <div
              style={{
                ...card,
                padding: 9,
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 7,
                flexShrink: 0,
              }}
            >
              <button
                onClick={async () => {
                  setChatMode("inbox");
                  setPrivateConversation(null);
                  setPrivatePeer(null);
                  setPrivateMessages([]);
                  await loadPrivateData();
                }}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#dda0ff",
                  fontSize: 22,
                }}
              >
                ‹
              </button>

              <Avatar name={privatePeer?.avatar} size={36} />

              <div style={{ flex: 1 }}>
                <strong>
                  @{privatePeer?.nickname || "WHO"}
                </strong>

                <div style={{ color: C.muted, fontSize: 9 }}>
                  CHAT PRIVATA
                </div>
              </div>

              <button
                onClick={() => blockUser(privatePeer?.id)}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#ff879f",
                  fontSize: 9,
                }}
              >
                ⊘ BLOCCA
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                minHeight: 0,
                padding: "4px 2px 8px",
              }}
            >
              {privateMessages.length === 0 && (
                <div
                  style={{
                    color: C.muted,
                    textAlign: "center",
                    padding: 30,
                    fontSize: 11,
                  }}
                >
                  Inizia la conversazione privata.
                </div>
              )}

              {privateMessages.map((m) => {
                const mine = m.sender_id === session.user.id;

                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: mine
                        ? "flex-end"
                        : "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "82%",
                        padding: "9px 11px",
                        borderRadius: mine
                          ? "16px 16px 5px 16px"
                          : "16px 16px 16px 5px",
                        background: mine
                          ? "linear-gradient(135deg,#702596,#45145f)"
                          : "#17101f",
                        border: `1px solid ${C.border}`,
                        fontSize: 13,
                      }}
                    >
                      {m.reply_to_nickname && (
                        <div
                          style={{
                            padding: 6,
                            borderLeft: "2px solid #d45fff",
                            background: "rgba(0,0,0,.18)",
                            marginBottom: 5,
                            fontSize: 9,
                            color: C.muted,
                          }}
                        >
                          ↩ @{m.reply_to_nickname}
                          <br />
                          {m.reply_preview}
                        </div>
                      )}

                      <div>{m.content}</div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 10,
                          marginTop: 5,
                        }}
                      >
                        <button
                          onClick={() =>
                            setPrivateReply({
                              ...m,
                              nickname: mine
                                ? nickname
                                : privatePeer?.nickname,
                            })
                          }
                          style={{
                            border: 0,
                            background: "transparent",
                            color: "#c894dc",
                            padding: 0,
                            fontSize: 9,
                          }}
                        >
                          ↩ RISPONDI
                        </button>

                        <span
                          style={{
                            color: "#8f8197",
                            fontSize: 8,
                          }}
                        >
                          {formatPrivateTime(m.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={privateBottomRef} />
            </div>

            <div style={{ flexShrink: 0 }}>
              <ReplyBox
                data={privateReply}
                cancel={() => setPrivateReply(null)}
              />

              <div
                style={{
                  ...card,
                  padding: 6,
                  display: "flex",
                  gap: 6,
                }}
              >
                <input
                  value={privateMessage}
                  maxLength={1000}
                  onChange={(e) =>
                    setPrivateMessage(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendPrivateMessage();
                    }
                  }}
                  placeholder="Messaggio privato..."
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: "transparent",
                    border: 0,
                    outline: 0,
                    color: "#fff",
                    padding: 9,
                  }}
                />

                <button
                  onClick={sendPrivateMessage}
                  style={{
                    ...purpleButton,
                    width: 43,
                  }}
                >
                  ➤
                </button>
              </div>
            </div>
          </>
        )}

        {chatMode === "public" && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "end",
                justifyContent: "space-between",
                margin: "1px 2px 6px",
                flexShrink: 0,
              }}
            >
              <div>
                <small
                  style={{
                    color: "#c879ef",
                    fontWeight: 900,
                    fontSize: 9,
                  }}
                >
                  CHAT PUBBLICA
                </small>

                <div
                  style={{
                    fontFamily: displayFont,
                    fontSize: 19,
                    marginTop: 1,
                  }}
                >
                  {activeRoom.name}
                </div>
              </div>

              <div style={{ color: C.muted, fontSize: 9 }}>
                ⚡ VIBE {vibe}
              </div>
            </div>

            <div
              style={{
                position: "relative",
                flex: 1,
                minHeight: 0,
              }}
            >
              <div
                ref={publicChatRef}
                onScroll={handlePublicScroll}
                style={{
                  height: "100%",
                  overflowY: "auto",
                  overscrollBehavior: "contain",
                  padding: "2px 1px 8px",
                  scrollbarWidth: "thin",
                }}
              >
                {messages.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      color: C.muted,
                      padding: 30,
                      fontSize: 12,
                    }}
                  >
                    Nessun messaggio ancora.
                    <br />
                    Inizia tu la conversazione.
                  </div>
                )}

                {messages.map((msg) => {
                  const mine = msg.user_id === session.user.id;
                  const positive = myVotes[msg.id] === "like";
                  const negative = myVotes[msg.id] === "dislike";
                  const reported = reportedMessages.includes(msg.id);

                  return (
                    <article
                      key={msg.id}
                      style={{
                        background: mine
                          ? "linear-gradient(90deg,rgba(112,37,150,.13),rgba(112,37,150,.05))"
                          : "rgba(255,255,255,.018)",
                        border:
                          "1px solid rgba(190,100,255,.08)",
                        borderRadius: 12,
                        padding: "7px 7px 6px",
                        marginBottom: 5,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                        }}
                      >
                        <button
                          onClick={() => !mine && requestPrivate(msg)}
                          style={{
                            border: 0,
                            padding: 0,
                            background: "transparent",
                            flexShrink: 0,
                          }}
                        >
                          <Avatar name={msg.avatar} size={32} />
                        </button>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <button
                              onClick={() => mentionUser(msg)}
                              style={{
                                border: 0,
                                background: "transparent",
                                padding: 0,
                                color: mine ? "#f0c7ff" : "#fff",
                                fontWeight: 900,
                                fontSize: 11,
                              }}
                            >
                              @{msg.nickname || "anonimo"}
                            </button>

                            {mine && (
                              <span
                                style={{
                                  color: C.muted,
                                  fontSize: 7,
                                }}
                              >
                                TU
                              </span>
                            )}
                          </div>

                          {msg.reply_to_nickname && (
                            <div
                              style={{
                                marginTop: 3,
                                padding: "3px 6px",
                                borderLeft: "2px solid #c95cff",
                                borderRadius: 5,
                                background:
                                  "rgba(181,76,255,.05)",
                                color: C.muted,
                                fontSize: 8,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              ↩ @{msg.reply_to_nickname}:{" "}
                              {msg.reply_preview}
                            </div>
                          )}

                          <div
                            style={{
                              marginTop: 3,
                              lineHeight: 1.32,
                              fontSize: 13,
                              overflowWrap: "anywhere",
                              color: getMessageColor(
                                msg.message_color
                              ),
                              fontFamily: getMessageFont(
                                msg.message_font
                              ),
                            }}
                          >
                            {renderMessageText(msg.content)}
                          </div>

                          {/* BARRA AZIONI MIGLIORATA */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              flexWrap: "wrap",
                              marginTop: 7,
                              minHeight: 26,
                            }}
                          >
                            <button
                              title="Rispondi"
                              onClick={() => setReplyingTo(msg)}
                              style={tinyButton}
                            >
                              ↩
                            </button>

                            <button
                              title="Menziona"
                              onClick={() => mentionUser(msg)}
                              style={tinyButton}
                            >
                              @
                            </button>

                            {!mine && (
                              <button
                                title="Chat privata"
                                onClick={() => requestPrivate(msg)}
                                style={{
                                  ...tinyButton,
                                  color: "#e6a6ff",
                                  border:
                                    "1px solid rgba(218,120,255,.20)",
                                  background:
                                    "rgba(181,76,255,.07)",
                                }}
                              >
                                ✉ PVT
                              </button>
                            )}

                            <button
                              title="Mi piace"
                              onClick={() =>
                                voteMessage(msg, "like")
                              }
                              style={{
                                ...tinyButton,
                                color: positive
                                  ? C.cyan
                                  : "#a999b1",
                                border: positive
                                  ? "1px solid rgba(100,232,255,.35)"
                                  : "1px solid rgba(190,100,255,.10)",
                                background: positive
                                  ? "rgba(100,232,255,.10)"
                                  : "rgba(255,255,255,.025)",
                              }}
                            >
                              ♡ {Number(msg.likes || 0)}
                            </button>

                            <button
                              title="Non mi piace"
                              onClick={() =>
                                voteMessage(msg, "dislike")
                              }
                              style={{
                                ...tinyButton,
                                color: negative
                                  ? C.pink
                                  : "#a999b1",
                                border: negative
                                  ? "1px solid rgba(239,125,255,.35)"
                                  : "1px solid rgba(190,100,255,.10)",
                                background: negative
                                  ? "rgba(239,125,255,.10)"
                                  : "rgba(255,255,255,.025)",
                              }}
                            >
                              ♢− {Number(msg.dislikes || 0)}
                            </button>

                            {!mine && (
                              <button
                                title={
                                  reported
                                    ? "Già segnalato"
                                    : "Segnala"
                                }
                                disabled={reported}
                                onClick={() => reportMessage(msg)}
                                style={{
                                  ...tinyButton,
                                  marginLeft: "auto",
                                  color: reported
                                    ? "#665b69"
                                    : "#d7839b",
                                  border:
                                    "1px solid rgba(255,114,149,.12)",
                                  background: reported
                                    ? "transparent"
                                    : "rgba(255,114,149,.035)",
                                  opacity: reported ? 0.45 : 1,
                                }}
                              >
                                ⚑
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}

                <div ref={publicBottomRef} />
              </div>

              {showNewMessages && (
                <button
                  onClick={() =>
                    scrollPublicToBottom("smooth")
                  }
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: 8,
                    transform: "translateX(-50%)",
                    border:
                      "1px solid rgba(210,105,255,.55)",
                    borderRadius: 20,
                    background: "rgba(38,16,48,.96)",
                    color: "#f2c3ff",
                    padding: "7px 12px",
                    fontSize: 9,
                    fontWeight: 900,
                    boxShadow:
                      "0 6px 20px rgba(0,0,0,.4)",
                    zIndex: 20,
                  }}
                >
                  ↓ NUOVI MESSAGGI
                </button>
              )}
            </div>

            <div
              style={{
                flexShrink: 0,
                paddingTop: 5,
                background: C.bg,
              }}
            >
              <ReplyBox
                data={replyingTo}
                cancel={() => setReplyingTo(null)}
              />

              <div
                style={{
                  ...card,
                  padding: 5,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  borderRadius: 14,
                  boxShadow:
                    "0 -8px 24px rgba(0,0,0,.28)",
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
                  placeholder="Scrivi qualcosa..."
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: "transparent",
                    border: 0,
                    color: getMessageColor(messageColor),
                    fontFamily: getMessageFont(messageFont),
                    outline: 0,
                    padding: "10px 9px",
                    fontSize: 13,
                  }}
                />

                <button
                  onClick={sendMessage}
                  disabled={sending || !message.trim()}
                  style={{
                    ...purpleButton,
                    width: 42,
                    height: 38,
                    flexShrink: 0,
                    opacity: !message.trim() ? 0.4 : 1,
                  }}
                >
                  {sending ? "…" : "➤"}
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <Nav />
    </main>
  );
}
