"use client";

import { useEffect, useMemo, useState } from "react";
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

  return (
    avatars.find((a) => a.name === name)?.image ||
    "/shadow.png"
  );
}

function roomKey(room) {
  if (room?.room_key) return room.room_key;

  return String(room?.id || "generale")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-");
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

  const [rooms, setRooms] = useState(roomsDefault);
  const [activeRoom, setActiveRoom] = useState(roomsDefault[0]);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [sending, setSending] = useState(false);

  const [chatMode, setChatMode] = useState("public");

  const [requests, setRequests] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [privateConversation, setPrivateConversation] =
    useState(null);
  const [privatePeer, setPrivatePeer] = useState(null);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [privateMessage, setPrivateMessage] = useState("");
  const [privateReply, setPrivateReply] = useState(null);

  const [blocked, setBlocked] = useState([]);

  const [owned, setOwned] = useState([]);

  const isFounder =
    String(profile?.role || "").toUpperCase() === "FOUNDER";

  const currentRoom = roomKey(activeRoom);

  const level = Math.max(1, Math.floor(points / 250) + 1);

  const unreadPrivate = useMemo(
    () =>
      privateMessages.filter(
        (m) =>
          !m.is_read &&
          m.sender_id !== session?.user?.id
      ).length,
    [privateMessages, session]
  );

  const background = {
    minHeight: "100dvh",
    color: C.text,
    fontFamily: font,
    background:
      "radial-gradient(circle at 50% -15%,rgba(137,42,190,.38),transparent 35%),linear-gradient(180deg,#0b0710,#050407)",
    paddingBottom: session && started ? 110 : 25,
  };

  const card = {
    background:
      "linear-gradient(145deg,rgba(27,17,36,.96),rgba(12,8,17,.97))",
    border: `1px solid ${C.border}`,
    borderRadius: 20,
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
    background:
      "linear-gradient(135deg,#9c38cc,#5b1a7d)",
    color: "#fff",
    borderRadius: 14,
    fontWeight: 900,
    fontFamily: font,
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

    loadMessages();
    loadRooms();
    loadInventory();
    loadPrivateData();
    loadBlocks();

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
        loadMessages
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
        loadPrivateData
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
            await loadPrivateMessages(
              privateConversation.id
            );
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session, privateConversation?.id]);

  async function initialize() {
    const { data } = await supabase.auth.getSession();

    const current = data?.session || null;

    setSession(current);

    if (current) {
      await loadProfile(current.user);
    }

    setLoading(false);
  }

  async function loadProfile(user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    if (!data) {
      const username =
        user.user_metadata?.username ||
        user.email?.split("@")[0] ||
        "who_user";

      const created = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          nickname: username,
          avatar: "Shadow",
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

  function applyProfile(data) {
    setProfile(data);
    setNickname(data.nickname || data.username || "");
    setAvatar(data.avatar || "Shadow");
    setPoints(Number(data.who_points ?? 500));
    setVibe(Number(data.vibe ?? 100));
    setReputation(Number(data.reputation ?? 100));
    setDmPrivacy(data.dm_privacy || "vibe");
    setDmMinVibe(Number(data.dm_min_vibe ?? 100));
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

    if (data.session) {
      setSession(data.session);
      await loadProfile(data.user);
    } else {
      setAuthMode("login");
      setAuthError("Account creato. Ora accedi.");
    }
  }

  async function login() {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: internalEmail(nickname),
        password,
      });

    if (error) {
      setAuthError("Nickname o password non corretti.");
      return;
    }

    setSession(data.session);
    await loadProfile(data.user);
  }

  async function logout() {
    await supabase.auth.signOut();

    setSession(null);
    setProfile(null);
    setStarted(false);
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

  async function loadMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("room", currentRoom)
      .order("id", { ascending: true });

    setMessages(data || []);
  }

  async function sendMessage() {
    const text = message.trim();

    if (!text || sending || !session) return;

    setSending(true);

    const mentionMatch = text.match(
      /@([a-z0-9_]{3,20})/i
    );

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
        nickname,
        avatar,
        content: text.slice(0, 500),
        likes: 0,
        dislikes: 0,

        reply_to_id: replyingTo?.id || null,

        reply_to_nickname:
          replyingTo?.nickname || null,

        reply_preview:
          replyingTo?.content?.slice(0, 100) || null,

        mentioned_user_id: mentionedUserId,

        mentioned_nickname:
          mentionedNickname,
      });

    if (error) {
      alert(error.message);
    } else {
      setMessage("");
      setReplyingTo(null);
      await loadMessages();
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
      alert("Impossibile trovare questo utente.");
      return;
    }

    const check = await supabase.rpc(
      "can_private_message",
      {
        target_user: targetId,
      }
    );

    const result = check.data;

    if (!result?.allowed) {
      if (result?.reason === "vibe_too_low") {
        alert(
          `Questo utente richiede almeno ${result.required_vibe} VIBE. Tu ne hai ${result.your_vibe}.`
        );
      } else if (
        result?.reason === "private_disabled"
      ) {
        alert(
          "Questo utente non accetta messaggi privati."
        );
      } else if (result?.reason === "blocked") {
        alert(
          "Il contatto privato non è disponibile."
        );
      } else {
        alert(
          "Non puoi contattare questo utente."
        );
      }

      return;
    }

    const existingConversation =
      conversations.find(
        (c) =>
          c.user_one === targetId ||
          c.user_two === targetId
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

    const [requestResult, conversationResult] =
      await Promise.all([
        supabase
          .from("private_requests")
          .select("*")
          .or(
            `sender_id.eq.${uid},receiver_id.eq.${uid}`
          )
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("private_conversations")
          .select("*")
          .or(
            `user_one.eq.${uid},user_two.eq.${uid}`
          )
          .order("updated_at", {
            ascending: false,
          }),
      ]);

    setRequests(requestResult.data || []);
    setConversations(
      conversationResult.data || []
    );
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

    await loadPrivateMessages(
      conversation.id
    );
  }

  async function openConversationFromList(conv) {
    const uid = session.user.id;

    const peerId =
      conv.user_one === uid
        ? conv.user_two
        : conv.user_one;

    const peer = await supabase
      .from("profiles")
      .select("nickname,avatar")
      .eq("id", peerId)
      .maybeSingle();

    openConversation(
      conv,
      peer.data?.nickname || "WHO",
      peer.data?.avatar || "Shadow",
      peerId
    );
  }

  async function loadPrivateMessages(conversationId) {
    if (!conversationId) return;

    const { data, error } = await supabase
      .from("private_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", {
        ascending: true,
      });

    if (error) return;

    setPrivateMessages(data || []);

    await supabase
      .from("private_messages")
      .update({ is_read: true })
      .eq(
        "conversation_id",
        conversationId
      )
      .neq(
        "sender_id",
        session.user.id
      )
      .eq("is_read", false);
  }

  async function sendPrivateMessage() {
    const text = privateMessage.trim();

    if (
      !text ||
      !privateConversation ||
      !session
    )
      return;

    const { error } = await supabase
      .from("private_messages")
      .insert({
        conversation_id:
          privateConversation.id,

        sender_id: session.user.id,

        content: text.slice(0, 1000),

        reply_to_id:
          privateReply?.id || null,

        reply_to_nickname:
          privateReply?.nickname || null,

        reply_preview:
          privateReply?.content?.slice(
            0,
            100
          ) || null,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setPrivateMessage("");
    setPrivateReply(null);

    await loadPrivateMessages(
      privateConversation.id
    );
  }

  async function blockUser(userId) {
    if (!session || !userId) return;

    if (
      !confirm(
        "Vuoi bloccare questo utente?"
      )
    )
      return;

    const { error } = await supabase
      .from("user_blocks")
      .upsert(
        {
          blocker_id: session.user.id,
          blocked_id: userId,
        },
        {
          onConflict:
            "blocker_id,blocked_id",
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
      .eq(
        "blocker_id",
        session.user.id
      );

    setBlocked(
      (data || []).map(
        (x) => x.blocked_id
      )
    );
  }

  async function loadRooms() {
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("is_active", true)
      .order("created_at", {
        ascending: false,
      });

    const db = data || [];

    const official = db.filter(
      (r) => r.is_official
    );

    const community = db.filter(
      (r) => !r.is_official
    );

    setRooms([
      ...(official.length
        ? official
        : roomsDefault),
      ...community,
    ]);
  }

  async function loadInventory() {
    if (!session) return;

    const { data } = await supabase
      .from("user_inventory")
      .select("item_id")
      .eq(
        "user_id",
        session.user.id
      );

    setOwned(
      (data || []).map(
        (x) => x.item_id
      )
    );
  }

  async function buyItem(item) {
    if (
      owned.includes(item.id) ||
      points < item.price
    ) {
      if (points < item.price)
        alert(
          "WHO Points insufficienti."
        );

      return;
    }

    const newPoints =
      points - item.price;

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

    const inventory =
      await supabase
        .from("user_inventory")
        .insert({
          user_id:
            session.user.id,
          item_id: item.id,
        });

    if (inventory.error) {
      alert(
        inventory.error.message
      );
      return;
    }

    setPoints(newPoints);
    setOwned((old) => [
      ...old,
      item.id,
    ]);
  }

  function Avatar({
    name,
    size = 46,
  }) {
    return (
      <img
        src={avatarImage(name)}
        alt=""
        onError={(e) => {
          e.currentTarget.src =
            "/shadow.png";
        }}
        style={{
          width: size,
          height: size,
          objectFit: "cover",
          borderRadius: "50%",
          border:
            "1px solid rgba(200,100,255,.35)",
        }}
      />
    );
  }

  function Logo() {
    return (
      <div
        style={{
          fontFamily: displayFont,
          fontSize: 44,
          letterSpacing: -4,
          background:
            "linear-gradient(90deg,#fff,#e89cff,#8b55ff,#6eeeff)",
          WebkitBackgroundClip:
            "text",
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
          gridTemplateColumns:
            "repeat(4,1fr)",
          background:
            "rgba(7,5,10,.96)",
          borderTop: `1px solid ${C.border}`,
          padding: "9px 4px 14px",
        }}
      >
        {[
          ["chat", "✦", "Chat"],
          ["rooms", "◉", "Stanze"],
          ["shop", "◇", "Shop"],
          ["profile", "●", "Profilo"],
        ].map(
          ([id, icon, label]) => (
            <button
              key={id}
              onClick={() =>
                setPage(id)
              }
              style={{
                border: 0,
                background:
                  "transparent",
                color:
                  page === id
                    ? "#edaaff"
                    : "#776d7b",
                fontFamily: font,
                fontWeight: 900,
                fontSize: 10,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                }}
              >
                {icon}
              </div>

              {label}
            </button>
          )
        )}
      </nav>
    );
  }

  function ReplyBox({
    data,
    cancel,
  }) {
    if (!data) return null;

    return (
      <div
        style={{
          ...card,
          padding: 9,
          marginBottom: 7,
          display: "flex",
          gap: 8,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <strong
            style={{
              color: "#df9cff",
              fontSize: 10,
            }}
          >
            ↩ @{data.nickname}
          </strong>

          <div
            style={{
              color: C.muted,
              fontSize: 10,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow:
                "ellipsis",
            }}
          >
            {data.content}
          </div>
        </div>

        <button
          onClick={cancel}
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
            padding: "90px 20px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: 30,
            }}
          >
            <Logo />

            <div
              style={{
                color: C.muted,
                marginTop: 10,
              }}
            >
              Nessun nome. Nessun
              giudizio. Solo WHO.
            </div>
          </div>

          <div
            style={{
              ...card,
              padding: 20,
            }}
          >
            <h2>
              {authMode === "login"
                ? "Bentornato in WHO"
                : "Crea il tuo account WHO"}
            </h2>

            <input
              value={nickname}
              onChange={(e) =>
                setNickname(
                  cleanNickname(
                    e.target.value
                  )
                )
              }
              placeholder="Nickname"
              style={input}
            />

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Password"
              style={{
                ...input,
                marginTop: 9,
              }}
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
              onClick={
                authMode === "login"
                  ? login
                  : register
              }
              style={{
                ...purpleButton,
                width: "100%",
                padding: 15,
                marginTop: 14,
              }}
            >
              {authMode === "login"
                ? "ACCEDI"
                : "CREA ACCOUNT"}
            </button>

            <button
              onClick={() => {
                setAuthMode(
                  authMode === "login"
                    ? "register"
                    : "login"
                );

                setAuthError("");
              }}
              style={{
                width: "100%",
                background:
                  "transparent",
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
          <h1>
            Scegli la tua identità
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2,1fr)",
              gap: 10,
            }}
          >
            {available.map((a) => (
              <button
                key={a.name}
                onClick={() =>
                  selectAvatar(a.name)
                }
                style={{
                  ...card,
                  padding: 13,
                }}
              >
                <img
                  src={a.image}
                  alt=""
                  style={{
                    width: 105,
                    height: 105,
                    borderRadius:
                      "50%",
                    objectFit:
                      "cover",
                  }}
                />

                <div
                  style={{
                    color:
                      avatar === a.name
                        ? "#efaaff"
                        : C.muted,
                    marginTop: 8,
                    fontWeight: 900,
                  }}
                >
                  {avatar === a.name
                    ? "✓ SELEZIONATO"
                    : "SCEGLI"}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setStarted(true)
            }
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
              fontFamily:
                displayFont,
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
                setChatMode(
                  "public"
                );
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
                {r.is_private
                  ? "🔒 "
                  : "✦ "}
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
              fontFamily:
                displayFont,
              fontSize: 35,
            }}
          >
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
              gridTemplateColumns:
                "repeat(2,1fr)",
              gap: 10,
            }}
          >
            {shopItems.map(
              (item) => (
                <div
                  key={item.id}
                  style={{
                    ...card,
                    overflow:
                      "hidden",
                  }}
                >
                  <img
                    src={item.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: 160,
                      objectFit:
                        "contain",
                    }}
                  />

                  <div
                    style={{
                      padding: 12,
                    }}
                  >
                    <strong>
                      {item.name}
                    </strong>

                    <div
                      style={{
                        color:
                          "#dc9aff",
                        margin:
                          "8px 0",
                      }}
                    >
                      ✦ {item.price}
                    </div>

                    <button
                      disabled={owned.includes(
                        item.id
                      )}
                      onClick={() =>
                        buyItem(item)
                      }
                      style={{
                        ...purpleButton,
                        width:
                          "100%",
                        padding: 10,
                        opacity:
                          owned.includes(
                            item.id
                          )
                            ? 0.4
                            : 1,
                      }}
                    >
                      {owned.includes(
                        item.id
                      )
                        ? "✓ POSSEDUTO"
                        : "SBLOCCA"}
                    </button>
                  </div>
                </div>
              )
            )}
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
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Avatar
              name={avatar}
              size={130}
            />

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
              gridTemplateColumns:
                "repeat(3,1fr)",
              gap: 8,
              marginTop: 20,
            }}
          >
            <div
              style={{
                ...card,
                padding: 13,
              }}
            >
              <small>POINTS</small>
              <h2>✦ {points}</h2>
            </div>

            <div
              style={{
                ...card,
                padding: 13,
              }}
            >
              <small>VIBE</small>
              <h2>⚡ {vibe}</h2>
            </div>

            <div
              style={{
                ...card,
                padding: 13,
              }}
            >
              <small>LEVEL</small>
              <h2>{level}</h2>
            </div>
          </div>

          <div
            style={{
              ...card,
              padding: 16,
              marginTop: 10,
            }}
          >
            <strong>
              PRIVACY MESSAGGI
            </strong>

            <p
              style={{
                color: C.muted,
                fontSize: 11,
              }}
            >
              Decidi chi può
              inviarti una richiesta
              privata.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3,1fr)",
                gap: 6,
              }}
            >
              {[
                [
                  "everyone",
                  "TUTTI",
                ],
                [
                  "vibe",
                  "VIBE",
                ],
                [
                  "nobody",
                  "NESSUNO",
                ],
              ].map(
                ([value, label]) => (
                  <button
                    key={value}
                    onClick={() =>
                      saveDmSettings(
                        value
                      )
                    }
                    style={{
                      padding: 10,
                      borderRadius:
                        12,
                      border:
                        dmPrivacy ===
                        value
                          ? "1px solid #cf6cff"
                          : `1px solid ${C.border}`,
                      background:
                        dmPrivacy ===
                        value
                          ? "rgba(181,76,255,.18)"
                          : "#0c0910",
                      color:
                        "#fff",
                      fontWeight:
                        900,
                      fontSize: 9,
                    }}
                  >
                    {label}
                  </button>
                )
              )}
            </div>

            {dmPrivacy ===
              "vibe" && (
              <div
                style={{
                  marginTop: 14,
                }}
              >
                <small>
                  VIBE MINIMA PER
                  CONTATTARTI
                </small>

                <input
                  type="number"
                  min="0"
                  value={dmMinVibe}
                  onChange={(e) =>
                    setDmMinVibe(
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                  style={{
                    ...input,
                    marginTop: 7,
                  }}
                />

                <button
                  onClick={() =>
                    saveDmSettings(
                      "vibe",
                      dmMinVibe
                    )
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

          <div
            style={{
              ...card,
              padding: 16,
              marginTop: 10,
            }}
          >
            <strong>
              REPUTAZIONE
            </strong>

            <h3
              style={{
                color: C.green,
              }}
            >
              ✓ IN REGOLA
            </h3>

            <div
              style={{
                color: C.muted,
                fontSize: 11,
              }}
            >
              {reputation}/100
            </div>
          </div>

          <button
            onClick={() =>
              setStarted(
                "identity"
              )
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
              border:
                "1px solid rgba(255,90,130,.3)",
              background:
                "rgba(120,30,55,.15)",
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

  const incomingRequests =
    requests.filter(
      (r) =>
        r.receiver_id ===
          session.user.id &&
        r.status === "pending"
    );

  return (
    <main style={background}>
      <section
        style={{
          maxWidth: 650,
          margin: "0 auto",
          padding: 18,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <Logo />

          <button
            onClick={() =>
              setPage("rooms")
            }
            style={{
              ...card,
              padding: "8px 11px",
            }}
          >
            ◉ Stanze
          </button>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: 7,
            margin: "15px 0",
          }}
        >
          <button
            onClick={() => {
              setChatMode(
                "public"
              );
              setPrivateConversation(
                null
              );
            }}
            style={{
              padding: 12,
              borderRadius: 13,
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
            }}
          >
            ✦ PUBBLICA
          </button>

          <button
            onClick={() => {
              setChatMode(
                "inbox"
              );
              setPrivateConversation(
                null
              );
              loadPrivateData();
            }}
            style={{
              padding: 12,
              borderRadius: 13,
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
            }}
          >
            ✉ PRIVATI
            {incomingRequests.length >
              0 &&
              ` · ${incomingRequests.length}`}
          </button>
        </div>

        {chatMode === "inbox" &&
          !privateConversation && (
            <>
              <h2>
                Richieste
              </h2>

              {incomingRequests.length ===
                0 && (
                <div
                  style={{
                    ...card,
                    padding: 15,
                    color:
                      C.muted,
                  }}
                >
                  Nessuna nuova
                  richiesta.
                </div>
              )}

              {incomingRequests.map(
                (req) => (
                  <div
                    key={req.id}
                    style={{
                      ...card,
                      padding: 13,
                      marginBottom: 8,
                    }}
                  >
                    <strong>
                      Nuova richiesta
                      privata
                    </strong>

                    <div
                      style={{
                        display:
                          "flex",
                        gap: 6,
                        marginTop: 10,
                      }}
                    >
                      <button
                        onClick={() =>
                          acceptRequest(
                            req
                          )
                        }
                        style={{
                          ...purpleButton,
                          flex: 1,
                          padding: 10,
                        }}
                      >
                        ACCETTA
                      </button>

                      <button
                        onClick={() =>
                          declineRequest(
                            req
                          )
                        }
                        style={{
                          flex: 1,
                          padding: 10,
                          borderRadius:
                            12,
                          border:
                            "1px solid rgba(255,100,140,.3)",
                          background:
                            "#160b10",
                          color:
                            "#ff9ab6",
                        }}
                      >
                        RIFIUTA
                      </button>
                    </div>
                  </div>
                )
              )}

              <h2
                style={{
                  marginTop: 25,
                }}
              >
                Conversazioni
              </h2>

              {conversations.length ===
                0 && (
                <div
                  style={{
                    ...card,
                    padding: 15,
                    color:
                      C.muted,
                  }}
                >
                  Nessuna
                  conversazione
                  privata.
                </div>
              )}

              {conversations.map(
                (conv) => (
                  <button
                    key={conv.id}
                    onClick={() =>
                      openConversationFromList(
                        conv
                      )
                    }
                    style={{
                      ...card,
                      width: "100%",
                      padding: 14,
                      marginBottom: 8,
                      textAlign:
                        "left",
                    }}
                  >
                    ✉ Apri
                    conversazione
                  </button>
                )
              )}
            </>
          )}

        {chatMode === "private" &&
          privateConversation && (
            <>
              <div
                style={{
                  ...card,
                  padding: 12,
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <button
                  onClick={() => {
                    setChatMode(
                      "inbox"
                    );
                    setPrivateConversation(
                      null
                    );
                  }}
                  style={{
                    border: 0,
                    background:
                      "transparent",
                    color:
                      "#dda0ff",
                    fontSize: 20,
                  }}
                >
                  ‹
                </button>

                <Avatar
                  name={
                    privatePeer?.avatar
                  }
                />

                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <strong>
                    @
                    {privatePeer?.nickname ||
                      "WHO"}
                  </strong>

                  <div
                    style={{
                      color:
                        C.muted,
                      fontSize: 9,
                    }}
                  >
                    CHAT PRIVATA
                  </div>
                </div>

                <button
                  onClick={() =>
                    blockUser(
                      privatePeer?.id
                    )
                  }
                  style={{
                    border: 0,
                    background:
                      "transparent",
                    color:
                      "#ff879f",
                    fontSize: 10,
                  }}
                >
                  ⊘ BLOCCA
                </button>
              </div>

              {privateMessages.map(
                (m) => {
                  const mine =
                    m.sender_id ===
                    session.user.id;

                  return (
                    <div
                      key={m.id}
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          mine
                            ? "flex-end"
                            : "flex-start",
                        marginBottom: 7,
                      }}
                    >
                      <div
                        style={{
                          maxWidth:
                            "82%",
                          padding:
                            "10px 12px",
                          borderRadius:
                            mine
                              ? "17px 17px 5px 17px"
                              : "17px 17px 17px 5px",
                          background:
                            mine
                              ? "linear-gradient(135deg,#702596,#45145f)"
                              : "#17101f",
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        {m.reply_to_nickname && (
                          <div
                            style={{
                              padding:
                                7,
                              borderLeft:
                                "2px solid #d45fff",
                              background:
                                "rgba(0,0,0,.18)",
                              marginBottom:
                                6,
                              fontSize:
                                9,
                              color:
                                C.muted,
                            }}
                          >
                            ↩ @
                            {
                              m.reply_to_nickname
                            }
                            <br />
                            {
                              m.reply_preview
                            }
                          </div>
                        )}

                        <div>
                          {m.content}
                        </div>

                        <button
                          onClick={() =>
                            setPrivateReply(
                              {
                                ...m,
                                nickname:
                                  mine
                                    ? nickname
                                    : privatePeer?.nickname,
                              }
                            )
                          }
                          style={{
                            border: 0,
                            background:
                              "transparent",
                            color:
                              "#c894dc",
                            padding:
                              "7px 0 0",
                            fontSize:
                              9,
                          }}
                        >
                          ↩ RISPONDI
                        </button>
                      </div>
                    </div>
                  );
                }
              )}

              <ReplyBox
                data={privateReply}
                cancel={() =>
                  setPrivateReply(
                    null
                  )
                }
              />

              <div
                style={{
                  ...card,
                  padding: 7,
                  display: "flex",
                  gap: 6,
                }}
              >
                <input
                  value={
                    privateMessage
                  }
                  onChange={(e) =>
                    setPrivateMessage(
                      e.target
                        .value
                    )
                  }
                  placeholder="Messaggio privato..."
                  style={{
                    flex: 1,
                    background:
                      "transparent",
                    border: 0,
                    outline: 0,
                    color:
                      "#fff",
                    padding: 10,
                  }}
                />

                <button
                  onClick={
                    sendPrivateMessage
                  }
                  style={{
                    ...purpleButton,
                    width: 45,
                  }}
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
                marginBottom: 12,
              }}
            >
              <small
                style={{
                  color:
                    "#c879ef",
                  fontWeight: 900,
                }}
              >
                CHAT PUBBLICA
              </small>

              <h1
                style={{
                  fontFamily:
                    displayFont,
                  margin:
                    "4px 0",
                }}
              >
                {activeRoom.name}
              </h1>
            </div>

            {messages.map(
              (msg) => (
                <article
                  key={msg.id}
                  style={{
                    ...card,
                    padding: 12,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      gap: 9,
                    }}
                  >
                    <button
                      onClick={() =>
                        requestPrivate(
                          msg
                        )
                      }
                      style={{
                        border: 0,
                        padding: 0,
                        background:
                          "transparent",
                      }}
                    >
                      <Avatar
                        name={
                          msg.avatar
                        }
                        size={42}
                      />
                    </button>

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <button
                        onClick={() =>
                          mentionUser(
                            msg
                          )
                        }
                        style={{
                          border: 0,
                          background:
                            "transparent",
                          padding: 0,
                          color:
                            "#fff",
                          fontWeight:
                            900,
                        }}
                      >
                        @
                        {msg.nickname ||
                          "anonimo"}
                      </button>

                      {msg.reply_to_nickname && (
                        <div
                          style={{
                            marginTop:
                              6,
                            padding:
                              7,
                            borderLeft:
                              "2px solid #c95cff",
                            background:
                              "rgba(181,76,255,.07)",
                            color:
                              C.muted,
                            fontSize:
                              10,
                          }}
                        >
                          ↩ @
                          {
                            msg.reply_to_nickname
                          }
                          :{" "}
                          {
                            msg.reply_preview
                          }
                        </div>
                      )}

                      <p
                        style={{
                          lineHeight:
                            1.45,
                          overflowWrap:
                            "anywhere",
                        }}
                      >
                        {msg.content}
                      </p>

                      <div
                        style={{
                          display:
                            "flex",
                          gap: 5,
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <button
                          onClick={() =>
                            setReplyingTo(
                              msg
                            )
                          }
                          style={{
                            border:
                              `1px solid ${C.border}`,
                            background:
                              "#0b0810",
                            color:
                              "#c995df",
                            borderRadius:
                              20,
                            padding:
                              "6px 9px",
                          }}
                        >
                          ↩ Rispondi
                        </button>

                        <button
                          onClick={() =>
                            mentionUser(
                              msg
                            )
                          }
                          style={{
                            border:
                              `1px solid ${C.border}`,
                            background:
                              "#0b0810",
                            color:
                              "#c995df",
                            borderRadius:
                              20,
                            padding:
                              "6px 9px",
                          }}
                        >
                          @ Menziona
                        </button>

                        {msg.user_id !==
                          session.user
                            .id && (
                          <button
                            onClick={() =>
                              requestPrivate(
                                msg
                              )
                            }
                            style={{
                              border:
                                `1px solid ${C.border}`,
                              background:
                                "#0b0810",
                              color:
                                "#e3a3ff",
                              borderRadius:
                                20,
                              padding:
                                "6px 9px",
                            }}
                          >
                            ✉ Privato
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )
            )}

            <div
              style={{
                position: "sticky",
                bottom: 75,
                background:
                  "linear-gradient(transparent,#07050a 25%)",
                paddingTop: 12,
              }}
            >
              <ReplyBox
                data={replyingTo}
                cancel={() =>
                  setReplyingTo(
                    null
                  )
                }
              />

              <div
                style={{
                  ...card,
                  padding: 7,
                  display: "flex",
                  gap: 6,
                }}
              >
                <input
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key ===
                      "Enter"
                    ) {
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
                      "#fff",
                    outline: 0,
                    padding: 10,
                  }}
                />

                <button
                  onClick={
                    sendMessage
                  }
                  disabled={
                    sending ||
                    !message.trim()
                  }
                  style={{
                    ...purpleButton,
                    width: 45,
                    opacity:
                      !message.trim()
                        ? 0.4
                        : 1,
                  }}
                >
                  {sending
                    ? "…"
                    : "➤"}
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
