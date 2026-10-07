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

function makeRoomKey(name) {
  const base = String(name || "room")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 35);

  return `${base || "room"}-${Date.now().toString(36).slice(-6)}`;
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

  const [roomPanel, setRoomPanel] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomPrivate, setRoomPrivate] = useState(false);
  const [roomBusy, setRoomBusy] = useState(false);

  const [roomModerators, setRoomModerators] = useState([]);
  const [moderatorNickname, setModeratorNickname] = useState("");
  const [roomSanctions, setRoomSanctions] = useState([]);

  const [moderationMessage, setModerationMessage] = useState(null);
  const [roomCanModerate, setRoomCanModerate] = useState(false);
  const [myRoomRole, setMyRoomRole] = useState(null);

  const [myRoomStatus, setMyRoomStatus] = useState({
    banned: false,
    muted: false,
    mute_until: null,
  });

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

  // IMPORTANTE: tiene traccia dell'account realmente attivo.
  const lastUserIdRef = useRef(null);

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

  function resetAccountState() {
    setPage("chat");
    setChatMode("public");

    setActiveRoom(roomsDefault[0]);
    setRooms(roomsDefault);

    setRoomPanel(null);
    setRoomName("");
    setRoomDescription("");
    setRoomPrivate(false);
    setRoomBusy(false);

    setRoomModerators([]);
    setModeratorNickname("");
    setRoomSanctions([]);

    setModerationMessage(null);
    setRoomCanModerate(false);
    setMyRoomRole(null);

    setMyRoomStatus({
      banned: false,
      muted: false,
      mute_until: null,
    });

    setMessages([]);
    setMessage("");
    setReplyingTo(null);
    setSending(false);

    setMyVotes({});
    setReportedMessages([]);

    setRequests([]);
    setConversations([]);
    setConversationDetails({});

    setPrivateConversation(null);
    setPrivatePeer(null);
    setPrivateMessages([]);
    setPrivateMessage("");
    setPrivateReply(null);

    setBlocked([]);
    setOwned([]);
    setShowNewMessages(false);

    publicAtBottomRef.current = true;
    firstPublicLoadRef.current = true;
  }

  /* ======================================================
     AUTH CORRETTO
     ====================================================== */

  useEffect(() => {
    let mounted = true;

    async function startAuth() {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      const current = data?.session || null;

      lastUserIdRef.current = current?.user?.id || null;
      setSession(current);
      setLoading(false);
    }

    startAuth();

    const { data: authData } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        const previousUserId = lastUserIdRef.current;
        const newUserId = newSession?.user?.id || null;

        if (previousUserId !== newUserId) {
          resetAccountState();
        }

        lastUserIdRef.current = newUserId;
        setSession(newSession);

        if (!newSession) {
          setProfile(null);
          setStarted(false);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      authData.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    let cancelled = false;

    async function loadCurrentProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        applyProfile(data);
        setStarted(true);
        return;
      }

      await loadProfile(session.user);
    }

    loadCurrentProfile();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session || !started) return;

    firstPublicLoadRef.current = true;
    publicAtBottomRef.current = true;
    setShowNewMessages(false);

    setModerationMessage(null);
    setRoomCanModerate(false);
    setMyRoomRole(null);

    setMyRoomStatus({
      banned: false,
      muted: false,
      mute_until: null,
    });

    loadMessages(true);
    loadRooms();
    loadInventory();
    loadPrivateData();
    loadBlocks();
    loadVotes();
    loadReports();
    loadCurrentRoomPermissions();

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
  }, [session?.user?.id, started, currentRoom, activeRoom?.id]);

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
  }, [session?.user?.id, privateConversation?.id]);

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
        data: { username, nickname: username },
      },
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (data.session && data.user) {
      resetAccountState();
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

    if (!username) {
      setAuthError("Inserisci il nickname.");
      return;
    }

    setAuthError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: internalEmail(username),
      password,
    });

    if (error) {
      setAuthError("Nickname o password non corretti.");
      return;
    }

    setPassword("");
  }

  async function logout() {
    resetAccountState();

    setProfile(null);
    setStarted(false);

    await supabase.auth.signOut();

    lastUserIdRef.current = null;
    setSession(null);

    setNickname("");
    setPassword("");
    setAuthError("");
    setAuthMode("login");

    setAvatar("Shadow");
    setPoints(500);
    setVibe(100);
    setReputation(100);
    setDmPrivacy("vibe");
    setDmMinVibe(100);
    setMessageColor("purple");
    setMessageFont("standard");
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

    if (!error && data) applyProfile(data);
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

    if (error) return alert(error.message);
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

    if (error) return alert(error.message);
    applyProfile(data);
  }

  /* ======================================================
     GRUPPI
     ====================================================== */

  function canManageRoom(room) {
    if (!room || !session) return false;

    return (
      !room.is_official &&
      room.owner_id === session.user.id
    );
  }

  async function createRoom() {
    if (!session || roomBusy) return;

    const name = roomName.trim();

    if (name.length < 3) {
      alert("Nome gruppo minimo 3 caratteri.");
      return;
    }

    setRoomBusy(true);

    const { data, error } = await supabase
      .from("rooms")
      .insert({
        room_key: makeRoomKey(name),
        name: name.slice(0, 40),
        description: roomDescription.trim().slice(0, 160),
        is_private: roomPrivate,
        is_official: false,
        is_active: true,
        owner_id: session.user.id,
      })
      .select()
      .single();

    setRoomBusy(false);

    if (error) {
      alert(error.message);
      return;
    }

    setRoomPanel(null);
    setRoomName("");
    setRoomDescription("");
    setRoomPrivate(false);

    await loadRooms();

    if (data) {
      setActiveRoom(data);
      setPage("chat");
      setChatMode("public");
      firstPublicLoadRef.current = true;
    }
  }

  async function updateRoom() {
    if (!activeRoom || !canManageRoom(activeRoom)) return;

    if (roomName.trim().length < 3) {
      alert("Nome gruppo minimo 3 caratteri.");
      return;
    }

    const { data, error } = await supabase
      .from("rooms")
      .update({
        name: roomName.trim().slice(0, 40),
        description: roomDescription.trim().slice(0, 160),
        is_private: roomPrivate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", activeRoom.id)
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setActiveRoom(data);
    await loadRooms();
    alert("Gruppo aggiornato.");
  }

  async function openRoomManagement(room) {
    if (!canManageRoom(room)) {
      setRoomPanel(null);
      return;
    }

    setActiveRoom(room);
    setRoomName(room.name || "");
    setRoomDescription(room.description || "");
    setRoomPrivate(Boolean(room.is_private));
    setRoomPanel("manage");

    await Promise.all([
      loadRoomModerators(room),
      loadRoomSanctions(room),
    ]);
  }

  async function loadRoomModerators(room = activeRoom) {
    if (!room?.id || String(room.id).startsWith("who-")) {
      setRoomModerators([]);
      return;
    }

    const { data, error } = await supabase
      .from("room_moderators")
      .select("*")
      .eq("room_id", room.id);

    if (error) return;

    const result = [];

    for (const mod of data || []) {
      const p = await supabase
        .from("profiles")
        .select("id,nickname,avatar")
        .eq("id", mod.user_id)
        .maybeSingle();

      result.push({
        ...mod,
        profile: p.data,
      });
    }

    setRoomModerators(result);
  }

  async function addRoomModerator() {
    if (!canManageRoom(activeRoom)) return;

    const nick = cleanNickname(
      moderatorNickname.replace(/^@/, "")
    );

    if (!nick || !activeRoom?.id) return;

    const { error } = await supabase.rpc("add_room_moderator", {
      p_room_id: activeRoom.id,
      p_nickname: nick,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setModeratorNickname("");
    await loadRoomModerators(activeRoom);
    alert(`@${nick} è ora MOD.`);
  }

  async function removeRoomModerator(userId) {
    if (!canManageRoom(activeRoom)) return;
    if (!confirm("Rimuovere questo moderatore?")) return;

    const { error } = await supabase.rpc(
      "remove_room_moderator",
      {
        p_room_id: activeRoom.id,
        p_user_id: userId,
      }
    );

    if (error) return alert(error.message);

    await loadRoomModerators(activeRoom);
  }

  async function loadRoomSanctions(room = activeRoom) {
    if (!room?.id || String(room.id).startsWith("who-")) {
      setRoomSanctions([]);
      return;
    }

    const { data, error } = await supabase
      .from("room_sanctions")
      .select("*")
      .eq("room_id", room.id)
      .order("created_at", { ascending: false });

    if (error) return;

    const result = [];

    for (const item of data || []) {
      const p = await supabase
        .from("profiles")
        .select("id,nickname,avatar")
        .eq("id", item.user_id)
        .maybeSingle();

      result.push({
        ...item,
        profile: p.data,
      });
    }

    setRoomSanctions(result);
  }

  async function loadCurrentRoomPermissions() {
    if (!session || !activeRoom) return;

    setRoomCanModerate(false);
    setMyRoomRole(null);

    setMyRoomStatus({
      banned: false,
      muted: false,
      mute_until: null,
    });

    if (!activeRoom.id || String(activeRoom.id).startsWith("who-")) {
      setRoomCanModerate(isFounder);
      setMyRoomRole(isFounder ? "FOUNDER" : null);
      return;
    }

    const [moderateResult, modResult, statusResult] =
      await Promise.all([
        supabase.rpc("can_moderate_room", {
          p_room_id: activeRoom.id,
          p_user_id: session.user.id,
        }),

        supabase
          .from("room_moderators")
          .select("user_id")
          .eq("room_id", activeRoom.id)
          .eq("user_id", session.user.id)
          .maybeSingle(),

        supabase.rpc("get_my_room_status", {
          p_room_id: activeRoom.id,
        }),
      ]);

    setRoomCanModerate(
      isFounder || Boolean(moderateResult.data)
    );

    if (isFounder) {
      setMyRoomRole("FOUNDER");
    } else if (activeRoom.owner_id === session.user.id) {
      setMyRoomRole("OWNER");
    } else if (modResult.data) {
      setMyRoomRole("MOD");
    } else {
      setMyRoomRole(null);
    }

    if (statusResult.data) {
      setMyRoomStatus({
        banned: Boolean(statusResult.data.banned),
        muted: Boolean(statusResult.data.muted),
        mute_until: statusResult.data.mute_until || null,
      });
    }
  }

  async function banFromRoom(msg) {
    if (!msg?.user_id || !activeRoom?.id) return;
    if (!roomCanModerate) return;

    if (!confirm(`Bannare @${msg.nickname} da questa stanza?`)) {
      return;
    }

    const { error } = await supabase.rpc("ban_room_user", {
      p_room_id: activeRoom.id,
      p_user_id: msg.user_id,
      p_reason: "Moderazione WHO",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setModerationMessage(null);
    alert(`@${msg.nickname} è stato bannato.`);
  }

  async function muteFromRoom(msg, minutes) {
    if (!msg?.user_id || !activeRoom?.id) return;
    if (!roomCanModerate) return;

    const { error } = await supabase.rpc("mute_room_user", {
      p_room_id: activeRoom.id,
      p_user_id: msg.user_id,
      p_minutes: minutes,
      p_reason: "Moderazione WHO",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setModerationMessage(null);

    const labels = {
      10: "10 minuti",
      60: "1 ora",
      1440: "24 ore",
      10080: "7 giorni",
    };

    alert(`@${msg.nickname} silenziato per ${labels[minutes]}.`);
  }

  async function removeRoomSanction(item) {
    if (!roomCanModerate && !canManageRoom(activeRoom)) return;

    const { error } = await supabase.rpc(
      "remove_room_sanction",
      {
        p_room_id: activeRoom.id,
        p_user_id: item.user_id,
        p_type: item.sanction_type,
      }
    );

    if (error) return alert(error.message);

    await loadRoomSanctions(activeRoom);
  }

  async function deleteCommunityRoom(room) {
    if (!canManageRoom(room)) return;

    if (!confirm(`Eliminare il gruppo "${room.name}"?`)) {
      return;
    }

    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", room.id);

    if (error) return alert(error.message);

    setRoomPanel(null);
    setActiveRoom(roomsDefault[0]);
    await loadRooms();
}
    /* ======================================================
     CHAT PUBBLICA
     ====================================================== */

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

    if (nearBottom) setShowNewMessages(false);
  }

  async function loadMessages(forceBottom = false) {
    const wasAtBottom = publicAtBottomRef.current;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room", currentRoom)
      .order("id", { ascending: true });

    if (error) return;

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

    if (myRoomStatus?.banned) {
      alert("Sei stato bannato da questa stanza.");
      return;
    }

    if (myRoomStatus?.muted) {
      alert("Sei temporaneamente silenziato in questa stanza.");
      return;
    }

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

    const { error } = await supabase.from("messages").insert({
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
      await loadCurrentRoomPermissions();
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

    return parts.map((part, index) =>
      /^@[a-zA-Z0-9_]+$/.test(part) ? (
        <span
          key={index}
          style={{ color: C.cyan, fontWeight: 900 }}
        >
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  }

  async function loadVotes() {
    if (!session) return;

    const { data } = await supabase
      .from("message_votes")
      .select("*")
      .eq("user_id", session.user.id);

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

    let error;

    if (existing.data) {
      const r = await supabase
        .from("message_votes")
        .update({ vote })
        .eq("user_id", session.user.id)
        .eq("message_id", msg.id);

      error = r.error;
    } else {
      const r = await supabase.from("message_votes").insert({
        user_id: session.user.id,
        message_id: msg.id,
        vote,
      });

      error = r.error;
    }

    if (error) return alert(error.message);

    let likes = Number(msg.likes || 0);
    let dislikes = Number(msg.dislikes || 0);

    if (oldVote === "like") likes = Math.max(0, likes - 1);
    if (oldVote === "dislike") dislikes = Math.max(0, dislikes - 1);

    if (vote === "like") likes += 1;
    if (vote === "dislike") dislikes += 1;

    await supabase
      .from("messages")
      .update({ likes, dislikes })
      .eq("id", msg.id);

    setMyVotes((old) => ({
      ...old,
      [msg.id]: vote,
    }));

    await loadMessages(false);
  }

  async function loadReports() {
    if (!session) return;

    const { data } = await supabase
      .from("message_reports")
      .select("message_id")
      .eq("user_id", session.user.id);

    setReportedMessages((data || []).map((x) => x.message_id));
  }

  async function reportMessage(msg) {
    if (reportedMessages.includes(msg.id)) {
      alert("Hai già segnalato questo messaggio.");
      return;
    }

    if (!confirm(`Segnalare @${msg.nickname || "anonimo"}?`)) {
      return;
    }

    const { error } = await supabase
      .from("message_reports")
      .insert({
        message_id: msg.id,
        user_id: session.user.id,
        reason: "user_report",
      });

    if (error) return alert(error.message);

    setReportedMessages((old) => [...old, msg.id]);
    alert("Segnalazione inviata.");
  }

  /* ======================================================
     PRIVATI
     ====================================================== */

  async function requestPrivate(msg) {
    if (!session || msg.user_id === session.user.id) return;

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
      alert("Questo messaggio non è collegato a un account.");
      return;
    }

    const check = await supabase.rpc("can_private_message", {
      target_user: targetId,
    });

    const result = check.data;

    if (!result?.allowed) {
      if (result?.reason === "vibe_too_low") {
        alert(
          `Questo utente richiede almeno ${result.required_vibe} VIBE.`
        );
      } else if (result?.reason === "private_disabled") {
        alert("Questo utente non accetta messaggi privati.");
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

    if (error) return alert(error.message);

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

        const [peerResult, lastResult, unreadResult] =
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
              .select("id", { count: "exact", head: true })
              .eq("conversation_id", conv.id)
              .neq("sender_id", uid)
              .eq("is_read", false),
          ]);

        details[conv.id] = {
          peerId,
          nickname: peerResult.data?.nickname || "WHO",
          avatar: peerResult.data?.avatar || "Shadow",
          lastMessage: lastResult.data?.content || "",
          lastMessageAt:
            lastResult.data?.created_at ||
            conv.updated_at ||
            conv.created_at,
          lastSenderId: lastResult.data?.sender_id || null,
          unread: unreadResult.count || 0,
        };
      })
    );

    setConversationDetails(details);
  }

  async function acceptRequest(req) {
    const { data, error } = await supabase.rpc(
      "accept_private_request",
      { request_id: req.id }
    );

    if (error) return alert(error.message);

    await loadPrivateData();

    const { data: conversation } = await supabase
      .from("private_conversations")
      .select("*")
      .eq("id", data)
      .single();

    if (conversation) {
      const peer = await supabase
        .from("profiles")
        .select("nickname,avatar")
        .eq("id", req.sender_id)
        .maybeSingle();

      openConversation(
        conversation,
        peer.data?.nickname || "WHO",
        peer.data?.avatar || "Shadow",
        req.sender_id
      );
    }
  }

  async function declineRequest(req) {
    await supabase
      .from("private_requests")
      .update({
        status: "declined",
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.id);

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
    }
  }

  async function loadPrivateMessages(conversationId) {
    if (!conversationId || !session) return;

    const { data } = await supabase
      .from("private_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

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

    if (error) return alert(error.message);

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

    if (error) return alert(error.message);

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
      .update({ who_points: newPoints })
      .eq("id", session.user.id)
      .select()
      .single();

    if (update.error) return alert(update.error.message);

    const inventory = await supabase
      .from("user_inventory")
      .insert({
        user_id: session.user.id,
        item_id: item.id,
      });

    if (inventory.error) return alert(inventory.error.message);

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
            onClick={() => {
              if (id !== "rooms") setRoomPanel(null);
              setPage(id);
            }}
            style={{
              border: 0,
              background: "transparent",
              color: page === id ? "#edaaff" : "#776d7b",
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
        }}
      >
        <div style={{ flex: 1 }}>
          <strong style={{ color: "#df9cff", fontSize: 10 }}>
            ↩ @{data.nickname}
          </strong>

          <div style={{ color: C.muted, fontSize: 10 }}>
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
            <div style={{ color: C.muted }}>
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
              <div style={{ color: "#ff9ab6", marginTop: 10 }}>
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
              onClick={() =>
                setAuthMode(
                  authMode === "login" ? "register" : "login"
                )
              }
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
    const showManagement =
      roomPanel === "manage" &&
      canManageRoom(activeRoom);

    return (
      <main style={background}>
        <section
          style={{
            maxWidth: 650,
            margin: "0 auto",
            padding: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 style={{ fontFamily: displayFont, fontSize: 35 }}>
              Stanze
            </h1>

            <button
              onClick={() => {
                setRoomName("");
                setRoomDescription("");
                setRoomPrivate(false);
                setRoomPanel("create");
              }}
              style={{
                ...purpleButton,
                padding: "11px 14px",
              }}
            >
              ＋ CREA
            </button>
          </div>

          {roomPanel === "create" && (
            <div style={{ ...card, padding: 16, marginBottom: 15 }}>
              <strong>CREA GRUPPO</strong>

              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Nome gruppo"
                style={{ ...input, marginTop: 12 }}
              />

              <textarea
                value={roomDescription}
                onChange={(e) =>
                  setRoomDescription(e.target.value)
                }
                placeholder="Descrizione"
                style={{
                  ...input,
                  minHeight: 80,
                  marginTop: 8,
                }}
              />

              <button
                onClick={() => setRoomPrivate(!roomPrivate)}
                style={{
                  ...card,
                  width: "100%",
                  padding: 12,
                  marginTop: 8,
                }}
              >
                {roomPrivate ? "🔒 PRIVATO" : "🌐 PUBBLICO"}
              </button>

              <button
                onClick={createRoom}
                disabled={roomBusy}
                style={{
                  ...purpleButton,
                  width: "100%",
                  padding: 13,
                  marginTop: 9,
                }}
              >
                {roomBusy ? "CREAZIONE…" : "CREA GRUPPO"}
              </button>

              <button
                onClick={() => setRoomPanel(null)}
                style={{
                  ...card,
                  width: "100%",
                  padding: 11,
                  marginTop: 7,
                }}
              >
                ANNULLA
              </button>
            </div>
          )}

          {showManagement && (
            <div style={{ ...card, padding: 16, marginBottom: 15 }}>
              <strong>⚙ GESTIONE GRUPPO</strong>

              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                style={{ ...input, marginTop: 12 }}
              />

              <textarea
                value={roomDescription}
                onChange={(e) =>
                  setRoomDescription(e.target.value)
                }
                style={{
                  ...input,
                  minHeight: 75,
                  marginTop: 8,
                }}
              />

              <button
                onClick={() => setRoomPrivate(!roomPrivate)}
                style={{
                  ...card,
                  width: "100%",
                  padding: 11,
                  marginTop: 8,
                }}
              >
                {roomPrivate ? "🔒 PRIVATO" : "🌐 PUBBLICO"}
              </button>

              <button
                onClick={updateRoom}
                style={{
                  ...purpleButton,
                  width: "100%",
                  padding: 12,
                  marginTop: 8,
                }}
              >
                SALVA MODIFICHE
              </button>

              <h3>◆ MODERATORI</h3>

              <div style={{ display: "flex", gap: 6 }}>
                <input
                  value={moderatorNickname}
                  onChange={(e) =>
                    setModeratorNickname(e.target.value)
                  }
                  placeholder="@nickname"
                  style={input}
                />

                <button
                  onClick={addRoomModerator}
                  style={{ ...purpleButton, padding: "0 15px" }}
                >
                  ＋
                </button>
              </div>

              {roomModerators.map((mod) => (
                <div
                  key={mod.user_id}
                  style={{
                    ...card,
                    padding: 9,
                    marginTop: 7,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Avatar
                    name={mod.profile?.avatar || "Shadow"}
                    size={32}
                  />

                  <strong style={{ flex: 1 }}>
                    @{mod.profile?.nickname || "WHO"} · ◆ MOD
                  </strong>

                  <button
                    onClick={() =>
                      removeRoomModerator(mod.user_id)
                    }
                    style={{ ...tinyButton, color: C.red }}
                  >
                    RIMUOVI
                  </button>
                </div>
              ))}

              <h3>⛔ SANZIONI</h3>

              {roomSanctions.length === 0 && (
                <div style={{ color: C.muted, fontSize: 11 }}>
                  Nessuna sanzione attiva.
                </div>
              )}

              {roomSanctions.map((item) => (
                <div
                  key={`${item.user_id}-${item.sanction_type}`}
                  style={{
                    ...card,
                    padding: 10,
                    marginTop: 7,
                  }}
                >
                  <strong>
                    @{item.profile?.nickname || "WHO"}
                  </strong>

                  <div
                    style={{
                      color:
                        item.sanction_type === "BAN"
                          ? C.red
                          : C.pink,
                      marginTop: 4,
                    }}
                  >
                    {item.sanction_type === "BAN"
                      ? "⛔ BANNATO"
                      : "🔇 SILENZIATO"}
                  </div>

                  <button
                    onClick={() => removeRoomSanction(item)}
                    style={{
                      ...tinyButton,
                      color: C.green,
                      marginTop: 7,
                    }}
                  >
                    {item.sanction_type === "BAN"
                      ? "✓ SBANNA"
                      : "✓ RIMUOVI MUTE"}
                  </button>
                </div>
              ))}

              {!activeRoom?.is_official && (
                <button
                  onClick={() =>
                    deleteCommunityRoom(activeRoom)
                  }
                  style={{
                    width: "100%",
                    padding: 12,
                    marginTop: 18,
                    borderRadius: 12,
                    border:
                      "1px solid rgba(255,114,149,.3)",
                    background: "rgba(255,50,90,.07)",
                    color: C.red,
                  }}
                >
                  ELIMINA GRUPPO
                </button>
              )}

              <button
                onClick={() => setRoomPanel(null)}
                style={{
                  ...card,
                  width: "100%",
                  padding: 11,
                  marginTop: 8,
                }}
              >
                CHIUDI
              </button>
            </div>
          )}

          {rooms.map((r) => (
            <div
              key={r.id}
              style={{
                ...card,
                padding: 14,
                marginBottom: 9,
              }}
            >
              <button
                onClick={() => {
                  setRoomPanel(null);
                  setModerationMessage(null);
                  setActiveRoom(r);
                  setPage("chat");
                  setChatMode("public");
                  firstPublicLoadRef.current = true;
                }}
                style={{
                  width: "100%",
                  border: 0,
                  background: "transparent",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                <strong>
                  {r.is_private ? "🔒 " : "✦ "}
                  {r.name}
                </strong>

                {r.is_official && (
                  <span
                    style={{
                      color: C.cyan,
                      fontSize: 8,
                      marginLeft: 7,
                    }}
                  >
                    WHO
                  </span>
                )}

                {r.owner_id === session.user.id && (
                  <span
                    style={{
                      color: "#e8a0ff",
                      fontSize: 8,
                      marginLeft: 7,
                    }}
                  >
                    ♛ OWNER
                  </span>
                )}

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

              {canManageRoom(r) && !r.is_official && (
                <button
                  onClick={() => openRoomManagement(r)}
                  style={{
                    ...tinyButton,
                    color: "#e5a2ff",
                    marginTop: 8,
                  }}
                >
                  ⚙ GESTISCI
                </button>
              )}
            </div>
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
          <h1 style={{ fontFamily: displayFont }}>WHO SHOP</h1>

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
                style={{ ...card, overflow: "hidden" }}
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

            <div
              style={{
                background: "#09070c",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 12,
                marginTop: 12,
                color: getMessageColor(messageColor),
                fontFamily: getMessageFont(messageFont),
              }}
            >
              Questo è il mio stile WHO.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 7,
                marginTop: 12,
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
                    border: `1px solid ${C.border}`,
                    background: "#0c0910",
                    color: getMessageColor(value),
                  }}
                >
                  ● {label}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 7,
                marginTop: 12,
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
                    border: `1px solid ${C.border}`,
                    background: "#0c0910",
                    color: "#fff",
                    fontFamily: getMessageFont(value),
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...card, padding: 16, marginTop: 10 }}>
            <strong>PRIVACY MESSAGGI</strong>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 6,
                marginTop: 10,
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
                    border: `1px solid ${C.border}`,
                    background:
                      dmPrivacy === value
                        ? "rgba(181,76,255,.18)"
                        : "#0c0910",
                    color: "#fff",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...card, padding: 16, marginTop: 10 }}>
            <strong>REPUTAZIONE</strong>

            <h3 style={{ color: C.green }}>✓ IN REGOLA</h3>

            <div style={{ color: C.muted }}>
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
              background: "rgba(120,30,55,.15)",
              color: "#ff9ab6",
              border: "1px solid rgba(255,90,130,.3)",
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
            minHeight: 58,
          }}
        >
          <Logo />

          <button
            onClick={() => {
              setRoomPanel(null);
              setPage("rooms");
            }}
            style={{ ...card, padding: "8px 12px" }}
          >
            ◉ Stanze
          </button>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 7,
            marginBottom: 9,
          }}
        >
          <button
            onClick={() => {
              setChatMode("public");
              setPrivateConversation(null);
            }}
            style={{
              padding: 10,
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              background:
                chatMode === "public"
                  ? "rgba(181,76,255,.17)"
                  : "#0d0911",
              color: "#fff",
              fontWeight: 900,
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
              border: `1px solid ${C.border}`,
              background:
                chatMode !== "public"
                  ? "rgba(181,76,255,.17)"
                  : "#0d0911",
              color: "#fff",
              fontWeight: 900,
            }}
          >
            ✉ PRIVATI
            {incomingRequests.length + totalUnreadPrivate > 0
              ? ` · ${
                  incomingRequests.length + totalUnreadPrivate
                }`
              : ""}
          </button>
        </div>

        {chatMode === "inbox" && !privateConversation && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <h2>Richieste</h2>

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
                      ...card,
                      flex: 1,
                      padding: 10,
                      color: C.red,
                    }}
                  >
                    RIFIUTA
                  </button>
                </div>
              </div>
            ))}

            <h2>Conversazioni</h2>

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
                    display: "flex",
                    gap: 10,
                    textAlign: "left",
                  }}
                >
                  <Avatar
                    name={info?.avatar || "Shadow"}
                    size={45}
                  />

                  <div style={{ flex: 1 }}>
                    <strong>@{info?.nickname || "WHO"}</strong>

                    <div
                      style={{
                        color: C.muted,
                        fontSize: 10,
                      }}
                    >
                      {info?.lastMessage || "Nuova conversazione"}
                    </div>
                  </div>

                  {info?.unread > 0 && (
                    <strong style={{ color: C.pink }}>
                      {info.unread}
                    </strong>
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
              }}
            >
              <button
                onClick={() => {
                  setChatMode("inbox");
                  setPrivateConversation(null);
                }}
                style={{
                  background: "transparent",
                  border: 0,
                  color: "#dda0ff",
                }}
              >
                ‹
              </button>

              <Avatar
                name={privatePeer?.avatar}
                size={36}
              />

              <strong style={{ flex: 1 }}>
                @{privatePeer?.nickname}
              </strong>

              <button
                onClick={() => blockUser(privatePeer?.id)}
                style={{
                  border: 0,
                  background: "transparent",
                  color: C.red,
                }}
              >
                ⊘ BLOCCA
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {privateMessages.map((m) => {
                const mine = m.sender_id === session.user.id;

                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent:
                        mine ? "flex-end" : "flex-start",
                      margin: 7,
                    }}
                  >
                    <div
                      style={{
                        ...card,
                        maxWidth: "82%",
                        padding: 10,
                      }}
                    >
                      {m.content}

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
                          display: "block",
                          border: 0,
                          background: "transparent",
                          color: C.pink,
                          marginTop: 5,
                        }}
                      >
                        ↩ RISPONDI
                      </button>
                    </div>
                  </div>
                );
              })}

              <div ref={privateBottomRef} />
            </div>

            <ReplyBox
              data={privateReply}
              cancel={() => setPrivateReply(null)}
            />

            <div
              style={{
                ...card,
                padding: 6,
                display: "flex",
              }}
            >
              <input
                value={privateMessage}
                onChange={(e) =>
                  setPrivateMessage(e.target.value)
                }
                placeholder="Messaggio privato..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: 0,
                  color: "#fff",
                  outline: 0,
                  padding: 10,
                }}
              />

              <button
                onClick={sendPrivateMessage}
                style={{ ...purpleButton, width: 45 }}
              >
                ➤
              </button>
            </div>
          </>
        )}

        {chatMode === "public" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <div>
                <small style={{ color: "#c879ef" }}>
                  CHAT PUBBLICA
                </small>

                <div
                  style={{
                    fontFamily: displayFont,
                    fontSize: 19,
                  }}
                >
                  {activeRoom.name}
                </div>

                {myRoomRole && (
                  <small style={{ color: "#e8a0ff" }}>
                    {myRoomRole === "FOUNDER"
                      ? "♛ WHO FOUNDER"
                      : myRoomRole === "OWNER"
                      ? "♛ OWNER"
                      : "◆ MOD"}
                  </small>
                )}
              </div>

              <div style={{ color: C.muted, fontSize: 9 }}>
                ⚡ VIBE {vibe}
              </div>
            </div>

            {myRoomStatus?.banned && (
              <div
                style={{
                  ...card,
                  padding: 10,
                  color: C.red,
                  textAlign: "center",
                  marginBottom: 6,
                }}
              >
                ⛔ SEI STATO BANNATO DA QUESTA STANZA
              </div>
            )}

            {!myRoomStatus?.banned && myRoomStatus?.muted && (
              <div
                style={{
                  ...card,
                  padding: 10,
                  color: C.pink,
                  textAlign: "center",
                  marginBottom: 6,
                }}
              >
                🔇 SEI TEMPORANEAMENTE SILENZIATO
              </div>
            )}

            <div
              ref={publicChatRef}
              onScroll={handlePublicScroll}
              style={{
                flex: 1,
                overflowY: "auto",
                minHeight: 0,
              }}
            >
              {messages.map((msg) => {
                const mine = msg.user_id === session.user.id;
                const positive = myVotes[msg.id] === "like";
                const negative = myVotes[msg.id] === "dislike";
                const reported =
                  reportedMessages.includes(msg.id);

                return (
                  <article
                    key={msg.id}
                    style={{
                      background: mine
                        ? "rgba(112,37,150,.10)"
                        : "rgba(255,255,255,.018)",
                      border:
                        "1px solid rgba(190,100,255,.08)",
                      borderRadius: 12,
                      padding: 7,
                      marginBottom: 5,
                    }}
                  >
                    <div style={{ display: "flex", gap: 8 }}>
                      <Avatar name={msg.avatar} size={32} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong>
                          @{msg.nickname || "anonimo"}
                        </strong>

                        <div
                          style={{
                            color: getMessageColor(
                              msg.message_color
                            ),
                            fontFamily: getMessageFont(
                              msg.message_font
                            ),
                            marginTop: 4,
                          }}
                        >
                          {renderMessageText(msg.content)}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 4,
                            flexWrap: "wrap",
                            marginTop: 7,
                          }}
                        >
                          <button
                            onClick={() => setReplyingTo(msg)}
                            style={tinyButton}
                          >
                            ↩
                          </button>

                          <button
                            onClick={() => mentionUser(msg)}
                            style={tinyButton}
                          >
                            @
                          </button>

                          {!mine && (
                            <button
                              onClick={() => requestPrivate(msg)}
                              style={{
                                ...tinyButton,
                                color: "#e6a6ff",
                              }}
                            >
                              ✉ PVT
                            </button>
                          )}

                          <button
                            onClick={() =>
                              voteMessage(msg, "like")
                            }
                            style={{
                              ...tinyButton,
                              color: positive
                                ? C.cyan
                                : "#a999b1",
                            }}
                          >
                            ♡ {Number(msg.likes || 0)}
                          </button>

                          <button
                            onClick={() =>
                              voteMessage(msg, "dislike")
                            }
                            style={{
                              ...tinyButton,
                              color: negative
                                ? C.pink
                                : "#a999b1",
                            }}
                          >
                            ♢− {Number(msg.dislikes || 0)}
                          </button>

                          {!mine && roomCanModerate && (
                            <button
                              onClick={() =>
                                setModerationMessage(
                                  moderationMessage?.id === msg.id
                                    ? null
                                    : msg
                                )
                              }
                              style={{
                                ...tinyButton,
                                color: "#ffad65",
                              }}
                            >
                              ⚙ MOD
                            </button>
                          )}

                          {!mine && (
                            <button
                              disabled={reported}
                              onClick={() => reportMessage(msg)}
                              style={{
                                ...tinyButton,
                                marginLeft: "auto",
                                color: C.red,
                                opacity: reported ? 0.4 : 1,
                              }}
                            >
                              ⚑
                            </button>
                          )}
                        </div>

                        {moderationMessage?.id === msg.id &&
                          roomCanModerate && (
                            <div
                              style={{
                                ...card,
                                padding: 8,
                                marginTop: 7,
                              }}
                            >
                              <div
                                style={{
                                  color: C.muted,
                                  fontSize: 9,
                                  marginBottom: 6,
                                }}
                              >
                                MODERA @{msg.nickname}
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  gap: 5,
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  onClick={() =>
                                    muteFromRoom(msg, 10)
                                  }
                                  style={tinyButton}
                                >
                                  🔇 10 MIN
                                </button>

                                <button
                                  onClick={() =>
                                    muteFromRoom(msg, 60)
                                  }
                                  style={tinyButton}
                                >
                                  🔇 1H
                                </button>

                                <button
                                  onClick={() =>
                                    muteFromRoom(msg, 1440)
                                  }
                                  style={tinyButton}
                                >
                                  🔇 24H
                                </button>

                                <button
                                  onClick={() =>
                                    muteFromRoom(msg, 10080)
                                  }
                                  style={tinyButton}
                                >
                                  🔇 7G
                                </button>

                                <button
                                  onClick={() => banFromRoom(msg)}
                                  style={{
                                    ...tinyButton,
                                    color: C.red,
                                  }}
                                >
                                  ⛔ BAN
                                </button>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </article>
                );
              })}

              <div ref={publicBottomRef} />
            </div>

            <div style={{ paddingTop: 5 }}>
              <ReplyBox
                data={replyingTo}
                cancel={() => setReplyingTo(null)}
              />

              <div
                style={{
                  ...card,
                  padding: 5,
                  display: "flex",
                  gap: 5,
                }}
              >
                <input
                  disabled={
                    myRoomStatus?.banned ||
                    myRoomStatus?.muted
                  }
                  value={message}
                  maxLength={500}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={
                    myRoomStatus?.banned
                      ? "Sei bannato"
                      : myRoomStatus?.muted
                      ? "Sei silenziato"
                      : "Scrivi qualcosa..."
                  }
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: "transparent",
                    border: 0,
                    color: getMessageColor(messageColor),
                    fontFamily: getMessageFont(messageFont),
                    outline: 0,
                    padding: "10px 9px",
                  }}
                />

                <button
                  onClick={sendMessage}
                  disabled={
                    sending ||
                    !message.trim() ||
                    myRoomStatus?.banned ||
                    myRoomStatus?.muted
                  }
                  style={{
                    ...purpleButton,
                    width: 42,
                    opacity:
                      !message.trim() ||
                      myRoomStatus?.banned ||
                      myRoomStatus?.muted
                        ? 0.4
                        : 1,
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
