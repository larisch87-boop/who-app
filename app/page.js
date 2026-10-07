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
    slot: "head",
  },
  {
    id: "void-mask",
    name: "VOID MASK",
    rarity: "LEGENDARY",
    price: 1000,
    image: "/shop/void-mask.png",
    slot: "face",
  },
  {
    id: "glitch-eyes",
    name: "GLITCH EYES",
    rarity: "EPIC",
    price: 750,
    image: "/shop/glitch-eyes.png",
    slot: "face",
  },
  {
    id: "dual-aura",
    name: "DUAL AURA",
    rarity: "EPIC",
    price: 850,
    image: "/shop/dual-aura.png",
    slot: "aura",
  },
  {
    id: "neon-visor",
    name: "NEON VISOR",
    rarity: "EPIC",
    price: 650,
    image: "/shop/neon-visor.png",
    slot: "face",
  },
  {
    id: "nexus-frame",
    name: "NEXUS FRAME",
    rarity: "LIMITED",
    price: 1500,
    image: "/shop/nexus-frame.png",
    slot: "frame",
  },
];

function cleanNickname(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);
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
  const [owned, setOwned] = useState([]);

  const [equipped, setEquipped] = useState({
    head: null,
    face: null,
    aura: null,
    frame: null,
  });

  const [equipmentBusy, setEquipmentBusy] = useState(null);

  // NUOVE FUNZIONI WHO
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newRoomPrivate, setNewRoomPrivate] = useState(false);

  const [dmUser, setDmUser] = useState(null);
  const [dmMessages, setDmMessages] = useState([]);
  const [dmText, setDmText] = useState("");
  const [dmSending, setDmSending] = useState(false);
  const [unreadDM, setUnreadDM] = useState(0);

  const publicChatRef = useRef(null);
  const publicBottomRef = useRef(null);
  const firstPublicLoadRef = useRef(true);

  const isFounder =
    String(profile?.role || "").toUpperCase() === "FOUNDER";

  const currentRoom = roomKey(activeRoom);
  const level = Math.max(1, Math.floor(points / 250) + 1);

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
    fontWeight: 900,
    fontFamily: font,
  };

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

    setEquipped({
      head: data.equipped_head || null,
      face: data.equipped_face || null,
      aura: data.equipped_aura || null,
      frame: data.equipped_frame || null,
    });
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

    applyProfile(data);
    setStarted(true);
  }

  useEffect(() => {
    let mounted = true;

    async function startAuth() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const current = data?.session || null;
      setSession(current);
      setLoading(false);
    }

    startAuth();

    const { data: authData } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
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
    loadProfile(session.user);
  }, [session?.user?.id]);

  // CARICAMENTO IMMEDIATO CHAT + REALTIME
  useEffect(() => {
    if (!session || !started) return;

    firstPublicLoadRef.current = true;

    loadInventory();
    loadMessages(true);
    loadVotes();
    loadReports();
    loadRooms();
    loadUnreadDM();

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, started, currentRoom]);

  // NOTIFICHE PRIVATI REALTIME
  useEffect(() => {
    if (!session?.user?.id || !started) return;

    loadUnreadDM();

    const dmChannel = supabase
      .channel(`who-dm-notifications-${session.user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `receiver_id=eq.${session.user.id}`,
        },
        () => {
          loadUnreadDM();

          if (dmUser) {
            loadDirectMessages(dmUser);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(dmChannel);
    };
  }, [session?.user?.id, started, dmUser?.id]);

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
    await supabase.auth.signOut();

    setSession(null);
    setProfile(null);
    setStarted(false);
    setNickname("");
    setPassword("");
    setAvatar("Shadow");
    setOwned([]);
    setMessages([]);
    setDmMessages([]);
    setUnreadDM(0);

    setEquipped({
      head: null,
      face: null,
      aura: null,
      frame: null,
    });
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

  async function loadInventory() {
    if (!session) return;

    const [inventoryResult, profileResult] = await Promise.all([
      supabase
        .from("user_inventory")
        .select("item_id")
        .eq("user_id", session.user.id),

      supabase
        .from("profiles")
        .select("equipped_head,equipped_face,equipped_aura,equipped_frame")
        .eq("id", session.user.id)
        .single(),
    ]);

    if (!inventoryResult.error) {
      setOwned((inventoryResult.data || []).map((x) => x.item_id));
    }

    if (!profileResult.error && profileResult.data) {
      setEquipped({
        head: profileResult.data.equipped_head || null,
        face: profileResult.data.equipped_face || null,
        aura: profileResult.data.equipped_aura || null,
        frame: profileResult.data.equipped_frame || null,
      });
    }
  }

  async function buyItem(item) {
    if (!session || owned.includes(item.id)) return;

    if (points < item.price) {
      alert("WHO Points insufficienti.");
      return;
    }

    const newPoints = points - item.price;

    const update = await supabase
      .from("profiles")
      .update({
        who_points: newPoints,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)
      .select()
      .single();

    if (update.error) {
      alert(update.error.message);
      return;
    }

    const inventory = await supabase.from("user_inventory").insert({
      user_id: session.user.id,
      item_id: item.id,
    });

    if (inventory.error) {
      alert(inventory.error.message);
      return;
    }

    setPoints(newPoints);
    setOwned((old) => [...old, item.id]);
    alert(`${item.name} aggiunto alla tua collezione.`);
  }

  async function equipItem(item) {
    if (!session || !owned.includes(item.id)) return;

    setEquipmentBusy(item.id);

    const { error } = await supabase.rpc("equip_item", {
      p_item_id: item.id,
    });

    setEquipmentBusy(null);

    if (error) {
      alert(error.message);
      return;
    }

    setEquipped((old) => ({
      ...old,
      [item.slot]: item.id,
    }));

    await loadProfile(session.user);
    alert(`${item.name} equipaggiato.`);
  }

  async function unequipSlot(slot) {
    if (!session) return;

    setEquipmentBusy(`remove-${slot}`);

    const { error } = await supabase.rpc("unequip_item", {
      p_slot: slot,
    });

    setEquipmentBusy(null);

    if (error) {
      alert(error.message);
      return;
    }

    setEquipped((old) => ({
      ...old,
      [slot]: null,
    }));

    await loadProfile(session.user);
  }

  function isItemEquipped(item) {
    return equipped[item.slot] === item.id;
  }

  function Avatar({ name, size = 46, equipment = null }) {
    const eq = equipment || {};

    const head = shopItems.find((x) => x.id === eq.head);
    const face = shopItems.find((x) => x.id === eq.face);
    const aura = shopItems.find((x) => x.id === eq.aura);
    const frame = shopItems.find((x) => x.id === eq.frame);

    const outerSize = size * 1.55;

    return (
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          flexShrink: 0,
          display: "inline-block",
        }}
      >
        {aura && (
          <img
            src={aura.image}
            alt=""
            style={{
              position: "absolute",
              width: outerSize,
              height: outerSize,
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              objectFit: "contain",
              mixBlendMode: "screen",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}

        <img
          src={avatarImage(name)}
          alt=""
          onError={(e) => {
            e.currentTarget.src = "/shadow.png";
          }}
          style={{
            position: "relative",
            zIndex: 2,
            width: size,
            height: size,
            objectFit: "cover",
            borderRadius: "50%",
            border: "1px solid rgba(200,100,255,.35)",
          }}
        />

        {face && (
          <img
            src={face.image}
            alt=""
            style={{
              position: "absolute",
              zIndex: 4,
              width: size * 0.9,
              height: size * 0.9,
              objectFit: "contain",
              left: "50%",
              top: "52%",
              transform: "translate(-50%,-50%)",
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />
        )}

        {head && (
          <img
            src={head.image}
            alt=""
            style={{
              position: "absolute",
              zIndex: 5,
              width: size * 0.85,
              height: size * 0.85,
              objectFit: "contain",
              left: "50%",
              top: "-30%",
              transform: "translateX(-50%)",
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />
        )}

        {frame && (
          <img
            src={frame.image}
            alt=""
            style={{
              position: "absolute",
              zIndex: 6,
              width: size * 1.25,
              height: size * 1.25,
              objectFit: "contain",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    );
  }

  async function loadMessages(forceBottom = false) {
    const room = roomKey(activeRoom);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room", room)
      .order("id", { ascending: true });

    if (error) {
      console.error("WHO loadMessages:", error);
      return;
    }

    setMessages(data || []);

    if (forceBottom || firstPublicLoadRef.current) {
      firstPublicLoadRef.current = false;

      setTimeout(() => {
        publicBottomRef.current?.scrollIntoView({
          behavior: "auto",
        });
      }, 80);
    }
  }

  async function sendMessage() {
    const text = message.trim();

    if (!text || sending || !session) return;

    setSending(true);

    const { error } = await supabase.from("messages").insert({
      room: currentRoom,
      user_id: session.user.id,
      nickname: profile?.nickname || nickname,
      avatar,
      content: text.slice(0, 500),
      likes: 0,
      dislikes: 0,
      message_color: messageColor,
      message_font: messageFont,
      reply_to_id: replyingTo?.id || null,
      reply_to_nickname: replyingTo?.nickname || null,
      reply_preview: replyingTo?.content?.slice(0, 100) || null,
    });

    if (error) {
      alert(error.message);
    } else {
      setMessage("");
      setReplyingTo(null);
      await loadMessages(true);
    }

    setSending(false);
  }

  async function loadVotes() {
    if (!session) return;

    const { data } = await supabase
      .from("message_votes")
      .select("message_id,vote")
      .eq("user_id", session.user.id);

    const map = {};

    (data || []).forEach((v) => {
      map[v.message_id] = Number(v.vote) === 1 ? "like" : "dislike";
    });

    setMyVotes(map);
  }

  async function voteMessage(msg, vote) {
    if (!session || !msg?.id) return;

    const numericVote = vote === "like" ? 1 : -1;

    const { data: existing } = await supabase
      .from("message_votes")
      .select("message_id")
      .eq("user_id", session.user.id)
      .eq("message_id", msg.id)
      .maybeSingle();

    let error;

    if (existing) {
      ({ error } = await supabase
        .from("message_votes")
        .update({ vote: numericVote })
        .eq("user_id", session.user.id)
        .eq("message_id", msg.id));
    } else {
      ({ error } = await supabase.from("message_votes").insert({
        user_id: session.user.id,
        message_id: msg.id,
        vote: numericVote,
      }));
    }

    if (error) {
      alert(error.message);
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

    if (!error) {
      setReportedMessages((data || []).map((x) => x.message_id));
    }
  }

  async function reportMessage(msg) {
    if (!session || reportedMessages.includes(msg.id)) return;

    const { error } = await supabase.from("message_reports").insert({
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

  // PROFILO PUBBLICO UTENTE
  async function openUserProfile(msg) {
    if (!msg?.user_id) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", msg.user_id)
      .maybeSingle();

    if (error || !data) {
      setSelectedUser({
        id: msg.user_id,
        nickname: msg.nickname || "anonimo",
        avatar: msg.avatar || "Shadow",
        vibe: 100,
        reputation: 100,
        who_points: 0,
      });
    } else {
      setSelectedUser(data);
    }

    setShowUserProfile(true);
  }

  function closeUserProfile() {
    setShowUserProfile(false);
    setSelectedUser(null);
  }

  // STANZE COMMUNITY
  async function loadRooms() {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      // Se la tabella non esiste ancora, manteniamo le stanze ufficiali.
      setRooms((old) => (old.length ? old : roomsDefault));
      return;
    }

    const community = (data || []).filter(
      (r) =>
        !roomsDefault.some(
          (d) =>
            d.room_key === r.room_key ||
            String(d.id) === String(r.id)
        )
    );

    setRooms([...roomsDefault, ...community]);
  }

  async function createRoom() {
    if (!session) return;

    const name = newRoomName.trim();

    if (name.length < 3) {
      alert("Il nome della stanza deve avere almeno 3 caratteri.");
      return;
    }

    const newRoom = {
      room_key: makeRoomKey(name),
      name: name.slice(0, 35).toUpperCase(),
      description:
        newRoomDescription.trim().slice(0, 120) ||
        "Stanza della community WHO",
      creator_id: session.user.id,
      creator_nickname: profile?.nickname || nickname,
      is_private: newRoomPrivate,
      is_official: false,
    };

    const { data, error } = await supabase
      .from("rooms")
      .insert(newRoom)
      .select()
      .single();

    if (error) {
      alert(
        "Per attivare le stanze community serve la tabella rooms su Supabase."
      );
      return;
    }

    setRooms((old) => [...old, data]);
    setNewRoomName("");
    setNewRoomDescription("");
    setNewRoomPrivate(false);
    setShowCreateRoom(false);
  }

  // PRIVATI
  async function loadUnreadDM() {
    if (!session?.user?.id) return;

    const { count, error } = await supabase
      .from("direct_messages")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", session.user.id)
      .eq("is_read", false);

    if (!error) {
      setUnreadDM(count || 0);
    }
  }

  async function openPrivateChat(user) {
    if (!user?.id || user.id === session?.user?.id) return;

    setShowUserProfile(false);
    setSelectedUser(null);
    setDmUser(user);
    setPage("dm");

    await loadDirectMessages(user);
  }

  async function loadDirectMessages(user = dmUser) {
    if (!session?.user?.id || !user?.id) return;

    const myId = session.user.id;

    const { data, error } = await supabase
      .from("direct_messages")
      .select("*")
      .or(
        `and(sender_id.eq.${myId},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${myId})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("WHO DM:", error);
      return;
    }

    setDmMessages(data || []);

    await supabase
      .from("direct_messages")
      .update({ is_read: true })
      .eq("sender_id", user.id)
      .eq("receiver_id", myId)
      .eq("is_read", false);

    loadUnreadDM();
  }

  async function sendDirectMessage() {
    const text = dmText.trim();

    if (!text || !dmUser?.id || !session || dmSending) return;

    setDmSending(true);

    const { error } = await supabase.from("direct_messages").insert({
      sender_id: session.user.id,
      receiver_id: dmUser.id,
      sender_nickname: profile?.nickname || nickname,
      sender_avatar: avatar,
      receiver_nickname: dmUser.nickname,
      content: text.slice(0, 500),
      message_color: messageColor,
      message_font: messageFont,
      is_read: false,
    });

    if (error) {
      alert(
        "I messaggi privati richiedono la tabella direct_messages su Supabase."
      );
    } else {
      setDmText("");
      await loadDirectMessages(dmUser);
    }

    setDmSending(false);
  }

  function Logo() {
    return (
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 39,
          fontWeight: 900,
          background:
            "linear-gradient(90deg,#fff,#f0b4ff,#9b63ff,#6eeeff)",
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
            onClick={() => setPage(id)}
            style={{
              position: "relative",
              border: 0,
              background: "transparent",
              color: page === id ? "#edaaff" : "#776d7b",
              fontWeight: 900,
              fontSize: 10,
            }}
          >
            <div style={{ fontSize: 19 }}>{icon}</div>
            {label}

            {id === "chat" && unreadDM > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: "25%",
                  minWidth: 17,
                  height: 17,
                  padding: "0 4px",
                  borderRadius: 20,
                  background: C.red,
                  color: "#fff",
                  fontSize: 9,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {unreadDM > 99 ? "99+" : unreadDM}
              </span>
            )}
          </button>
        ))}
      </nav>
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
                <Avatar
                  name={a.name}
                  size={105}
                  equipment={avatar === a.name ? equipped : null}
                />

                <div
                  style={{
                    color: avatar === a.name ? "#efaaff" : C.muted,
                    marginTop: 12,
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

  // ===== FINE BLOCCO 1/2 =====
  // INCOLLA IL BLOCCO 2/2 ESATTAMENTE QUI SOTTO
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <h1 style={{ fontFamily: displayFont }}>STANZE</h1>

            <button
              onClick={() => setShowCreateRoom(!showCreateRoom)}
              style={{
                ...purpleButton,
                padding: "10px 13px",
              }}
            >
              ＋ CREA
            </button>
          </div>

          {showCreateRoom && (
            <div
              style={{
                ...card,
                padding: 15,
                marginBottom: 14,
              }}
            >
              <strong>CREA UNA STANZA</strong>

              <input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                maxLength={35}
                placeholder="Nome stanza"
                style={{ ...input, marginTop: 12 }}
              />

              <input
                value={newRoomDescription}
                onChange={(e) =>
                  setNewRoomDescription(e.target.value)
                }
                maxLength={120}
                placeholder="Descrizione"
                style={{ ...input, marginTop: 8 }}
              />

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginTop: 12,
                  color: C.muted,
                  fontSize: 11,
                }}
              >
                <input
                  type="checkbox"
                  checked={newRoomPrivate}
                  onChange={(e) =>
                    setNewRoomPrivate(e.target.checked)
                  }
                />
                Stanza privata
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <button
                  onClick={() => setShowCreateRoom(false)}
                  style={{
                    ...card,
                    padding: 11,
                  }}
                >
                  ANNULLA
                </button>

                <button
                  onClick={createRoom}
                  style={{
                    ...purpleButton,
                    padding: 11,
                  }}
                >
                  CREA STANZA
                </button>
              </div>
            </div>
          )}

          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => {
                setActiveRoom(room);
                setMessages([]);
                firstPublicLoadRef.current = true;
                setPage("chat");
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
                {room.is_private ? "🔒 " : "✦ "}
                {room.name}
              </strong>

              <div
                style={{
                  color: C.muted,
                  fontSize: 11,
                  marginTop: 5,
                }}
              >
                {room.description}
              </div>

              {!room.is_official && (
                <div
                  style={{
                    color: "#b46ed1",
                    fontSize: 8,
                    marginTop: 6,
                  }}
                >
                  COMMUNITY
                  {room.creator_nickname
                    ? ` · @${room.creator_nickname}`
                    : ""}
                </div>
              )}
            </button>
          ))}
        </section>

        <Nav />
      </main>
    );
  }

  // CHAT PRIVATA
  if (page === "dm" && dmUser) {
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
            padding: "12px 14px 82px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minHeight: 62,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <button
              onClick={() => {
                setDmUser(null);
                setDmMessages([]);
                setPage("chat");
              }}
              style={{
                ...tinyButton,
                fontSize: 16,
                padding: "5px 10px",
              }}
            >
              ‹
            </button>

            <button
              onClick={() => {
                setSelectedUser(dmUser);
                setShowUserProfile(true);
              }}
              style={{
                border: 0,
                background: "transparent",
                display: "flex",
                alignItems: "center",
                gap: 9,
                color: "#fff",
                textAlign: "left",
              }}
            >
              <Avatar
                name={dmUser.avatar || "Shadow"}
                size={37}
              />

              <div>
                <div
                  style={{
                    color: C.pink,
                    fontSize: 9,
                    fontWeight: 900,
                  }}
                >
                  CHAT PRIVATA
                </div>

                <strong>
                  @{dmUser.nickname || "anonimo"}
                </strong>
              </div>
            </button>
          </header>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              minHeight: 0,
              paddingTop: 10,
            }}
          >
            {dmMessages.length === 0 && (
              <div
                style={{
                  ...card,
                  padding: 18,
                  textAlign: "center",
                  color: C.muted,
                  fontSize: 11,
                  marginTop: 15,
                }}
              >
                Nessun messaggio ancora.
                <br />
                Inizia una conversazione privata con
                {" "}
                <strong>@{dmUser.nickname}</strong>.
              </div>
            )}

            {dmMessages.map((msg) => {
              const mine =
                msg.sender_id === session.user.id;

              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: mine
                      ? "flex-end"
                      : "flex-start",
                    marginBottom: 7,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "82%",
                      background: mine
                        ? "linear-gradient(135deg,rgba(156,56,204,.35),rgba(91,26,125,.30))"
                        : "rgba(255,255,255,.045)",
                      border: `1px solid ${C.border}`,
                      borderRadius: mine
                        ? "15px 15px 4px 15px"
                        : "15px 15px 15px 4px",
                      padding: "9px 11px",
                    }}
                  >
                    {!mine && (
                      <div
                        style={{
                          color: "#df9cff",
                          fontSize: 9,
                          fontWeight: 900,
                          marginBottom: 3,
                        }}
                      >
                        @{msg.sender_nickname ||
                          dmUser.nickname}
                      </div>
                    )}

                    <div
                      style={{
                        color: getMessageColor(
                          msg.message_color
                        ),
                        fontFamily: getMessageFont(
                          msg.message_font
                        ),
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              ...card,
              padding: 5,
              display: "flex",
              gap: 5,
              marginTop: 6,
            }}
          >
            <input
              value={dmText}
              maxLength={500}
              onChange={(e) => setDmText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendDirectMessage();
                }
              }}
              placeholder={`Messaggio privato a @${dmUser.nickname}...`}
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
              onClick={sendDirectMessage}
              disabled={dmSending || !dmText.trim()}
              style={{
                ...purpleButton,
                width: 42,
                opacity: !dmText.trim() ? 0.4 : 1,
              }}
            >
              {dmSending ? "…" : "➤"}
            </button>
          </div>
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
          <h1 style={{ fontFamily: displayFont }}>
            WHO SHOP
          </h1>

          <div
            style={{
              ...card,
              padding: 15,
              marginBottom: 15,
            }}
          >
            ✦ {points} WHO Points
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 10,
            }}
          >
            {shopItems.map((item) => {
              const hasItem = owned.includes(item.id);
              const active = isItemEquipped(item);

              return (
                <div
                  key={item.id}
                  style={{
                    ...card,
                    overflow: "hidden",
                    border: active
                      ? "1px solid rgba(100,232,255,.75)"
                      : card.border,
                    boxShadow: active
                      ? "0 0 22px rgba(181,76,255,.18)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      height: 160,
                      display: "grid",
                      placeItems: "center",
                      background:
                        "radial-gradient(circle,rgba(181,76,255,.08),transparent 65%)",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: 150,
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <div style={{ padding: 12 }}>
                    <strong>{item.name}</strong>

                    <div
                      style={{
                        color:
                          item.rarity === "LIMITED"
                            ? C.cyan
                            : item.rarity === "LEGENDARY"
                            ? "#efb4ff"
                            : "#c68cff",
                        fontSize: 9,
                        fontWeight: 900,
                        marginTop: 4,
                      }}
                    >
                      {item.rarity}
                    </div>

                    <div
                      style={{
                        color: "#dc9aff",
                        margin: "8px 0",
                      }}
                    >
                      ✦ {item.price}
                    </div>

                    {!hasItem ? (
                      <button
                        onClick={() => buyItem(item)}
                        style={{
                          ...purpleButton,
                          width: "100%",
                          padding: 10,
                          opacity:
                            points < item.price ? 0.55 : 1,
                        }}
                      >
                        SBLOCCA
                      </button>
                    ) : active ? (
                      <button
                        disabled={
                          equipmentBusy ===
                          `remove-${item.slot}`
                        }
                        onClick={() =>
                          unequipSlot(item.slot)
                        }
                        style={{
                          width: "100%",
                          padding: 10,
                          borderRadius: 12,
                          border:
                            "1px solid rgba(100,232,255,.45)",
                          background:
                            "rgba(100,232,255,.08)",
                          color: C.cyan,
                          fontWeight: 900,
                        }}
                      >
                        {equipmentBusy ===
                        `remove-${item.slot}`
                          ? "ATTENDI…"
                          : "✓ EQUIPAGGIATO · RIMUOVI"}
                      </button>
                    ) : (
                      <button
                        disabled={
                          equipmentBusy === item.id
                        }
                        onClick={() => equipItem(item)}
                        style={{
                          ...purpleButton,
                          width: "100%",
                          padding: 10,
                        }}
                      >
                        {equipmentBusy === item.id
                          ? "ATTENDI…"
                          : "EQUIPAGGIA"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Nav />
      </main>
    );
  }

  if (page === "profile") {
    const ownedItems = shopItems.filter((item) =>
      owned.includes(item.id)
    );

    return (
      <main style={background}>
        <section
          style={{
            maxWidth: 650,
            margin: "0 auto",
            padding: 20,
          }}
        >
          <div
            style={{
              textAlign: "center",
              paddingTop: 25,
              paddingBottom: 15,
            }}
          >
            <div
              style={{
                minHeight: 185,
                display: "grid",
                placeItems: "center",
              }}
            >
              <Avatar
                name={avatar}
                size={130}
                equipment={equipped}
              />
            </div>

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
              marginTop: 10,
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

          <div
            style={{
              ...card,
              padding: 16,
              marginTop: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>I MIEI ITEM</strong>

              <span
                style={{
                  color: C.muted,
                  fontSize: 10,
                }}
              >
                {ownedItems.length}/6
              </span>
            </div>

            {ownedItems.length === 0 ? (
              <div
                style={{
                  color: C.muted,
                  fontSize: 11,
                  marginTop: 12,
                  lineHeight: 1.5,
                }}
              >
                Non possiedi ancora nessun item.
                Vai nel WHO Shop per sbloccare la tua
                collezione.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                {ownedItems.map((item) => {
                  const active =
                    isItemEquipped(item);

                  return (
                    <div
                      key={item.id}
                      style={{
                        background:
                          "rgba(255,255,255,.025)",
                        border: active
                          ? "1px solid rgba(100,232,255,.55)"
                          : `1px solid ${C.border}`,
                        borderRadius: 14,
                        padding: 9,
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={item.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: 90,
                          objectFit: "contain",
                        }}
                      />

                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 900,
                          marginTop: 4,
                        }}
                      >
                        {item.name}
                      </div>

                      <div
                        style={{
                          color: active
                            ? C.cyan
                            : C.muted,
                          fontSize: 8,
                          marginTop: 4,
                        }}
                      >
                        {active
                          ? "● EQUIPAGGIATO"
                          : item.slot.toUpperCase()}
                      </div>

                      {active ? (
                        <button
                          disabled={
                            equipmentBusy ===
                            `remove-${item.slot}`
                          }
                          onClick={() =>
                            unequipSlot(item.slot)
                          }
                          style={{
                            width: "100%",
                            padding: 8,
                            marginTop: 8,
                            borderRadius: 9,
                            border:
                              "1px solid rgba(255,114,149,.25)",
                            background:
                              "rgba(255,114,149,.06)",
                            color: C.red,
                            fontSize: 9,
                            fontWeight: 900,
                          }}
                        >
                          RIMUOVI
                        </button>
                      ) : (
                        <button
                          disabled={
                            equipmentBusy ===
                            item.id
                          }
                          onClick={() =>
                            equipItem(item)
                          }
                          style={{
                            ...purpleButton,
                            width: "100%",
                            padding: 8,
                            marginTop: 8,
                            fontSize: 9,
                          }}
                        >
                          EQUIPAGGIA
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div
            style={{
              ...card,
              padding: 16,
              marginTop: 10,
            }}
          >
            <strong>EQUIPAGGIAMENTO ATTIVO</strong>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 7,
                marginTop: 12,
              }}
            >
              {[
                ["head", "👑 TESTA"],
                ["face", "◈ VISO"],
                ["aura", "✦ AURA"],
                ["frame", "◇ CORNICE"],
              ].map(([slot, label]) => {
                const item = shopItems.find(
                  (x) =>
                    x.id === equipped[slot]
                );

                return (
                  <div
                    key={slot}
                    style={{
                      background: "#09070c",
                      border: `1px solid ${C.border}`,
                      borderRadius: 11,
                      padding: 10,
                    }}
                  >
                    <div
                      style={{
                        color: C.muted,
                        fontSize: 8,
                      }}
                    >
                      {label}
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 9,
                        marginTop: 4,
                        color: item
                          ? C.cyan
                          : "#716777",
                      }}
                    >
                      {item
                        ? item.name
                        : "VUOTO"}
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              ...card,
              padding: 16,
              marginTop: 10,
            }}
          >
            <strong>STILE MESSAGGI</strong>

            <div
              style={{
                background: "#09070c",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 12,
                marginTop: 12,
                color:
                  getMessageColor(messageColor),
                fontFamily:
                  getMessageFont(messageFont),
              }}
            >
              Questo è il mio stile WHO.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3,1fr)",
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
                  onClick={async () => {
                    setMessageColor(value);

                    await supabase
                      .from("profiles")
                      .update({
                        message_color: value,
                      })
                      .eq(
                        "id",
                        session.user.id
                      );
                  }}
                  style={{
                    padding: 10,
                    borderRadius: 11,
                    border: `1px solid ${C.border}`,
                    background: "#0c0910",
                    color:
                      getMessageColor(value),
                  }}
                >
                  ● {label}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2,1fr)",
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
                  onClick={async () => {
                    setMessageFont(value);

                    await supabase
                      .from("profiles")
                      .update({
                        message_font: value,
                      })
                      .eq(
                        "id",
                        session.user.id
                      );
                  }}
                  style={{
                    padding: 11,
                    borderRadius: 11,
                    border: `1px solid ${C.border}`,
                    background: "#0c0910",
                    color: "#fff",
                    fontFamily:
                      getMessageFont(value),
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              ...card,
              padding: 16,
              marginTop: 10,
            }}
          >
            <strong>REPUTAZIONE</strong>

            <h3 style={{ color: C.green }}>
              ✓ IN REGOLA
            </h3>

            <div style={{ color: C.muted }}>
              {reputation}/100
            </div>
          </div>

          <button
            onClick={() =>
              setStarted("identity")
            }
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
              background:
                "rgba(120,30,55,.15)",
              color: "#ff9ab6",
              border:
                "1px solid rgba(255,90,130,.3)",
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
            justifyContent:
              "space-between",
            alignItems: "center",
            minHeight: 58,
          }}
        >
          <Logo />

          <div
            style={{
              display: "flex",
              gap: 6,
            }}
          >
            <button
              onClick={() => {
                if (unreadDM > 0) {
                  alert(
                    `Hai ${unreadDM} messagg${
                      unreadDM === 1 ? "io" : "i"
                    } privat${
                      unreadDM === 1 ? "o" : "i"
                    } non lett${
                      unreadDM === 1 ? "o" : "i"
                    }. Apri il profilo di un utente per entrare nella chat privata.`
                  );
                } else {
                  alert(
                    "Nessun nuovo messaggio privato."
                  );
                }
              }}
              style={{
                ...card,
                padding: "8px 10px",
                position: "relative",
              }}
            >
              ✉

              {unreadDM > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -7,
                    right: -7,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 20,
                    background: C.red,
                    color: "#fff",
                    fontSize: 9,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {unreadDM > 99
                    ? "99+"
                    : unreadDM}
                </span>
              )}
            </button>

            <button
              onClick={() =>
                setPage("rooms")
              }
              style={{
                ...card,
                padding: "8px 12px",
              }}
            >
              ◉ Stanze
            </button>
          </div>
        </header>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: 8,
          }}
        >
          <div>
            <small
              style={{ color: "#c879ef" }}
            >
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
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Avatar
              name={avatar}
              size={32}
              equipment={equipped}
            />

            <div
              style={{
                color: C.muted,
                fontSize: 9,
              }}
            >
              ⚡ {vibe}
            </div>
          </div>
        </div>

        <div
          ref={publicChatRef}
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                color: C.muted,
                textAlign: "center",
                fontSize: 10,
                padding: 20,
              }}
            >
              Nessun messaggio in questa
              stanza.
            </div>
          )}

          {messages.map((msg) => {
            const mine =
              msg.user_id ===
              session.user.id;

            const positive =
              myVotes[msg.id] === "like";

            const negative =
              myVotes[msg.id] ===
              "dislike";

            const reported =
              reportedMessages.includes(
                msg.id
              );

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
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <button
                    disabled={mine}
                    onClick={() =>
                      !mine &&
                      openUserProfile(msg)
                    }
                    style={{
                      padding: 0,
                      border: 0,
                      background:
                        "transparent",
                      height: 32,
                    }}
                  >
                    <Avatar
                      name={msg.avatar}
                      size={32}
                      equipment={
                        mine
                          ? equipped
                          : null
                      }
                    />
                  </button>

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <button
                      disabled={mine}
                      onClick={() =>
                        !mine &&
                        openUserProfile(msg)
                      }
                      style={{
                        border: 0,
                        padding: 0,
                        background:
                          "transparent",
                        color: "#fff",
                        fontWeight: 900,
                        fontFamily: font,
                      }}
                    >
                      @
                      {msg.nickname ||
                        "anonimo"}
                    </button>

                    {msg.reply_to_nickname && (
                      <div
                        style={{
                          color: C.muted,
                          fontSize: 9,
                          marginTop: 3,
                          paddingLeft: 6,
                          borderLeft:
                            "2px solid rgba(181,76,255,.5)",
                        }}
                      >
                        ↩ @
                        {
                          msg.reply_to_nickname
                        }
                        {msg.reply_preview
                          ? ` · ${msg.reply_preview}`
                          : ""}
                      </div>
                    )}

                    <div
                      style={{
                        color:
                          getMessageColor(
                            msg.message_color
                          ),
                        fontFamily:
                          getMessageFont(
                            msg.message_font
                          ),
                        marginTop: 4,
                        wordBreak:
                          "break-word",
                      }}
                    >
                      {msg.content}
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
                        onClick={() =>
                          setReplyingTo(msg)
                        }
                        style={tinyButton}
                      >
                        ↩
                      </button>

                      {!mine && (
                        <button
                          onClick={() =>
                            openUserProfile(
                              msg
                            )
                          }
                          style={{
                            ...tinyButton,
                            color:
                              "#df9cff",
                          }}
                        >
                          ● PROFILO
                        </button>
                      )}

                      {!mine && (
                        <button
                          onClick={() =>
                            openPrivateChat({
                              id: msg.user_id,
                              nickname:
                                msg.nickname,
                              avatar:
                                msg.avatar,
                            })
                          }
                          style={{
                            ...tinyButton,
                            color: C.cyan,
                          }}
                        >
                          ✉ PRIVATO
                        </button>
                      )}

                      <button
                        onClick={() =>
                          voteMessage(
                            msg,
                            "like"
                          )
                        }
                        style={{
                          ...tinyButton,
                          color: positive
                            ? C.cyan
                            : "#a999b1",
                        }}
                      >
                        ♡{" "}
                        {Number(
                          msg.likes || 0
                        )}
                      </button>

                      <button
                        onClick={() =>
                          voteMessage(
                            msg,
                            "dislike"
                          )
                        }
                        style={{
                          ...tinyButton,
                          color: negative
                            ? C.pink
                            : "#a999b1",
                        }}
                      >
                        ♢−{" "}
                        {Number(
                          msg.dislikes || 0
                        )}
                      </button>

                      {!mine && (
                        <button
                          disabled={reported}
                          onClick={() =>
                            reportMessage(msg)
                          }
                          style={{
                            ...tinyButton,
                            marginLeft:
                              "auto",
                            color: C.red,
                            opacity: reported
                              ? 0.4
                              : 1,
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

        {replyingTo && (
          <div
            style={{
              background:
                "rgba(181,76,255,.08)",
              borderLeft:
                "2px solid #c75cff",
              borderRadius: 10,
              padding: "7px 9px",
              marginTop: 5,
              marginBottom: 4,
              display: "flex",
            }}
          >
            <div style={{ flex: 1 }}>
              <strong
                style={{
                  color: "#df9cff",
                  fontSize: 10,
                }}
              >
                ↩ @{replyingTo.nickname}
              </strong>

              <div
                style={{
                  color: C.muted,
                  fontSize: 10,
                }}
              >
                {replyingTo.content}
              </div>
            </div>

            <button
              onClick={() =>
                setReplyingTo(null)
              }
              style={{
                border: 0,
                background:
                  "transparent",
                color: "#aaa",
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div style={{ paddingTop: 5 }}>
          <div
            style={{
              ...card,
              padding: 5,
              display: "flex",
              gap: 5,
            }}
          >
            <input
              value={message}
              maxLength={500}
              onChange={(e) =>
                setMessage(e.target.value)
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
              placeholder="Scrivi qualcosa..."
              style={{
                flex: 1,
                minWidth: 0,
                background:
                  "transparent",
                border: 0,
                color:
                  getMessageColor(
                    messageColor
                  ),
                fontFamily:
                  getMessageFont(
                    messageFont
                  ),
                outline: 0,
                padding: "10px 9px",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={
                sending ||
                !message.trim()
              }
              style={{
                ...purpleButton,
                width: 42,
                opacity:
                  !message.trim()
                    ? 0.4
                    : 1,
              }}
            >
              {sending ? "…" : "➤"}
            </button>
          </div>
        </div>
      </section>

      {showUserProfile &&
        selectedUser && (
          <div
            onClick={closeUserProfile}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 500,
              background:
                "rgba(0,0,0,.78)",
              display: "grid",
              placeItems: "center",
              padding: 18,
            }}
          >
            <div
              onClick={(e) =>
                e.stopPropagation()
              }
              style={{
                ...card,
                width: "100%",
                maxWidth: 390,
                padding: 20,
                textAlign: "center",
                boxShadow:
                  "0 0 50px rgba(181,76,255,.18)",
              }}
            >
              <button
                onClick={
                  closeUserProfile
                }
                style={{
                  float: "right",
                  border: 0,
                  background:
                    "transparent",
                  color: C.muted,
                  fontSize: 18,
                }}
              >
                ✕
              </button>

              <div
                style={{
                  paddingTop: 15,
                  minHeight: 125,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Avatar
                  name={
                    selectedUser.avatar ||
                    "Shadow"
                  }
                  size={105}
                />
              </div>

              <h2
                style={{
                  marginBottom: 4,
                }}
              >
                @
                {selectedUser.nickname ||
                  "anonimo"}
              </h2>

              {String(
                selectedUser.role || ""
              ).toUpperCase() ===
                "FOUNDER" && (
                <div
                  style={{
                    color:
                      "#e8a0ff",
                    fontWeight: 900,
                    fontSize: 11,
                  }}
                >
                  ♛ WHO FOUNDER
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3,1fr)",
                  gap: 7,
                  marginTop: 18,
                }}
              >
                <div
                  style={{
                    background:
                      "#09070c",
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: 10,
                  }}
                >
                  <small
                    style={{
                      color: C.muted,
                    }}
                  >
                    VIBE
                  </small>
                  <strong
                    style={{
                      display:
                        "block",
                      marginTop: 4,
                    }}
                  >
                    ⚡{" "}
                    {Number(
                      selectedUser.vibe ??
                        100
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    background:
                      "#09070c",
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: 10,
                  }}
                >
                  <small
                    style={{
                      color: C.muted,
                    }}
                  >
                    LEVEL
                  </small>
                  <strong
                    style={{
                      display:
                        "block",
                      marginTop: 4,
                    }}
                  >
                    {Math.max(
                      1,
                      Math.floor(
                        Number(
                          selectedUser.who_points ??
                            0
                        ) / 250
                      ) + 1
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    background:
                      "#09070c",
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: 10,
                  }}
                >
                  <small
                    style={{
                      color: C.muted,
                    }}
                  >
                    REP
                  </small>
                  <strong
                    style={{
                      display:
                        "block",
                      marginTop: 4,
                      color: C.green,
                    }}
                  >
                    {Number(
                      selectedUser.reputation ??
                        100
                    )}
                  </strong>
                </div>
              </div>

              {selectedUser.id !==
                session.user.id && (
                <button
                  onClick={() =>
                    openPrivateChat(
                      selectedUser
                    )
                  }
                  style={{
                    ...purpleButton,
                    width: "100%",
                    padding: 14,
                    marginTop: 16,
                  }}
                >
                  ✉ MESSAGGIO PRIVATO
                </button>
              )}

              <button
                onClick={
                  closeUserProfile
                }
                style={{
                  ...card,
                  width: "100%",
                  padding: 12,
                  marginTop: 8,
                }}
              >
                CHIUDI
              </button>
            </div>
          </div>
        )}

      <Nav />
    </main>
  );
                }
