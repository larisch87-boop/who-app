
"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const C = {
  bg: "#07050a",
  panel: "#100b16",
  purple: "#b54cff",
  pink: "#ef7dff",
  cyan: "#64e8ff",
  text: "#f8f4fb",
  muted: "#978b9f",
  border: "rgba(190,100,255,.20)",
  green: "#61e5a4",
  red: "#ff7295",
  gold: "#ffd36b"
};

const font = '"Trebuchet MS",Inter,system-ui,sans-serif';
const displayFont = '"Arial Black","Trebuchet MS",sans-serif';

const avatars = [
  "Shadow", "Pixie", "King", "Azra", "Zero", "Luna",
  "Ranger", "Neon", "Ares", "Vix", "Nova", "Ghost"
].map(name => ({
  name,
  image: `/${name.toLowerCase()}.png`
}));

const ownerAvatar = {
  name: "UNKNOWN",
  image: "/file_000000005e3881f4b9b9109dab033a80.png"
};

const roomsDefault = [
  ["who-general", "generale", "WHO GENERAL", "La community principale di WHO"],
  ["night-who", "night-who", "NIGHT WHO", "Chat notturna"],
  ["gaming", "gaming", "GAMING", "Gaming community"],
  ["music", "music", "MUSIC", "Musica e nuove scoperte"],
  ["meet-people", "meet-people", "MEET PEOPLE", "Conosci nuove persone"]
].map(r => ({
  id: r[0],
  room_key: r[1],
  name: r[2],
  description: r[3],
  is_official: true,
  is_private: false
}));

const messageColors = {
  purple: "#e4a7ff",
  cyan: "#64e8ff",
  pink: "#ff8fda",
  red: "#ff728f",
  green: "#61e5a4",
  white: "#f8f4fb"
};

const messageFonts = {
  standard: font,
  tech: '"Courier New",Courier,monospace',
  bold: 'Impact,"Arial Black",sans-serif',
  elegant: 'Georgia,"Times New Roman",serif'
};

const cleanNickname = s =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 20);

const internalEmail = n =>
  `${cleanNickname(n)}@account.who.local`;

const roomKey = r =>
  r?.room_key || String(r?.id || "generale");

const avatarImage = name =>
  name === "UNKNOWN"
    ? ownerAvatar.image
    : avatars.find(x => x.name === name)?.image || "/shadow.png";

const getMessageColor = x =>
  messageColors[x] || messageColors.purple;

const getMessageFont = x =>
  messageFonts[x] || messageFonts.standard;

const messageStyle = m => ({
  color: getMessageColor(m.message_color),
  fontFamily: getMessageFont(m.message_font),
  fontWeight: m.message_font === "bold" ? 900 : 400,
  fontStyle: m.message_font === "elegant" ? "italic" : "normal",
  overflowWrap: "anywhere"
});

const panel = {
  background: "linear-gradient(145deg,#1b1124,#0c0811)",
  border: `1px solid ${C.border}`,
  borderRadius: 18,
  color: C.text
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: 13,
  background: "#08060b",
  color: "#fff",
  border: `1px solid ${C.border}`,
  borderRadius: 13,
  outline: 0,
  fontFamily: font
};

const buttonStyle = {
  background: "linear-gradient(135deg,#9c38cc,#5b1a7d)",
  border: "1px solid rgba(220,110,255,.55)",
  borderRadius: 12,
  padding: "11px 14px",
  color: "#fff",
  fontWeight: 900,
  fontFamily: font,
  cursor: "pointer"
};

const secondaryButton = {
  background: "#130d19",
  border: `1px solid ${C.border}`,
  borderRadius: 11,
  padding: "9px 11px",
  color: "#e5c4ee",
  fontWeight: 800,
  cursor: "pointer"
};

const fmt = n => Number(n || 0).toLocaleString("it-IT");

function AvatarView({ name = "Shadow", size = 46 }) {
  return (
    <img
      src={avatarImage(name)}
      alt={name}
      onError={e => {
        if (!e.currentTarget.src.endsWith("/shadow.png")) {
          e.currentTarget.src = "/shadow.png";
        }
      }}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid rgba(200,100,255,.35)",
        boxShadow: "0 0 12px rgba(181,76,255,.15)"
      }}
    />
  );
}

function Logo() {
  return (
    <div style={{
      fontFamily: displayFont,
      fontSize: 39,
      fontWeight: 900,
      background: "linear-gradient(90deg,#fff,#f0b4ff,#9b63ff,#6eeeff)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    }}>
      WHO
    </div>
  );
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
  const [selectedUser, setSelectedUser] = useState(null);

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newRoomPrivate, setNewRoomPrivate] = useState(false);

  const [dmUser, setDmUser] = useState(null);
  const [dmMessages, setDmMessages] = useState([]);
  const [dmText, setDmText] = useState("");
  const [dmSending, setDmSending] = useState(false);
  const [unreadDM, setUnreadDM] = useState(0);
  const [conversations, setConversations] = useState([]);

  const [online, setOnline] = useState({});
  const [newMessages, setNewMessages] = useState(0);
  const [notice, setNotice] = useState("");

  const [ranking, setRanking] = useState([]);
  const [weeklyRanking, setWeeklyRanking] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState("");
  const [rankingTab, setRankingTab] = useState("global");
  const [myRank, setMyRank] = useState(null);
  const [myWeeklyRank, setMyWeeklyRank] = useState(null);

  const [founderVerified, setFounderVerified] = useState(false);
  const [founderChecking, setFounderChecking] = useState(false);
  const [founderReports, setFounderReports] = useState([]);
  const [founderError, setFounderError] = useState("");
  const [founderBusy, setFounderBusy] = useState(false);
  const [founderPenalties, setFounderPenalties] = useState({});

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const publicChatRef = useRef(null);
  const dmChatRef = useRef(null);
  const nearBottomRef = useRef(true);
  const lastMessageRef = useRef(null);
  const presenceRef = useRef(null);
  const roomRef = useRef("generale");

  const uid = session?.user?.id;
  const currentRoom = roomKey(activeRoom);
  const isFounder = founderVerified;
  const level = Math.max(1, Math.floor(points / 250) + 1);

  const background = {
    minHeight: "100dvh",
    color: C.text,
    fontFamily: font,
    background: "radial-gradient(circle at 50% -15%,rgba(137,42,190,.38),transparent 35%),linear-gradient(180deg,#0b0710,#050407)",
    paddingBottom: session && started ? 90 : 25
  };

  function alertUser(text) {
    setNotice(String(text));
  }

  function applyProfile(p) {
    setProfile(p);
    setNickname(p.nickname || p.username || "");
    setAvatar(p.avatar || "Shadow");
    setPoints(Number(p.who_points ?? 500));
    setVibe(Number(p.vibe ?? 100));
    setReputation(Number(p.reputation ?? 100));
    setDmPrivacy(p.dm_privacy || "vibe");
    setDmMinVibe(Number(p.dm_min_vibe ?? 100));
    setMessageColor(p.message_color || "purple");
    setMessageFont(p.message_font || "standard");
  }

  async function refreshProfile() {
    if (!uid) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .maybeSingle();
    if (!error && data) applyProfile(data);
  }

  async function loadProfile(user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      alertUser(error.message);
      return;
    }

    if (data) {
      applyProfile(data);
      setStarted(true);
      return;
    }

    alertUser("Profilo non ancora disponibile: controlla il trigger di creazione profili su Supabase.");
  }

  useEffect(() => {
    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session || null);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) {
        setProfile(null);
        setStarted(false);
        setFounderVerified(false);
      }
      setLoading(false);
    });

    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (uid) loadProfile(session.user);
    else setFounderVerified(false);
  }, [uid]);

  async function checkFounder() {
    if (!uid) {
      setFounderVerified(false);
      return;
    }

    setFounderChecking(true);
    const { data, error } = await supabase
      .from("who_founders")
      .select("user_id")
      .eq("user_id", uid)
      .maybeSingle();

    setFounderVerified(!error && !!data);
    setFounderChecking(false);

    if (error) {
      console.error("WHO Founder:", error.message);
    }
  }

  useEffect(() => {
    if (uid) checkFounder();
  }, [uid]);

  async function changePassword() {
    if (passwordBusy) return;

    if (!oldPassword || !newPassword || !confirmPassword) {
      alertUser("Compila tutti i campi della password.");
      return;
    }

    if (newPassword.length < 12) {
      alertUser("La nuova password deve avere almeno 12 caratteri.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alertUser("Le nuove password non coincidono.");
      return;
    }

    if (newPassword === oldPassword) {
      alertUser("Scegli una password diversa da quella temporanea.");
      return;
    }

    setPasswordBusy(true);

    try {
      const email = session?.user?.email;

      if (!email) throw new Error("Email dell'account non disponibile.");

      const verification = await supabase.auth.signInWithPassword({
        email,
        password: oldPassword
      });

      if (verification.error) {
        throw new Error("La password attuale non è corretta.");
      }

      const result = await supabase.auth.updateUser({
        password: newPassword
      });

      if (result.error) throw result.error;

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      alertUser("Password aggiornata. Conserva la nuova password in un posto sicuro.");
    } catch (error) {
      alertUser(error.message || "Impossibile aggiornare la password.");
    } finally {
      setPasswordBusy(false);
    }
  }

  async function register() {
    const name = cleanNickname(nickname);

    if (name.length < 3) {
      setAuthError("Nickname minimo 3 caratteri.");
      return;
    }

    if (password.length < 8) {
      setAuthError("Password minimo 8 caratteri.");
      return;
    }

    setAuthError("");

    const { data, error } = await supabase.auth.signUp({
      email: internalEmail(name),
      password,
      options: {
        data: { username: name, nickname: name }
      }
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (data.session && data.user) {
      await loadProfile(data.user);
    } else {
      setAuthMode("login");
      setAuthError("Account creato. Ora prova ad accedere.");
    }

    setPassword("");
  }

  async function login() {
    const name = cleanNickname(nickname);

    if (!name) {
      setAuthError("Inserisci il nickname.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: internalEmail(name),
      password
    });

    if (error) {
      setAuthError("Nickname o password non corretti.");
      return;
    }

    setPassword("");
  }

  async function logout() {
    await supabase.auth.signOut();
    setProfile(null);
    setStarted(false);
    setPage("chat");
    setNickname("");
    setPassword("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessages([]);
    setDmMessages([]);
    setDmUser(null);
    setConversations([]);
    setUnreadDM(0);
    setRanking([]);
    setWeeklyRanking([]);
    setMyRank(null);
    setMyWeeklyRank(null);
    setFounderVerified(false);
  }

  async function selectAvatar(name) {
    if (!uid) return;
    if (name === "UNKNOWN" && !isFounder) return;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        avatar: name,
        updated_at: new Date().toISOString()
      })
      .eq("id", uid)
      .select()
      .single();

    if (error) {
      alertUser(error.message);
      return;
    }

    applyProfile(data);
  }

  async function loadRanking() {
    if (!uid) return;

    setRankingLoading(true);
    setRankingError("");

    try {
      const [globalResult, weeklyResult] = await Promise.all([
        supabase.from("who_leaderboard")
          .select("*").order("position", { ascending: true }).limit(100),
        supabase.rpc("who_weekly_ranking")
      ]);

      if (globalResult.error) throw globalResult.error;
      if (weeklyResult.error) throw weeklyResult.error;

      const global = (globalResult.data || []).map((u, i) => ({
        ...u,
        id: u.user_id || u.id,
        rank: Number(u.position || i + 1),
        who_points: Number(u.who_points || 0)
      }));

      const weekly = (weeklyResult.data || []).map((u, i) => ({
        ...u,
        id: u.user_id,
        rank: i + 1,
        weekly_points: Number(u.weekly_points || 0)
      }));

      setRanking(global);
      setWeeklyRanking(weekly);

      const gi = global.findIndex(u => u.id === uid);
      const wi = weekly.findIndex(u => u.id === uid);

      setMyRank(gi < 0 ? null : gi + 1);
      setMyWeeklyRank(wi < 0 ? null : wi + 1);

      await refreshProfile();
    } catch (e) {
      setRankingError(e.message || "Classifica non disponibile");
    } finally {
      setRankingLoading(false);
    }
  }

  useEffect(() => {
    if (page !== "ranking" || !uid || started !== true) return;
    loadRanking();
    const timer = setInterval(loadRanking, 30000);
    return () => clearInterval(timer);
  }, [page, uid, started]);

  useEffect(() => {
    if (!uid || started !== true) return;
    refreshProfile();
    const timer = setInterval(refreshProfile, 15000);
    return () => clearInterval(timer);
  }, [uid, started]);

  // CONTINUA NEL BLOCCO 2/4
  async function loadRooms() {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error) {
      setRooms([
        ...roomsDefault,
        ...(data || []).filter(
          r => !roomsDefault.some(d => d.room_key === r.room_key)
        )
      ]);
    }
  }

  async function createRoom() {
    const name = newRoomName.trim();
    if (name.length < 3) {
      alertUser("Nome stanza minimo 3 caratteri.");
      return;
    }

    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").slice(0, 30);

    const { data, error } = await supabase.from("rooms").insert({
      room_key: `${slug}-${Date.now().toString(36)}`,
      name: name.slice(0, 35).toUpperCase(),
      description: newRoomDescription.slice(0, 120),
      creator_id: uid,
      creator_nickname: profile?.nickname || nickname,
      is_private: newRoomPrivate,
      is_official: false
    }).select().single();

    if (error) {
      alertUser(error.message);
      return;
    }

    setRooms(old => [...old, data]);
    setShowCreateRoom(false);
    setNewRoomName("");
    setNewRoomDescription("");
    setNewRoomPrivate(false);
  }

  async function loadMessages() {
    const target = roomRef.current;
    const { data, error } = await supabase.from("messages")
      .select("*")
      .eq("room", target)
      .order("id", { ascending: false })
      .limit(300);

    if (error) {
      console.error("WHO messages:", error);
      return;
    }

    if (roomRef.current === target) {
      setMessages((data || []).reverse());
    }
  }

  async function sendMessage() {
    const text = message.trim();
    if (!uid || !text || sending) return;

    setSending(true);

    const { error } = await supabase.from("messages").insert({
      room: currentRoom,
      user_id: uid,
      nickname: profile?.nickname || nickname,
      avatar,
      content: text.slice(0, 500),
      likes: 0,
      dislikes: 0,
      message_color: messageColor,
      message_font: messageFont,
      reply_to_id: replyingTo?.id || null,
      reply_to_nickname: replyingTo?.nickname || null,
      reply_preview: replyingTo?.content?.slice(0, 100) || null
    });

    setSending(false);

    if (error) {
      alertUser(error.message);
      return;
    }

    setMessage("");
    setReplyingTo(null);
    nearBottomRef.current = true;
    await Promise.all([loadMessages(), refreshProfile()]);
  }

  async function loadVotes() {
    if (!uid) return;

    const { data, error } = await supabase
      .from("message_votes")
      .select("message_id,vote")
      .eq("user_id", uid);

    if (!error) {
      setMyVotes(Object.fromEntries(
        (data || []).map(x => [
          x.message_id,
          Number(x.vote) === 1 ? "like" : "dislike"
        ])
      ));
    }
  }

  async function voteMessage(msg, vote) {
    if (!uid || msg.user_id === uid) return;

    const { error } = await supabase
      .from("message_votes")
      .upsert({
        message_id: msg.id,
        user_id: uid,
        vote: vote === "like" ? 1 : -1
      }, { onConflict: "message_id,user_id" });

    if (error) {
      alertUser(error.message);
      return;
    }

    setMyVotes(old => ({ ...old, [msg.id]: vote }));
    await loadMessages();
  }

  async function loadReports() {
    if (!uid) return;

    const { data, error } = await supabase
      .from("message_reports")
      .select("message_id")
      .eq("reporter_id", uid);

    if (!error) {
      setReportedMessages((data || []).map(x => x.message_id));
    }
  }

  async function reportMessage(msg) {
    if (
      !uid ||
      msg.user_id === uid ||
      reportedMessages.includes(msg.id)
    ) return;

    const { error } = await supabase
      .from("message_reports")
      .insert({
        message_id: msg.id,
        reporter_id: uid,
        reason: "user_report"
      });

    if (error) {
      alertUser(error.message);
      return;
    }

    setReportedMessages(old => [...old, msg.id]);
    alertUser(
      "Segnalazione ricevuta. Nessuna penalità automatica."
    );
  }

  async function openUserProfile(msg) {
    if (!msg?.user_id) return;

    const { data } = await supabase.from("profiles")
      .select("*")
      .eq("id", msg.user_id)
      .maybeSingle();

    setSelectedUser(data || {
      id: msg.user_id,
      nickname: msg.nickname,
      avatar: msg.avatar,
      vibe: 100,
      reputation: 100,
      who_points: 0
    });
  }

  async function loadInbox() {
    if (!uid) return;

    const { data, error } = await supabase
      .from("direct_messages")
      .select("*")
      .or(`sender_id.eq.${uid},receiver_id.eq.${uid}`)
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) return;

    const all = data || [];

    setUnreadDM(
      all.filter(m => m.receiver_id === uid && !m.is_read).length
    );

    const peers = new Map();

    for (const m of all) {
      const other = m.sender_id === uid
        ? m.receiver_id : m.sender_id;

      if (!peers.has(other)) {
        peers.set(other, {
          id: other,
          nickname: m.sender_id === uid
            ? m.receiver_nickname : m.sender_nickname,
          avatar: m.sender_id === uid
            ? "Shadow" : m.sender_avatar,
          last: m.content,
          unread: 0
        });
      }

      if (m.receiver_id === uid && !m.is_read) {
        peers.get(other).unread++;
      }
    }

    setConversations([...peers.values()]);
  }

  async function loadDirectMessages(user) {
    if (!uid || !user?.id) return;

    const { data, error } = await supabase
      .from("direct_messages")
      .select("*")
      .or(
        `and(sender_id.eq.${uid},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${uid})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("WHO DM:", error);
      return;
    }

    setDmMessages(data || []);

    await supabase.from("direct_messages")
      .update({ is_read: true })
      .eq("sender_id", user.id)
      .eq("receiver_id", uid)
      .eq("is_read", false);

    await loadInbox();
  }

  async function openPrivateChat(user) {
    if (!user?.id || user.id === uid) return;

    setSelectedUser(null);
    setDmUser(user);
    setDmMessages([]);
    setPage("dm");
  }

  async function sendDirectMessage() {
    const text = dmText.trim();
    if (!text || !dmUser?.id || !uid || dmSending) return;

    setDmSending(true);

    const { error } = await supabase
      .from("direct_messages")
      .insert({
        sender_id: uid,
        receiver_id: dmUser.id,
        sender_nickname: profile?.nickname || nickname,
        sender_avatar: avatar,
        receiver_nickname: dmUser.nickname,
        content: text.slice(0, 500),
        message_color: messageColor,
        message_font: messageFont,
        is_read: false
      });

    setDmSending(false);

    if (error) {
      alertUser(error.message);
      return;
    }

    setDmText("");
    await loadDirectMessages(dmUser);
  }

  async function saveStyle(field, value) {
    if (!uid) return;

    const { error } = await supabase.from("profiles")
      .update({ [field]: value })
      .eq("id", uid);

    if (error) {
      alertUser(error.message);
      return;
    }

    if (field === "message_color") setMessageColor(value);
    else setMessageFont(value);
  }

  useEffect(() => {
    if (!uid || started !== true) return;
    loadRooms();
    loadVotes();
    loadReports();
    loadInbox();
  }, [uid, started]);

  useEffect(() => {
    if (!uid || started !== true) return;

    roomRef.current = currentRoom;
    setMessages([]);
    setNewMessages(0);
    lastMessageRef.current = null;
    nearBottomRef.current = true;

    loadMessages();

    const ch = supabase.channel(`who-public-${currentRoom}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "messages",
        filter: `room=eq.${currentRoom}`
      }, () => loadMessages())
      .subscribe();

    const timer = setInterval(loadMessages, 5000);

    return () => {
      clearInterval(timer);
      supabase.removeChannel(ch);
    };
  }, [uid, started, currentRoom]);

  useEffect(() => {
    if (!uid || started !== true) return;

    loadInbox();

    const ch = supabase.channel(`who-inbox-${uid}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "direct_messages",
        filter: `receiver_id=eq.${uid}`
      }, () => loadInbox())
      .subscribe();

    const timer = setInterval(loadInbox, 6000);

    return () => {
      clearInterval(timer);
      supabase.removeChannel(ch);
    };
  }, [uid, started]);

  useEffect(() => {
    if (page !== "dm" || !dmUser?.id || !uid) return;

    loadDirectMessages(dmUser);

    const timer = setInterval(
      () => loadDirectMessages(dmUser), 5000
    );

    return () => clearInterval(timer);
  }, [page, dmUser?.id, uid]);

  useEffect(() => {
    if (!uid || started !== true) return;

    const ch = supabase.channel("who-global-presence", {
      config: { presence: { key: uid } }
    });

    presenceRef.current = ch;

    ch.on("presence", { event: "sync" }, () => {
      const result = {};

      for (const entries of Object.values(ch.presenceState())) {
        for (const p of entries) {
          if (p.user_id) result[p.user_id] = p.room;
        }
      }

      setOnline(result);
    }).subscribe(async status => {
      if (status === "SUBSCRIBED") {
        await ch.track({
          user_id: uid,
          room: roomRef.current
        });
      }
    });

    return () => {
      presenceRef.current = null;
      supabase.removeChannel(ch);
    };
  }, [uid, started]);

  useEffect(() => {
    if (uid && presenceRef.current) {
      presenceRef.current.track({
        user_id: uid,
        room: currentRoom
      });
    }
  }, [uid, currentRoom]);

  useEffect(() => {
    const el = publicChatRef.current;
    if (!el || page !== "chat") return;

    const last = messages[messages.length - 1]?.id;

    if (last !== lastMessageRef.current) {
      if (
        lastMessageRef.current !== null &&
        !nearBottomRef.current
      ) {
        setNewMessages(n => n + 1);
      } else {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
        });
      }

      lastMessageRef.current = last;
    }
  }, [messages, page]);

  useEffect(() => {
    if (page === "dm" && dmChatRef.current) {
      dmChatRef.current.scrollTop =
        dmChatRef.current.scrollHeight;
    }
  }, [dmMessages, page]);

  async function loadFounderReports() {
    if (!isFounder) return;

    setFounderError("");

    const { data, error } = await supabase
      .from("message_reports")
      .select("*")
      .eq("status", "pending")
      .order("id", { ascending: false })
      .limit(100);

    if (error) {
      setFounderError(error.message);
      return;
    }

    const ids = [
      ...new Set(
        (data || [])
          .map(r => r.message_id)
          .filter(x => x != null)
      )
    ];

    let lookup = {};

    if (ids.length) {
      const res = await supabase
        .from("messages")
        .select("id,user_id,nickname,content,room")
        .in("id", ids);

      if (res.error) {
        setFounderError(res.error.message);
      } else {
        lookup = Object.fromEntries(
          (res.data || []).map(m => [m.id, m])
        );
      }
    }

    setFounderReports((data || []).map(r => ({
      ...r,
      reportedMessage: lookup[r.message_id] || null
    })));
  }

  async function reviewFounderReport(report, approve) {
    if (!isFounder || founderBusy) return;

    const penalty = approve
      ? Number(founderPenalties[report.id] ?? 0)
      : 0;

    if (
      !Number.isInteger(penalty) ||
      penalty < 0 ||
      penalty > 100
    ) {
      alertUser("Penalità ammessa: da 0 a 100 WHO Points.");
      return;
    }

    if (
      approve &&
      !report.reportedMessage
    ) {
      alertUser("Impossibile approvare senza verificare il messaggio.");
      return;
    }

    if (!window.confirm(
      approve
        ? `Confermi la segnalazione #${report.id} e la penalità di ${penalty} punti?`
        : `Rifiutare la segnalazione #${report.id}?`
    )) return;

    setFounderBusy(true);

    const { data, error } = await supabase.rpc(
      "who_founder_review_report",
      {
        p_report_id: report.id,
        p_approve: approve,
        p_penalty: penalty
      }
    );

    setFounderBusy(false);

    if (error) {
      alertUser(error.message);
      return;
    }

    alertUser(data || "Segnalazione gestita.");

    await Promise.all([
      loadFounderReports(),
      refreshProfile()
    ]);
  }

  useEffect(() => {
    if (page !== "founder" || !isFounder || !uid) return;

    loadFounderReports();

    const timer = setInterval(loadFounderReports, 20000);
    return () => clearInterval(timer);
  }, [page, isFounder, uid]);

  function Nav() {
    return <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      background: "rgba(7,5,10,.98)",
      borderTop: `1px solid ${C.border}`,
      padding: "8px 2px 12px"
    }}>
      {[
        ["chat", "✦", "Chat"],
        ["inbox", "✉", "Privati"],
        ["rooms", "◉", "Stanze"],
        ["ranking", "🏆", "Ranking"],
        ["profile", "●", "Profilo"]
      ].map(([id, symbol, label]) =>
        <button key={id}
          onClick={() => setPage(id)}
          style={{
            position: "relative",
            border: 0,
            background: "transparent",
            color: page === id ? "#edaaff" : "#776d7b",
            fontWeight: 900,
            fontSize: 10,
            cursor: "pointer"
          }}>
          <div style={{ fontSize: 19 }}>{symbol}</div>
          {label}
          {id === "inbox" && unreadDM > 0 &&
            <span style={{
              position: "absolute",
              top: -3,
              right: "12%",
              borderRadius: 20,
              background: C.red,
              color: "white",
              padding: "2px 5px",
              fontSize: 9
            }}>
              {unreadDM > 99 ? "99+" : unreadDM}
            </span>}
        </button>
      )}
    </nav>;
  }

  function Notice() {
    if (!notice) return null;

    return <div role="alert" style={{
      position: "fixed",
      bottom: 95,
      left: 14,
      right: 14,
      maxWidth: 600,
      margin: "auto",
      zIndex: 900,
      ...panel,
      padding: 15,
      border: `1px solid ${C.pink}`,
      boxShadow: "0 0 30px rgba(0,0,0,.8)"
    }}>
      <strong style={{ color: C.pink }}>WHO</strong>
      <p style={{
        fontSize: 12,
        overflowWrap: "anywhere",
        whiteSpace: "pre-wrap"
      }}>
        {notice}
      </p>
      <button style={buttonStyle}
        onClick={() => setNotice("")}>
        OK
      </button>
    </div>;
  }

  // CONTINUA NEL BLOCCO 3/4
  if (loading) {
    return <main style={{
      ...background,
      display: "grid",
      placeItems: "center"
    }}>
      <Logo/>
    </main>;
  }

  if (!session) {
    return <main style={background}>
      <section style={{
        maxWidth: 420,
        margin: "auto",
        padding: "75px 20px"
      }}>
        <div style={{ textAlign: "center", marginBottom: 25 }}>
          <Logo/>
          <p style={{ color: C.muted }}>
            Nessun nome. Nessun giudizio. Solo WHO.
          </p>
        </div>

        <div style={{ ...panel, padding: 20 }}>
          <h2>
            {authMode === "login"
              ? "Bentornato in WHO"
              : "Crea il tuo account WHO"}
          </h2>

          <input
            style={inputStyle}
            placeholder="Nickname"
            value={nickname}
            onChange={e =>
              setNickname(cleanNickname(e.target.value))
            }
          />

          <input
            style={{ ...inputStyle, marginTop: 9 }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                (authMode === "login" ? login : register)();
              }
            }}
          />

          {authError &&
            <p style={{ color: C.red }}>{authError}</p>}

          <button
            style={{
              ...buttonStyle,
              width: "100%",
              marginTop: 14
            }}
            onClick={authMode === "login" ? login : register}
          >
            {authMode === "login" ? "ACCEDI" : "CREA ACCOUNT"}
          </button>

          <button
            style={{
              ...secondaryButton,
              width: "100%",
              marginTop: 10
            }}
            onClick={() => {
              setAuthMode(
                authMode === "login" ? "register" : "login"
              );
              setAuthError("");
            }}
          >
            {authMode === "login"
              ? "Non hai un account? Registrati"
              : "Hai già un account? Accedi"}
          </button>
        </div>
      </section>
      <Notice/>
    </main>;
  }

  if (started === "identity") {
    return <main style={background}>
      <section style={{
        maxWidth: 650,
        margin: "auto",
        padding: 18
      }}>
        <h1>Scegli la tua identità</h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 10
        }}>
          {[...(isFounder ? [ownerAvatar] : []), ...avatars]
            .map(a =>
              <button
                key={a.name}
                onClick={() => selectAvatar(a.name)}
                style={{
                  ...panel,
                  padding: 13,
                  textAlign: "center",
                  cursor: "pointer",
                  border: avatar === a.name
                    ? `1px solid ${C.cyan}`
                    : panel.border
                }}
              >
                <AvatarView name={a.name} size={105}/>
                <div style={{
                  marginTop: 12,
                  color: C.pink,
                  fontWeight: 900
                }}>
                  {a.name}
                </div>
                <div style={{
                  fontSize: 11,
                  color: C.muted,
                  marginTop: 5
                }}>
                  {avatar === a.name
                    ? "✓ SELEZIONATO"
                    : "SCEGLI"}
                </div>
              </button>
            )}
        </div>

        <button
          style={{
            ...buttonStyle,
            width: "100%",
            marginTop: 15,
            padding: 16
          }}
          onClick={() => setStarted(true)}
        >
          CONTINUA →
        </button>
      </section>
      <Notice/>
    </main>;
  }

  if (page === "rooms") {
    return <main style={background}>
      <section style={{
        maxWidth: 650,
        margin: "auto",
        padding: 18
      }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10
        }}>
          <h1 style={{ fontFamily: displayFont }}>STANZE</h1>
          <button
            style={buttonStyle}
            onClick={() =>
              setShowCreateRoom(!showCreateRoom)
            }
          >
            ＋ CREA
          </button>
        </header>

        <div style={{
          ...panel,
          padding: 13,
          marginBottom: 12,
          color: C.green,
          fontSize: 12
        }}>
          ● {Object.keys(online).length} utenti online su WHO
        </div>

        {showCreateRoom &&
          <div style={{
            ...panel,
            padding: 15,
            marginBottom: 14
          }}>
            <h3>CREA UNA STANZA</h3>

            <input
              style={inputStyle}
              placeholder="Nome stanza"
              maxLength={35}
              value={newRoomName}
              onChange={e => setNewRoomName(e.target.value)}
            />

            <input
              style={{ ...inputStyle, marginTop: 8 }}
              placeholder="Descrizione"
              maxLength={120}
              value={newRoomDescription}
              onChange={e =>
                setNewRoomDescription(e.target.value)
              }
            />

            <label style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              margin: "12px 0",
              color: C.muted
            }}>
              <input
                type="checkbox"
                checked={newRoomPrivate}
                onChange={e =>
                  setNewRoomPrivate(e.target.checked)
                }
              />
              Stanza privata
            </label>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={secondaryButton}
                onClick={() => setShowCreateRoom(false)}
              >
                ANNULLA
              </button>
              <button style={buttonStyle} onClick={createRoom}>
                CREA STANZA
              </button>
            </div>
          </div>}

        {rooms.map(r =>
          <button
            key={r.id}
            style={{
              ...panel,
              width: "100%",
              padding: 15,
              textAlign: "left",
              marginBottom: 9
            }}
            onClick={() => {
              if (
                r.is_private &&
                !r.is_official &&
                r.creator_id !== uid
              ) {
                alertUser(
                  "Questa stanza è privata. L'accesso richiede un sistema di inviti."
                );
                return;
              }
              setActiveRoom(r);
              setPage("chat");
            }}
          >
            <strong>
              {r.is_private ? "🔒" : "✦"} {r.name}
            </strong>
            <p style={{
              fontSize: 11,
              color: C.muted,
              margin: "6px 0"
            }}>
              {r.description}
            </p>
            <small style={{ color: C.cyan }}>
              {Object.values(online)
                .filter(x => x === roomKey(r)).length}
              {" "}online · {r.is_official
                ? "UFFICIALE" : "COMMUNITY"}
            </small>
          </button>
        )}
      </section>
      <Notice/>
      <Nav/>
    </main>;
  }

  if (page === "inbox") {
    return <main style={background}>
      <section style={{
        maxWidth: 650,
        margin: "auto",
        padding: 18
      }}>
        <h1 style={{ fontFamily: displayFont }}>
          MESSAGGI PRIVATI
        </h1>
        <p style={{ color: C.muted, fontSize: 12 }}>
          Le tue conversazioni e i messaggi non letti.
        </p>

        <button
          style={{
            ...secondaryButton,
            marginBottom: 14
          }}
          onClick={loadInbox}
        >
          ↻ AGGIORNA
        </button>

        {conversations.length === 0 &&
          <div style={{
            ...panel,
            padding: 20,
            textAlign: "center"
          }}>
            Nessuna conversazione ancora.
            <p style={{ fontSize: 12, color: C.muted }}>
              Apri il profilo di un utente nella chat
              pubblica e premi MESSAGGIO PRIVATO.
            </p>
          </div>}

        {conversations.map(c =>
          <button
            key={c.id}
            style={{
              ...panel,
              width: "100%",
              padding: 12,
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 12,
              textAlign: "left"
            }}
            onClick={() => openPrivateChat(c)}
          >
            <AvatarView
              name={c.avatar || "Shadow"}
              size={45}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>@{c.nickname || "utente"}</strong>
              <div style={{
                fontSize: 11,
                color: C.muted,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {c.last}
              </div>
            </div>
            {c.unread > 0 &&
              <span style={{
                background: C.red,
                color: "white",
                borderRadius: 20,
                padding: "4px 7px",
                fontSize: 10,
                fontWeight: 900
              }}>
                {c.unread}
              </span>}
          </button>
        )}
      </section>
      <Notice/>
      <Nav/>
    </main>;
  }

  if (page === "dm" && dmUser) {
    return <main style={{
      ...background,
      height: "100dvh",
      overflow: "hidden",
      paddingBottom: 0
    }}>
      <section style={{
        maxWidth: 650,
        margin: "auto",
        height: "100%",
        padding: "12px 14px 80px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column"
      }}>
        <header style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingBottom: 12,
          borderBottom: `1px solid ${C.border}`
        }}>
          <button
            style={secondaryButton}
            onClick={() => setPage("inbox")}
          >
            ‹
          </button>

          <button
            style={{
              background: "transparent",
              border: 0,
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
            onClick={() => setSelectedUser(dmUser)}
          >
            <AvatarView
              name={dmUser.avatar || "Shadow"}
              size={42}
            />
            <div style={{ textAlign: "left" }}>
              <small style={{ color: C.pink }}>
                CHAT PRIVATA
              </small>
              <div>
                <strong>@{dmUser.nickname}</strong>
              </div>
            </div>
          </button>
        </header>

        <div ref={dmChatRef} style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          paddingTop: 12
        }}>
          {dmMessages.length === 0 &&
            <div style={{
              ...panel,
              padding: 20,
              textAlign: "center",
              color: C.muted,
              fontSize: 12
            }}>
              Nessun messaggio. Inizia la conversazione.
            </div>}

          {dmMessages.map(m => {
            const mine = m.sender_id === uid;

            return <div key={m.id} style={{
              display: "flex",
              justifyContent: mine
                ? "flex-end" : "flex-start",
              marginBottom: 9
            }}>
              <div style={{
                ...panel,
                maxWidth: "82%",
                padding: "10px 12px",
                background: mine
                  ? "#30133f" : "#17101f",
                borderRadius: mine
                  ? "15px 15px 4px 15px"
                  : "15px 15px 15px 4px"
              }}>
                {!mine &&
                  <div style={{
                    color: C.pink,
                    fontSize: 10,
                    fontWeight: 900,
                    marginBottom: 4
                  }}>
                    @{m.sender_nickname || dmUser.nickname}
                  </div>}
                <div style={messageStyle(m)}>
                  {m.content}
                </div>
              </div>
            </div>;
          })}
        </div>

        <div style={{
          ...panel,
          padding: 5,
          display: "flex",
          gap: 6
        }}>
          <input
            style={{
              ...inputStyle,
              flex: 1,
              minWidth: 0,
              border: 0,
              background: "transparent",
              color: getMessageColor(messageColor),
              fontFamily: getMessageFont(messageFont)
            }}
            value={dmText}
            maxLength={500}
            placeholder={`Messaggio a @${dmUser.nickname}`}
            onChange={e => setDmText(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendDirectMessage();
              }
            }}
          />
          <button
            style={buttonStyle}
            disabled={dmSending || !dmText.trim()}
            onClick={sendDirectMessage}
          >
            ➤
          </button>
        </div>
      </section>
      <UserModal/>
      <Notice/>
      <Nav/>
    </main>;
  }

  if (page === "ranking") {
    const weekly = rankingTab === "weekly";
    const list = weekly ? weeklyRanking : ranking;
    const myPosition = weekly ? myWeeklyRank : myRank;

    return <main style={background}>
      <section style={{
        maxWidth: 650,
        margin: "auto",
        padding: 18
      }}>
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10
        }}>
          <div>
            <small style={{
              color: C.pink,
              fontWeight: 900
            }}>
              WHO GLOBAL
            </small>
            <h1 style={{
              fontFamily: displayFont,
              margin: "5px 0"
            }}>
              🏆 RANKING
            </h1>
          </div>
          <button
            style={secondaryButton}
            disabled={rankingLoading}
            onClick={loadRanking}
          >
            ↻ AGGIORNA
          </button>
        </header>

        <div style={{
          ...panel,
          padding: 18,
          margin: "15px 0",
          textAlign: "center"
        }}>
          <small style={{ color: C.muted }}>
            {weekly
              ? "I TUOI PUNTI SETTIMANALI"
              : "I TUOI WHO POINTS"}
          </small>
          <h1 style={{
            color: C.pink,
            fontSize: 36,
            margin: "8px 0"
          }}>
            ✦ {fmt(weekly
              ? weeklyRanking.find(x => x.id === uid)?.weekly_points
              : points)}
          </h1>
          <strong style={{ color: C.cyan }}>
            {myPosition
              ? `POSIZIONE #${myPosition}`
              : "POSIZIONE NON DISPONIBILE"}
          </strong>
          <p style={{
            color: C.muted,
            fontSize: 11
          }}>
            {weekly
              ? "La settimana WHO inizia lunedì alle 00:00 UTC."
              : "Classifica mondiale basata sui punti totali."}
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 16
        }}>
          {[
            ["global", "🌍 MONDIALE"],
            ["weekly", "⚡ SETTIMANALE"]
          ].map(([key, label]) =>
            <button
              key={key}
              style={{
                ...buttonStyle,
                background: rankingTab === key
                  ? "linear-gradient(135deg,#9c38cc,#5b1a7d)"
                  : "#17101f"
              }}
              onClick={() => setRankingTab(key)}
            >
              {label}
            </button>
          )}
        </div>

        <h3 style={{
          fontFamily: displayFont,
          color: C.pink
        }}>
          {weekly ? "TOP 100 SETTIMANALE" : "TOP 100 WHO"}
        </h3>

        {rankingLoading &&
          <p style={{
            textAlign: "center",
            color: C.muted
          }}>
            Caricamento classifica...
          </p>}

        {rankingError &&
          <div style={{
            ...panel,
            padding: 15,
            color: C.red,
            marginBottom: 12
          }}>
            Classifica non disponibile: {rankingError}
          </div>}

        {!rankingLoading && !rankingError &&
          list.length === 0 &&
          <div style={{
            ...panel,
            padding: 20,
            textAlign: "center"
          }}>
            Nessun utente visibile in classifica.
          </div>}

        {!rankingError && list.map(user => {
          const mine = user.id === uid;
          const medal = user.rank === 1
            ? "🥇"
            : user.rank === 2
              ? "🥈"
              : user.rank === 3
                ? "🥉"
                : null;
          const title = user.rank === 1
            ? "WHO CHAMPION"
            : user.rank <= 10
              ? "WHO ELITE"
              : "WHO TOP 100";

          return <div key={user.id} style={{
            ...panel,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 12,
            marginBottom: 8,
            border: mine
              ? `1px solid ${C.cyan}`
              : panel.border
          }}>
            <div style={{
              width: 37,
              textAlign: "center",
              fontSize: medal ? 25 : 16,
              color: C.gold,
              fontWeight: 900
            }}>
              {medal || `#${user.rank}`}
            </div>
            <AvatarView
              name={user.avatar || "Shadow"}
              size={45}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong style={{
                color: mine ? C.cyan : C.text,
                overflowWrap: "anywhere"
              }}>
                @{user.nickname || "anonimo"}
              </strong>
              <div style={{
                fontSize: 10,
                color: C.muted,
                marginTop: 4
              }}>
                {title}{mine ? " · TU" : ""}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <strong style={{ color: C.pink }}>
                ✦ {fmt(weekly
                  ? user.weekly_points
                  : user.who_points)}
              </strong>
              <div style={{
                fontSize: 10,
                color: C.muted,
                marginTop: 4
              }}>
                {weekly
                  ? "Questa settimana"
                  : "WHO Points"}
              </div>
            </div>
          </div>;
        })}

        <div style={{
          ...panel,
          padding: 15,
          marginTop: 18
        }}>
          <h3 style={{ color: C.green }}>
            🛡 WHO FAIR PLAY
          </h3>
          <p style={{
            fontSize: 12,
            color: C.muted,
            lineHeight: 1.7
          }}>
            WHO premia il comportamento positivo.
            Le segnalazioni non sottraggono punti
            automaticamente. Le violazioni devono
            essere verificate prima di applicare
            eventuali penalità.
          </p>
        </div>
      </section>
      <Notice/>
      <Nav/>
    </main>;
  }

  // CONTINUA NEL BLOCCO 4/4
  if (page === "profile") {
    return <main style={background}>
      <section style={{
        maxWidth: 650,
        margin: "auto",
        padding: 18
      }}>
        <div style={{
          textAlign: "center",
          padding: "25px 0 15px"
        }}>
          <div style={{
            minHeight: 160,
            display: "grid",
            placeItems: "center"
          }}>
            <AvatarView name={avatar} size={130}/>
          </div>

          <h1>@{nickname}</h1>

          {isFounder &&
            <strong style={{ color: C.gold }}>
              ♛ WHO FOUNDER
            </strong>}

          {founderChecking &&
            <p style={{ color: C.muted, fontSize: 12 }}>
              Verifica Founder in corso...
            </p>}

          {isFounder &&
            <button
              style={{
                ...buttonStyle,
                width: "100%",
                marginTop: 12,
                background: "linear-gradient(135deg,#8a5b14,#48300c)",
                borderColor: C.gold
              }}
              onClick={() => setPage("founder")}
            >
              ♛ PANNELLO FOUNDER · MODERAZIONE
            </button>}

          <button
            style={{
              ...secondaryButton,
              width: "100%",
              marginTop: 10
            }}
            disabled={founderChecking}
            onClick={checkFounder}
          >
            ↻ VERIFICA ACCOUNT FOUNDER
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8
        }}>
          {[
            ["POINTS", `✦ ${fmt(points)}`],
            ["VIBE", `⚡ ${vibe}`],
            ["LEVEL", level]
          ].map(([label, value]) =>
            <div key={label} style={{
              ...panel,
              padding: 12,
              textAlign: "center"
            }}>
              <small style={{ color: C.muted }}>
                {label}
              </small>
              <h2 style={{ fontSize: 19 }}>{value}</h2>
            </div>
          )}
        </div>

        <div style={{
          ...panel,
          padding: 15,
          marginTop: 12,
          textAlign: "center"
        }}>
          <h3>🏆 WHO RANKING</h3>
          <p style={{ color: C.pink, fontWeight: 900 }}>
            ✦ {fmt(points)} WHO Points
          </p>
          <p style={{ fontSize: 12, color: C.muted }}>
            Partecipa alla community e scala la
            classifica mondiale e settimanale.
          </p>
          <button
            style={{ ...buttonStyle, width: "100%" }}
            onClick={() => setPage("ranking")}
          >
            VAI ALLA CLASSIFICA →
          </button>
        </div>

        <div style={{
          ...panel,
          padding: 15,
          marginTop: 12
        }}>
          <h3>STILE MESSAGGI</h3>

          <div style={{
            ...panel,
            padding: 13,
            ...messageStyle({
              message_color: messageColor,
              message_font: messageFont
            })
          }}>
            Questo è il mio stile WHO.
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 7,
            marginTop: 12
          }}>
            {Object.keys(messageColors).map(value =>
              <button
                key={value}
                onClick={() =>
                  saveStyle("message_color", value)
                }
                style={{
                  ...secondaryButton,
                  color: messageColors[value],
                  border: messageColor === value
                    ? `1px solid ${messageColors[value]}`
                    : secondaryButton.border
                }}
              >
                ● {value.toUpperCase()}
              </button>
            )}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 7,
            marginTop: 12
          }}>
            {Object.keys(messageFonts).map(value =>
              <button
                key={value}
                onClick={() =>
                  saveStyle("message_font", value)
                }
                style={{
                  ...secondaryButton,
                  fontFamily: messageFonts[value],
                  fontWeight: value === "bold" ? 900 : 400,
                  fontStyle: value === "elegant"
                    ? "italic" : "normal",
                  border: messageFont === value
                    ? `1px solid ${C.pink}`
                    : secondaryButton.border
                }}
              >
                {value.toUpperCase()}
              </button>
            )}
          </div>
        </div>

        <div style={{
          ...panel,
          padding: 15,
          marginTop: 12
        }}>
          <h3>🛡 REPUTAZIONE</h3>
          <strong style={{
            color: reputation >= 70 ? C.green : C.red
          }}>
            {reputation >= 70
              ? "✓ IN REGOLA"
              : "⚠ DA VERIFICARE"}
          </strong>
          <p>{reputation}/100</p>
          <p style={{ color: C.muted, fontSize: 11 }}>
            Le segnalazioni non applicano
            automaticamente penalità.
          </p>
        </div>

        <div style={{
          ...panel,
          padding: 15,
          marginTop: 12
        }}>
          <h3>⚡ WHO POINTS E VIBE</h3>
          <p style={{
            fontSize: 12,
            color: C.muted,
            lineHeight: 1.7
          }}>
            WHO Points: determinano il livello e
            la posizione nella classifica mondiale.
            I nuovi punti guadagnati vengono conteggiati
            anche nel Ranking settimanale.
          </p>
          <p style={{
            fontSize: 12,
            color: C.muted,
            lineHeight: 1.7
          }}>
            VIBE: rappresenta il contributo sociale
            e il comportamento positivo.
          </p>
          <p style={{
            fontSize: 12,
            color: C.muted,
            lineHeight: 1.7
          }}>
            Le segnalazioni richiedono verifica
            prima di eventuali penalità.
          </p>
        </div>

        <div style={{
          ...panel,
          padding: 17,
          marginTop: 12
        }}>
          <h3 style={{ color: C.cyan }}>
            🔐 SICUREZZA ACCOUNT
          </h3>

          <p style={{
            color: C.muted,
            fontSize: 12,
            lineHeight: 1.6
          }}>
            Proteggi la tua identità WHO.
            Cambia la password temporanea con
            una password personale di almeno
            12 caratteri.
          </p>

          {!showPasswordForm ?
            <button
              style={{
                ...buttonStyle,
                width: "100%"
              }}
              onClick={() => setShowPasswordForm(true)}
            >
              CAMBIA PASSWORD
            </button>
          : <>
              <form onSubmit={e => {
                e.preventDefault();
                changePassword();
              }}>
                <label style={{
                  display: "block",
                  marginBottom: 6,
                  color: C.muted,
                  fontSize: 12
                }}>
                  Password attuale
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  style={inputStyle}
                  value={oldPassword}
                  onChange={e =>
                    setOldPassword(e.target.value)
                  }
                  placeholder="Password temporanea"
                />

                <label style={{
                  display: "block",
                  marginTop: 13,
                  marginBottom: 6,
                  color: C.muted,
                  fontSize: 12
                }}>
                  Nuova password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  style={inputStyle}
                  value={newPassword}
                  onChange={e =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Almeno 12 caratteri"
                />

                <label style={{
                  display: "block",
                  marginTop: 13,
                  marginBottom: 6,
                  color: C.muted,
                  fontSize: 12
                }}>
                  Conferma nuova password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  style={inputStyle}
                  value={confirmPassword}
                  onChange={e =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Ripeti la nuova password"
                />

                <button
                  type="submit"
                  disabled={passwordBusy}
                  style={{
                    ...buttonStyle,
                    width: "100%",
                    marginTop: 15,
                    opacity: passwordBusy ? 0.6 : 1
                  }}
                >
                  {passwordBusy
                    ? "AGGIORNAMENTO..."
                    : "SALVA NUOVA PASSWORD"}
                </button>
              </form>

              <button
                style={{
                  ...secondaryButton,
                  width: "100%",
                  marginTop: 9
                }}
                onClick={() => {
                  setShowPasswordForm(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                ANNULLA
              </button>
            </>}
        </div>

        <button
          style={{
            ...secondaryButton,
            width: "100%",
            marginTop: 12,
            padding: 15
          }}
          onClick={() => setStarted("identity")}
        >
          CAMBIA AVATAR
        </button>

        <button
          style={{
            ...secondaryButton,
            width: "100%",
            marginTop: 10,
            padding: 15,
            color: C.red
          }}
          onClick={logout}
        >
          ESCI
        </button>
      </section>
      <Notice/>
      <Nav/>
    </main>;
  }

  function UserModal() {
    if (!selectedUser) return null;

    return <div
      onClick={() => setSelectedUser(null)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(0,0,0,.82)",
        display: "grid",
        placeItems: "center",
        padding: 18
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          ...panel,
          width: "100%",
          maxWidth: 390,
          padding: 20,
          textAlign: "center",
          boxShadow: "0 0 50px rgba(181,76,255,.18)"
        }}
      >
        <button
          style={{ ...secondaryButton, float: "right" }}
          onClick={() => setSelectedUser(null)}
        >
          ✕
        </button>

        <div style={{
          display: "grid",
          placeItems: "center",
          padding: "20px 0 5px"
        }}>
          <AvatarView
            name={selectedUser.avatar || "Shadow"}
            size={105}
          />
        </div>

        <h2>@{selectedUser.nickname || "anonimo"}</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 7,
          marginTop: 18
        }}>
          {[
            ["VIBE", `⚡ ${selectedUser.vibe ?? 100}`],
            ["LEVEL", Math.max(
              1,
              Math.floor(
                Number(selectedUser.who_points ?? 0) / 250
              ) + 1
            )],
            ["REP", selectedUser.reputation ?? 100]
          ].map(([label, value]) =>
            <div key={label} style={{
              background: "#09070c",
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 10
            }}>
              <small style={{ color: C.muted }}>
                {label}
              </small>
              <strong style={{
                display: "block",
                marginTop: 5
              }}>
                {value}
              </strong>
            </div>
          )}
        </div>

        {selectedUser.id !== uid &&
          <button
            style={{
              ...buttonStyle,
              width: "100%",
              padding: 14,
              marginTop: 16
            }}
            onClick={() => openPrivateChat(selectedUser)}
          >
            ✉ MESSAGGIO PRIVATO
          </button>}

        <button
          style={{
            ...secondaryButton,
            width: "100%",
            marginTop: 9
          }}
          onClick={() => setSelectedUser(null)}
        >
          CHIUDI
        </button>
      </div>
    </div>;
  }

  if (page === "founder") {
    return <main style={background}>
      <section style={{
        maxWidth: 650,
        margin: "auto",
        padding: 18
      }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8
        }}>
          <h1 style={{
            color: C.gold,
            fontFamily: displayFont,
            fontSize: 23
          }}>
            ♛ WHO FOUNDER
          </h1>

          <button
            style={secondaryButton}
            onClick={() => setPage("profile")}
          >
            ← PROFILO
          </button>
        </header>

        {!isFounder ?
          <div style={{
            ...panel,
            padding: 18
          }}>
            <h3>Accesso riservato</h3>
            <p style={{
              color: C.muted,
              fontSize: 12
            }}>
              Il pannello è disponibile soltanto
              per il Founder verificato nel database.
            </p>
            <button
              style={buttonStyle}
              onClick={checkFounder}
            >
              ↻ VERIFICA IDENTITÀ
            </button>
          </div>
        : <>
            <div style={{
              ...panel,
              padding: 15,
              marginBottom: 14,
              border: `1px solid ${C.gold}`
            }}>
              <small style={{
                color: C.gold,
                fontWeight: 900
              }}>
                ♛ FOUNDER CONTROL CENTER
              </small>

              <h3>
                SEGNALAZIONI IN ATTESA ({founderReports.length})
              </h3>

              <p style={{
                color: C.muted,
                fontSize: 12,
                lineHeight: 1.7
              }}>
                Nessuna penalità automatica.
                Ogni segnalazione deve essere
                verificata prima di approvarla
                e applicare eventuali WHO Points negativi.
              </p>

              <button
                style={secondaryButton}
                onClick={loadFounderReports}
              >
                ↻ AGGIORNA SEGNALAZIONI
              </button>
            </div>

            {founderError &&
              <div style={{
                ...panel,
                padding: 15,
                color: C.red,
                marginBottom: 12
              }}>
                {founderError}
              </div>}

            {founderReports.map(r =>
              <div key={r.id} style={{
                ...panel,
                padding: 15,
                marginBottom: 12,
                border: `1px solid ${C.gold}`
              }}>
                <strong style={{ color: C.gold }}>
                  REPORT #{r.id}
                </strong>

                <p style={{
                  fontSize: 12,
                  color: C.muted
                }}>
                  Motivo: {r.reason || "Non specificato"}
                </p>

                {r.reportedMessage ?
                  <div style={{
                    background: "#09060e",
                    padding: 12,
                    borderRadius: 10
                  }}>
                    <strong>
                      @{r.reportedMessage.nickname || "anonimo"}
                    </strong>

                    <p style={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere"
                    }}>
                      {r.reportedMessage.content}
                    </p>

                    <small style={{ color: C.muted }}>
                      Stanza: {r.reportedMessage.room}
                    </small>
                  </div>
                :
                  <p style={{
                    color: C.red,
                    fontSize: 12
                  }}>
                    Messaggio non visibile: ID {r.message_id}.
                    Non approvare senza verificare.
                  </p>}

                <label style={{
                  display: "block",
                  marginTop: 12,
                  marginBottom: 5
                }}>
                  Penalità WHO Points (0–100)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  style={inputStyle}
                  value={founderPenalties[r.id] ?? 0}
                  onChange={e =>
                    setFounderPenalties(v => ({
                      ...v,
                      [r.id]: e.target.value
                    }))
                  }
                />

                <div style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 12
                }}>
                  <button
                    disabled={
                      founderBusy || !r.reportedMessage
                    }
                    style={{
                      ...buttonStyle,
                      flex: 1,
                      background: "#205a40",
                      opacity: founderBusy ? 0.5 : 1
                    }}
                    onClick={() =>
                      reviewFounderReport(r, true)
                    }
                  >
                    ✓ APPROVA
                  </button>

                  <button
                    disabled={founderBusy}
                    style={{
                      ...buttonStyle,
                      flex: 1,
                      background: "#662238",
                      opacity: founderBusy ? 0.5 : 1
                    }}
                    onClick={() =>
                      reviewFounderReport(r, false)
                    }
                  >
                    ✕ RIFIUTA
                  </button>
                </div>
              </div>
            )}

            {!founderError &&
              founderReports.length === 0 &&
              <div style={{
                ...panel,
                padding: 20,
                textAlign: "center"
              }}>
                <h3 style={{ color: C.green }}>
                  ✓ NESSUNA SEGNALAZIONE IN ATTESA
                </h3>
                <p style={{
                  fontSize: 12,
                  color: C.muted
                }}>
                  Le nuove segnalazioni compariranno qui
                  quando saranno accessibili al Founder.
                </p>
              </div>}
          </>}
      </section>
      <Notice/>
      <Nav/>
    </main>;
  }

  return <main style={{
    ...background,
    height: "100dvh",
    overflow: "hidden",
    paddingBottom: 0
  }}>
    <section style={{
      maxWidth: 650,
      height: "100%",
      margin: "auto",
      padding: "12px 14px 78px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column"
    }}>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 58
      }}>
        <Logo/>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            style={{
              ...secondaryButton,
              position: "relative"
            }}
            onClick={() => setPage("inbox")}
          >
            ✉ PRIVATI
            {unreadDM > 0 &&
              <span style={{
                position: "absolute",
                top: -7,
                right: -7,
                background: C.red,
                color: "#fff",
                borderRadius: 20,
                padding: "2px 6px",
                fontSize: 10
              }}>
                {unreadDM}
              </span>}
          </button>

          <button
            style={secondaryButton}
            onClick={() => setPage("rooms")}
          >
            ◉ Stanze
          </button>
        </div>
      </header>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
      }}>
        <div>
          <small style={{ color: "#c879ef" }}>
            CHAT PUBBLICA
          </small>

          <div style={{
            fontFamily: displayFont,
            fontSize: 19
          }}>
            {activeRoom.name}
          </div>

          <div style={{
            color: C.green,
            fontSize: 10,
            marginTop: 4
          }}>
            ● {Object.keys(online).length} online WHO ·{" "}
            {Object.values(online)
              .filter(x => x === currentRoom).length} in stanza
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <AvatarView name={avatar} size={35}/>
          <small style={{ color: C.muted }}>
            ⚡ {vibe}
          </small>
        </div>
      </div>

      <div
        ref={publicChatRef}
        onScroll={e => {
          const el = e.currentTarget;
          nearBottomRef.current =
            el.scrollHeight -
            el.scrollTop -
            el.clientHeight < 100;

          if (nearBottomRef.current) {
            setNewMessages(0);
          }
        }}
        style={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0
        }}
      >
        {messages.length === 0 &&
          <p style={{
            color: C.muted,
            textAlign: "center",
            fontSize: 12
          }}>
            Nessun messaggio in questa stanza.
          </p>}

        {messages.map(msg => {
          const mine = msg.user_id === uid;
          const reported = reportedMessages.includes(msg.id);

          return <article key={msg.id} style={{
            background: mine
              ? "rgba(112,37,150,.10)"
              : "rgba(255,255,255,.018)",
            border: "1px solid rgba(190,100,255,.08)",
            borderRadius: 12,
            padding: 8,
            marginBottom: 6
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                disabled={mine}
                onClick={() => openUserProfile(msg)}
                style={{
                  background: "transparent",
                  border: 0,
                  padding: 0,
                  height: 34
                }}
              >
                <AvatarView
                  name={msg.avatar || "Shadow"}
                  size={34}
                />
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <button
                  disabled={mine}
                  onClick={() => openUserProfile(msg)}
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "#fff",
                    fontWeight: 900,
                    padding: 0,
                    fontFamily: font
                  }}
                >
                  @{msg.nickname || "anonimo"}
                </button>

                {msg.reply_to_nickname &&
                  <div style={{
                    borderLeft: `2px solid ${C.purple}`,
                    paddingLeft: 7,
                    color: C.muted,
                    fontSize: 10,
                    marginTop: 4
                  }}>
                    ↩ @{msg.reply_to_nickname}
                    {msg.reply_preview
                      ? ` · ${msg.reply_preview}`
                      : ""}
                  </div>}

                <div style={{
                  ...messageStyle(msg),
                  margin: "6px 0"
                }}>
                  {msg.content}
                </div>

                <div style={{
                  display: "flex",
                  gap: 5,
                  flexWrap: "wrap",
                  marginTop: 7
                }}>
                  <button
                    style={secondaryButton}
                    onClick={() => setReplyingTo(msg)}
                  >
                    ↩
                  </button>

                  {!mine && <>
                    <button
                      style={{
                        ...secondaryButton,
                        color: C.pink,
                        fontSize: 10
                      }}
                      onClick={() => openUserProfile(msg)}
                    >
                      ● PROFILO
                    </button>

                    <button
                      style={{
                        ...secondaryButton,
                        color: C.cyan,
                        fontSize: 10
                      }}
                      onClick={() => openPrivateChat({
                        id: msg.user_id,
                        nickname: msg.nickname,
                        avatar: msg.avatar
                      })}
                    >
                      ✉ PRIVATO
                    </button>
                  </>}

                  <button
                    style={{
                      ...secondaryButton,
                      color: myVotes[msg.id] === "like"
                        ? C.cyan : C.muted
                    }}
                    disabled={mine}
                    onClick={() => voteMessage(msg, "like")}
                  >
                    ♡ {msg.likes || 0}
                  </button>

                  <button
                    style={{
                      ...secondaryButton,
                      color: myVotes[msg.id] === "dislike"
                        ? C.pink : C.muted
                    }}
                    disabled={mine}
                    onClick={() => voteMessage(msg, "dislike")}
                  >
                    ♢− {msg.dislikes || 0}
                  </button>

                  {!mine &&
                    <button
                      style={{
                        ...secondaryButton,
                        color: C.red,
                        opacity: reported ? 0.4 : 1
                      }}
                      disabled={reported}
                      onClick={() => reportMessage(msg)}
                    >
                      ⚑
                    </button>}
                </div>
              </div>
            </div>
          </article>;
        })}
      </div>

      {newMessages > 0 &&
        <button
          style={{
            ...buttonStyle,
            width: "100%",
            marginTop: 5
          }}
          onClick={() => {
            const el = publicChatRef.current;
            if (el) el.scrollTop = el.scrollHeight;
            nearBottomRef.current = true;
            setNewMessages(0);
          }}
        >
          ↓ {newMessages} nuovi messaggi
        </button>}

      {replyingTo &&
        <div style={{
          ...panel,
          padding: 9,
          marginTop: 5,
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          <div style={{
            flex: 1,
            fontSize: 11,
            overflowWrap: "anywhere"
          }}>
            <strong style={{ color: C.pink }}>
              ↩ @{replyingTo.nickname}
            </strong>
            <div style={{ color: C.muted }}>
              {replyingTo.content?.slice(0, 100)}
            </div>
          </div>

          <button
            style={secondaryButton}
            onClick={() => setReplyingTo(null)}
          >
            ✕
          </button>
        </div>}

      <div style={{
        ...panel,
        padding: 5,
        display: "flex",
        gap: 6,
        marginTop: 6
      }}>
        <input
          style={{
            ...inputStyle,
            flex: 1,
            minWidth: 0,
            border: 0,
            background: "transparent",
            color: getMessageColor(messageColor),
            fontFamily: getMessageFont(messageFont)
          }}
          value={message}
          maxLength={500}
          placeholder="Scrivi qualcosa..."
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          style={buttonStyle}
          disabled={sending || !message.trim()}
          onClick={sendMessage}
        >
          {sending ? "…" : "➤"}
        </button>
      </div>
    </section>

    <UserModal/>
    <Notice/>
    <Nav/>
  </main>;
}
