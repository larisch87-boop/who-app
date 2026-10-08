
"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const C = {
  bg:"#07050a",panel:"#100b16",panel2:"#17101f",
  purple:"#b54cff",pink:"#ef7dff",cyan:"#64e8ff",
  text:"#f8f4fb",muted:"#978b9f",
  border:"rgba(190,100,255,.20)",
  green:"#61e5a4",red:"#ff7295"
};

const font='"Trebuchet MS",Inter,system-ui,sans-serif';
const displayFont='"Arial Black","Trebuchet MS",sans-serif';

const avatars=[
  "Shadow","Pixie","King","Azra","Zero","Luna",
  "Ranger","Neon","Ares","Vix","Nova","Ghost"
].map(name=>({name,image:`/${name.toLowerCase()}.png`}));

const ownerAvatar={
  name:"UNKNOWN",
  image:"/file_000000005e3881f4b9b9109dab033a80.png"
};

const roomsDefault=[
  ["who-general","generale","WHO GENERAL","La community principale di WHO"],
  ["night-who","night-who","NIGHT WHO","Chat notturna"],
  ["gaming","gaming","GAMING","Gaming community"],
  ["music","music","MUSIC","Musica e nuove scoperte"],
  ["meet-people","meet-people","MEET PEOPLE","Conosci nuove persone"]
].map(([id,room_key,name,description])=>({
  id,room_key,name,description,
  is_official:true,is_private:false
}));

const legacyShop=[
  ["royal-crown","ROYAL CROWN","LEGENDARY",1200,"/shop/royal/crown.png","head"],
  ["void-mask","VOID MASK","LEGENDARY",1000,"/shop/void-mask.png","face"],
  ["glitch-eyes","GLITCH EYES","EPIC",750,"/shop/glitch-eyes.png","face"],
  ["dual-aura","DUAL AURA","EPIC",850,"/shop/dual-aura.png","aura"],
  ["neon-visor","NEON VISOR","EPIC",650,"/shop/neon-visor.png","face"],
  ["nexus-frame","NEXUS FRAME","LIMITED",1500,"/shop/nexus-frame.png","frame"]
].map(([id,name,rarity,price,image,slot])=>({
  id,name,rarity,price,image,slot,
  category:slot,active:true,legacy:true
}));

const newShopFallback=[
  ["shadow-reborn","SHADOW REBORN","LEGENDARY",1800,"skin"],
  ["neon-phantom","NEON PHANTOM","LEGENDARY",2200,"skin"],
  ["dark-emperor","DARK EMPEROR","MYTHIC",3000,"skin"],
  ["void-halo","VOID HALO","EPIC",900,"head"],
  ["cyber-frame","CYBER FRAME","EPIC",750,"frame"],
  ["purple-storm","PURPLE STORM","EPIC",1100,"effect"],
  ["ghost-flame","GHOST FLAME","LEGENDARY",1400,"effect"],
  ["black-market-edition","BLACK MARKET EDITION","MYTHIC",4500,"collection"]
].map(([id,name,rarity,price,category])=>({
  id,name,rarity,price,category,
  slot:category==="head"?"head":
    category==="frame"?"frame":null,
  image:`/shop/${id}.png`,
  active:true,legacy:false
}));

const equipmentSlots=["head","face","aura","frame"];
const emptyEquipment=()=>({
  head:null,face:null,aura:null,frame:null
});

const equipmentFromProfile=p=>({
  head:p?.equipped_head||null,
  face:p?.equipped_face||null,
  aura:p?.equipped_aura||null,
  frame:p?.equipped_frame||null
});

const messageColors={
  purple:"#e4a7ff",cyan:"#64e8ff",pink:"#ff8fda",
  red:"#ff728f",green:"#61e5a4",white:"#f8f4fb"
};

const messageFonts={
  standard:'"Trebuchet MS",Inter,system-ui,sans-serif',
  tech:'"Courier New",Courier,monospace',
  bold:'Impact,"Arial Black",sans-serif',
  elegant:'Georgia,"Times New Roman",serif'
};

const cleanNickname=s=>
  String(s||"").toLowerCase().replace(/[^a-z0-9_]/g,"").slice(0,20);

const internalEmail=n=>`${cleanNickname(n)}@account.who.local`;
const roomKey=r=>r?.room_key||String(r?.id||"generale");

const avatarImage=n=>
  n==="UNKNOWN"?ownerAvatar.image:
  avatars.find(x=>x.name===n)?.image||"/shadow.png";

const getMessageColor=x=>messageColors[x]||messageColors.purple;
const getMessageFont=x=>messageFonts[x]||messageFonts.standard;

const messageStyle=m=>({
  color:getMessageColor(m.message_color),
  fontFamily:getMessageFont(m.message_font),
  fontWeight:m.message_font==="bold"?900:400,
  fontStyle:m.message_font==="elegant"?"italic":"normal",
  overflowWrap:"anywhere"
});

const panel={
  background:"linear-gradient(145deg,#1b1124,#0c0811)",
  border:`1px solid ${C.border}`,
  borderRadius:18,color:C.text
};

const inputStyle={
  width:"100%",boxSizing:"border-box",padding:13,
  background:"#08060b",color:"#fff",
  border:`1px solid ${C.border}`,
  borderRadius:13,outline:0,fontFamily:font
};

const buttonStyle={
  background:"linear-gradient(135deg,#9c38cc,#5b1a7d)",
  border:"1px solid rgba(220,110,255,.55)",
  borderRadius:12,padding:"11px 14px",
  color:"#fff",fontWeight:900,fontFamily:font,
  cursor:"pointer"
};

const secondaryButton={
  background:"#130d19",border:`1px solid ${C.border}`,
  borderRadius:11,padding:"9px 11px",
  color:"#e5c4ee",fontWeight:800,cursor:"pointer"
};

function ShopPicture({item,size=140}){
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[item.image]);
  return (
    <div style={{
      width:"100%",height:size,display:"grid",placeItems:"center",
      background:"radial-gradient(circle,rgba(181,76,255,.14),transparent 72%)",
      overflow:"hidden"
    }}>
      {!failed&&item.image?(
        <img src={item.image} alt={item.name}
          onError={()=>setFailed(true)}
          style={{
            maxWidth:"95%",maxHeight:"95%",objectFit:"contain"
          }}/>
      ):(
        <div style={{
          width:"80%",height:"75%",
          border:"1px solid rgba(181,76,255,.3)",
          borderRadius:18,
          display:"grid",placeItems:"center",
          background:"radial-gradient(circle,#301340,#100b16)",
          textAlign:"center",padding:8
        }}>
          <div>
            <div style={{
              color:C.pink,fontSize:35,
              textShadow:"0 0 15px #b54cff"
            }}>✦</div>
            <strong style={{fontSize:10,color:C.text}}>
              {item.name}
            </strong>
            <div style={{fontSize:9,color:C.muted,marginTop:5}}>
              ANTEPRIMA NON DISPONIBILE
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AvatarView({
  name="Shadow",size=46,equipment={},catalog=legacyShop
}){
  const eq=equipment||{};
  const find=id=>catalog.find(x=>x.id===id);
  const frame=find(eq.frame);
  const aura=find(eq.aura);
  const head=find(eq.head);
  const face=find(eq.face);

  const [failed,setFailed]=useState({});
  useEffect(()=>setFailed({}),[
    name,eq.head,eq.face,eq.aura,eq.frame
  ]);

  const layer=(item,slot)=>{
    if(!item?.image||failed[item.id])return null;

    const styles={
      aura:{
        width:"130%",height:"130%",
        left:"50%",top:"50%",
        transform:"translate(-50%,-50%)",
        zIndex:0,opacity:.55
      },
      frame:{
        width:"116%",height:"116%",
        left:"50%",top:"50%",
        transform:"translate(-50%,-50%)",
        zIndex:1,opacity:.7
      },
      head:{
        width:"64%",height:"30%",
        left:"50%",top:"1%",
        transform:"translateX(-50%)",
        zIndex:4
      },
      face:{
        width:"52%",height:"22%",
        left:"50%",top:"48%",
        transform:"translate(-50%,-50%)",
        zIndex:4
      }
    };

    return (
      <img key={slot} src={item.image} alt=""
        onError={()=>setFailed(old=>({...old,[item.id]:true}))}
        style={{
          position:"absolute",objectFit:"contain",
          pointerEvents:"none",...styles[slot]
        }}/>
    );
  };

  return (
    <div style={{
      width:size,height:size,position:"relative",
      flexShrink:0,display:"inline-block",
      isolation:"isolate"
    }}>
      {layer(aura,"aura")}
      {layer(frame,"frame")}
      <img src={avatarImage(name)} alt={name}
        onError={e=>{
          if(!e.currentTarget.src.endsWith("/shadow.png"))
            e.currentTarget.src="/shadow.png";
        }}
        style={{
          position:"absolute",inset:0,zIndex:2,
          width:"100%",height:"100%",
          borderRadius:"50%",objectFit:"cover",
          border:"1px solid rgba(200,100,255,.35)"
        }}/>
      {layer(face,"face")}
      {layer(head,"head")}
    </div>
  );
}

export default function Home(){
  const [loading,setLoading]=useState(true);
  const [session,setSession]=useState(null);
  const [profile,setProfile]=useState(null);
  const [nickname,setNickname]=useState("");
  const [password,setPassword]=useState("");
  const [authMode,setAuthMode]=useState("login");
  const [authError,setAuthError]=useState("");
  const [started,setStarted]=useState(false);
  const [page,setPage]=useState("chat");
  const [avatar,setAvatar]=useState("Shadow");
  const [points,setPoints]=useState(500);
  const [vibe,setVibe]=useState(100);
  const [reputation,setReputation]=useState(100);
  const [dmPrivacy,setDmPrivacy]=useState("vibe");
  const [dmMinVibe,setDmMinVibe]=useState(100);
  const [messageColor,setMessageColor]=useState("purple");
  const [messageFont,setMessageFont]=useState("standard");

  const [rooms,setRooms]=useState(roomsDefault);
  const [activeRoom,setActiveRoom]=useState(roomsDefault[0]);
  const [messages,setMessages]=useState([]);
  const [message,setMessage]=useState("");
  const [replyingTo,setReplyingTo]=useState(null);
  const [sending,setSending]=useState(false);
  const [myVotes,setMyVotes]=useState({});
  const [reportedMessages,setReportedMessages]=useState([]);

  const [catalog,setCatalog]=useState(legacyShop);
  const [owned,setOwned]=useState([]);
  const [equipped,setEquipped]=useState(emptyEquipment());
  const [equipmentBusy,setEquipmentBusy]=useState(null);

  const [selectedUser,setSelectedUser]=useState(null);
  const [showCreateRoom,setShowCreateRoom]=useState(false);
  const [newRoomName,setNewRoomName]=useState("");
  const [newRoomDescription,setNewRoomDescription]=useState("");
  const [newRoomPrivate,setNewRoomPrivate]=useState(false);

  const [dmUser,setDmUser]=useState(null);
  const [dmMessages,setDmMessages]=useState([]);
  const [dmText,setDmText]=useState("");
  const [dmSending,setDmSending]=useState(false);
  const [unreadDM,setUnreadDM]=useState(0);
  const [conversations,setConversations]=useState([]);
  const [online,setOnline]=useState({});
  const [newMessages,setNewMessages]=useState(0);
  const [notice,setNotice]=useState("");
  const [busyPurchase,setBusyPurchase]=useState(false);

  const publicChatRef=useRef(null);
  const dmChatRef=useRef(null);
  const nearBottomRef=useRef(true);
  const lastMessageRef=useRef(null);
  const presenceRef=useRef(null);
  const roomRef=useRef("generale");
  const equipmentLockRef=useRef(false);

  const uid=session?.user?.id;
  const currentRoom=roomKey(activeRoom);
  const isFounder=String(profile?.role||"").toUpperCase()==="FOUNDER";
  const level=Math.max(1,Math.floor(points/250)+1);

  const background={
    minHeight:"100dvh",color:C.text,fontFamily:font,
    background:"radial-gradient(circle at 50% -15%,rgba(137,42,190,.38),transparent 35%),linear-gradient(180deg,#0b0710,#050407)",
    paddingBottom:session&&started?90:25
  };

  function alertUser(text){setNotice(String(text));}

  function applyProfile(p){
    setProfile(p);
    setNickname(p.nickname||p.username||"");
    setAvatar(p.avatar||"Shadow");
    setPoints(Number(p.who_points??500));
    setVibe(Number(p.vibe??100));
    setReputation(Number(p.reputation??100));
    setDmPrivacy(p.dm_privacy||"vibe");
    setDmMinVibe(Number(p.dm_min_vibe??100));
    setMessageColor(p.message_color||"purple");
    setMessageFont(p.message_font||"standard");
    setEquipped(equipmentFromProfile(p));
  }

  async function loadProfile(user,preferred=""){
    const {data,error}=await supabase.from("profiles")
      .select("*").eq("id",user.id).maybeSingle();

    if(error)return alertUser(error.message);
    if(data){
      applyProfile(data);
      setStarted(true);
      return;
    }

    const name=cleanNickname(
      preferred||user.user_metadata?.nickname||
      user.user_metadata?.username||
      user.email?.split("@")[0]
    )||`who_${user.id.slice(0,8)}`;

    const created=await supabase.from("profiles").insert({
      id:user.id,nickname:name,avatar:"Shadow",
      message_color:"purple",message_font:"standard"
    }).select().single();

    if(created.error)return alertUser(created.error.message);
    applyProfile(created.data);
    setStarted("identity");
  }

  useEffect(()=>{
    let alive=true;
    supabase.auth.getSession().then(({data})=>{
      if(!alive)return;
      setSession(data.session||null);
      setLoading(false);
    });
    const {data}=supabase.auth.onAuthStateChange((_event,s)=>{
      setSession(s);
      if(!s){
        setProfile(null);
        setStarted(false);
      }
      setLoading(false);
    });
    return ()=>{
      alive=false;
      data.subscription.unsubscribe();
    };
  },[]);

  useEffect(()=>{
    if(uid)loadProfile(session.user);
  },[uid]);

  async function register(){
    const name=cleanNickname(nickname);
    if(name.length<3)
      return setAuthError("Nickname minimo 3 caratteri.");
    if(password.length<8)
      return setAuthError("Password minimo 8 caratteri.");
    setAuthError("");
    const {data,error}=await supabase.auth.signUp({
      email:internalEmail(name),password,
      options:{data:{username:name,nickname:name}}
    });
    if(error)return setAuthError(error.message);
    if(data.session&&data.user){
      await loadProfile(data.user,name);
    }else{
      setAuthMode("login");
      setAuthError("Account creato. Ora prova ad accedere.");
    }
    setPassword("");
  }

  async function login(){
    const name=cleanNickname(nickname);
    if(!name)return setAuthError("Inserisci il nickname.");
    const {error}=await supabase.auth.signInWithPassword({
      email:internalEmail(name),password
    });
    if(error)
      return setAuthError("Nickname o password non corretti.");
    setPassword("");
  }

  async function logout(){
    await supabase.auth.signOut();
    setProfile(null);
    setStarted(false);
    setPage("chat");
    setNickname("");
    setPassword("");
    setOwned([]);
    setMessages([]);
    setDmMessages([]);
    setDmUser(null);
    setConversations([]);
    setUnreadDM(0);
    setEquipped(emptyEquipment());
    setEquipmentBusy(null);
    equipmentLockRef.current=false;
  }

  async function selectAvatar(name){
    if(!uid||(name==="UNKNOWN"&&!isFounder))return;
    const {data,error}=await supabase.from("profiles")
      .update({
        avatar:name,updated_at:new Date().toISOString()
      }).eq("id",uid).select().single();
    if(error)return alertUser(error.message);
    applyProfile(data);
  }

  async function loadShop(){
    const {data,error}=await supabase.from("shop_items")
      .select("*").eq("active",true);

    if(error){
      console.error("WHO Shop:",error);
      alertUser("Catalogo Shop: "+error.message);
      return;
    }

    const dbItems=(data||[]).map(row=>{
      const legacy=legacyShop.find(x=>x.id===row.id);
      const fallback=newShopFallback.find(x=>x.id===row.id);
      const category=row.category||legacy?.category||fallback?.category;
      const slot=legacy?.slot||
        (equipmentSlots.includes(category)?category:null);

      return {
        ...legacy,...fallback,
        id:row.id,
        name:row.name,
        rarity:row.rarity,
        price:Number(row.points_price??legacy?.price??fallback?.price??0),
        image:row.image_url||legacy?.image||fallback?.image||"",
        category,slot,
        description:row.description||"",
        active:row.active,
        legacy:!!legacy
      };
    });

    const byId=new Map();
    for(const item of [...legacyShop,...dbItems]){
      byId.set(item.id,item);
    }
    const uniqueNames=new Set();
    const clean=[...byId.values()].filter(item=>{
      const key=String(item.name||"")
        .trim().toLowerCase().replace(/\s+/g," ");
      if(uniqueNames.has(key))return false;
      uniqueNames.add(key);
      return true;
    });
    setCatalog(clean);
  }

  async function loadInventory(){
    if(!uid)return false;
    const [a,b]=await Promise.all([
      supabase.from("user_inventory")
        .select("item_id").eq("user_id",uid),
      supabase.from("profiles")
        .select("*").eq("id",uid).single()
    ]);
    if(a.error)alertUser("Inventario: "+a.error.message);
    else setOwned((a.data||[]).map(x=>x.item_id));
    if(b.error)alertUser("Profilo: "+b.error.message);
    else if(b.data)applyProfile(b.data);
    return !a.error&&!b.error;
  }

  async function buyItem(item){
    if(!uid)return alertUser("Devi effettuare l'accesso.");
    if(busyPurchase||equipmentLockRef.current)return;
    if(owned.includes(item.id))
      return alertUser("Possiedi già questo oggetto.");
    if(points<item.price)
      return alertUser(
        `WHO Points insufficienti: hai ${points}, ne servono ${item.price}.`
      );

    equipmentLockRef.current=true;
    setBusyPurchase(true);
    setNotice("");
    try{
      const {error}=await supabase.rpc("purchase_item",{
        p_item_id:item.id,p_price:item.price
      });
      if(error)throw error;
      const ok=await loadInventory();
      if(!ok)throw new Error(
        "Acquisto inviato, ma inventario non sincronizzato. Ricarica prima di riprovare."
      );
      alertUser(`${item.name}: acquisto completato.`);
    }catch(error){
      alertUser("SHOP: "+(error?.message||"Errore sconosciuto."));
    }finally{
      equipmentLockRef.current=false;
      setBusyPurchase(false);
    }
  }

  async function equipItem(item){
    if(!uid)return alertUser("Devi effettuare l'accesso.");
    if(!owned.includes(item.id))
      return alertUser("Non possiedi questo oggetto.");
    if(equipmentLockRef.current)return;

    if(!equipmentSlots.includes(item.slot))
      return alertUser(
        "Questo articolo non ha ancora uno slot di equipaggiamento configurato."
      );

    if(!item.legacy)
      return alertUser(
        "Nuovo articolo: equipaggiamento in attesa di aggiornamento della funzione SQL equip_item."
      );

    equipmentLockRef.current=true;
    setEquipmentBusy(item.id);
    setNotice("");
    try{
      const {error}=await supabase.rpc("equip_item",{
        p_item_id:item.id
      });
      if(error)throw error;
      setEquipped(old=>({...old,[item.slot]:item.id}));
      const ok=await loadInventory();
      if(!ok)throw new Error(
        "Equipaggiato, ma sincronizzazione non riuscita. Ricarica."
      );
      alertUser(`${item.name} equipaggiato.`);
    }catch(error){
      alertUser("Equipaggiamento: "+(error?.message||"Errore."));
    }finally{
      equipmentLockRef.current=false;
      setEquipmentBusy(null);
    }
  }

  async function unequipSlot(slot){
    if(!uid)return alertUser("Devi effettuare l'accesso.");
    if(!equipmentSlots.includes(slot))
      return alertUser("Slot non valido.");
    if(equipmentLockRef.current)return;
    if(!equipped[slot])
      return alertUser("Nessun accessorio equipaggiato.");

    equipmentLockRef.current=true;
    setEquipmentBusy(`remove-${slot}`);
    setNotice("");
    try{
      const {error}=await supabase.rpc("unequip_item",{
        p_slot:slot
      });
      if(error)throw error;
      setEquipped(old=>({...old,[slot]:null}));
      const ok=await loadInventory();
      if(!ok)throw new Error(
        "Accessorio rimosso, ma sincronizzazione non riuscita."
      );
      alertUser("Accessorio rimosso. Rimane nella collezione.");
    }catch(error){
      alertUser("Rimozione: "+(error?.message||"Errore."));
    }finally{
      equipmentLockRef.current=false;
      setEquipmentBusy(null);
    }
  }

  async function loadRooms(){
    const {data,error}=await supabase.from("rooms")
      .select("*").order("created_at",{ascending:true});
    if(error)return;
    setRooms([
      ...roomsDefault,
      ...(data||[]).filter(r=>
        !roomsDefault.some(d=>d.room_key===r.room_key)
      )
    ]);
  }

  async function createRoom(){
    const name=newRoomName.trim();
    if(name.length<3)
      return alertUser("Nome stanza minimo 3 caratteri.");
    const slug=name.toLowerCase()
      .replace(/[^a-z0-9]+/g,"-").slice(0,30);
    const {data,error}=await supabase.from("rooms").insert({
      room_key:`${slug}-${Date.now().toString(36)}`,
      name:name.slice(0,35).toUpperCase(),
      description:newRoomDescription.slice(0,120),
      creator_id:uid,
      creator_nickname:profile?.nickname||nickname,
      is_private:newRoomPrivate,is_official:false
    }).select().single();
    if(error)return alertUser(error.message);
    setRooms(old=>[...old,data]);
    setShowCreateRoom(false);
    setNewRoomName("");
    setNewRoomDescription("");
    setNewRoomPrivate(false);
  }

  async function loadMessages(){
    const target=roomRef.current;
    const {data,error}=await supabase.from("messages")
      .select("*").eq("room",target)
      .order("id",{ascending:true}).limit(300);
    if(error){
      console.error("WHO messages:",error);
      return;
    }
    if(roomRef.current!==target)return;
    setMessages(data||[]);
  }

  async function sendMessage(){
    const text=message.trim();
    if(!uid||!text||sending)return;
    setSending(true);
    const {error}=await supabase.from("messages").insert({
      room:currentRoom,user_id:uid,
      nickname:profile?.nickname||nickname,avatar,
      content:text.slice(0,500),likes:0,dislikes:0,
      message_color:messageColor,message_font:messageFont,
      reply_to_id:replyingTo?.id||null,
      reply_to_nickname:replyingTo?.nickname||null,
      reply_preview:replyingTo?.content?.slice(0,100)||null
    });
    setSending(false);
    if(error)return alertUser(error.message);
    setMessage("");
    setReplyingTo(null);
    nearBottomRef.current=true;
    await loadMessages();
  }

  async function loadVotes(){
    if(!uid)return;
    const {data,error}=await supabase.from("message_votes")
      .select("message_id,vote").eq("user_id",uid);
    if(!error)setMyVotes(Object.fromEntries(
      (data||[]).map(x=>[
        x.message_id,Number(x.vote)===1?"like":"dislike"
      ])
    ));
  }

  async function voteMessage(msg,vote){
    if(!uid)return;
    const {error}=await supabase.from("message_votes").upsert({
      message_id:msg.id,user_id:uid,
      vote:vote==="like"?1:-1
    },{onConflict:"message_id,user_id"});
    if(error)return alertUser(error.message);
    setMyVotes(old=>({...old,[msg.id]:vote}));
    await loadMessages();
  }

  async function loadReports(){
    if(!uid)return;
    const {data,error}=await supabase.from("message_reports")
      .select("message_id").eq("reporter_id",uid);
    if(!error)setReportedMessages(
      (data||[]).map(x=>x.message_id)
    );
  }

  async function reportMessage(msg){
    if(!uid||reportedMessages.includes(msg.id))return;
    const {error}=await supabase.from("message_reports").insert({
      message_id:msg.id,reporter_id:uid,reason:"user_report"
    });
    if(error)return alertUser(error.message);
    setReportedMessages(old=>[...old,msg.id]);
    alertUser("Segnalazione inviata.");
  }

  async function openUserProfile(msg){
    if(!msg?.user_id)return;
    const {data}=await supabase.from("profiles")
      .select("*").eq("id",msg.user_id).maybeSingle();
    setSelectedUser(data||{
      id:msg.user_id,nickname:msg.nickname,
      avatar:msg.avatar,vibe:100,
      reputation:100,who_points:0
    });
  }

  async function loadInbox(){
    if(!uid)return;
    const {data,error}=await supabase.from("direct_messages")
      .select("*")
      .or(`sender_id.eq.${uid},receiver_id.eq.${uid}`)
      .order("created_at",{ascending:false}).limit(500);
    if(error)return;
    const all=data||[];
    setUnreadDM(
      all.filter(m=>m.receiver_id===uid&&!m.is_read).length
    );
    const peers=new Map();
    for(const m of all){
      const other=m.sender_id===uid?m.receiver_id:m.sender_id;
      if(!peers.has(other)){
        peers.set(other,{
          id:other,
          nickname:m.sender_id===uid
            ?m.receiver_nickname:m.sender_nickname,
          avatar:m.sender_id===uid?"Shadow":m.sender_avatar,
          last:m.content,unread:0
        });
      }
      if(m.receiver_id===uid&&!m.is_read)
        peers.get(other).unread++;
    }
    setConversations([...peers.values()]);
  }

  async function loadDirectMessages(user){
    if(!uid||!user?.id)return;
    const {data,error}=await supabase.from("direct_messages")
      .select("*")
      .or(
        `and(sender_id.eq.${uid},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${uid})`
      )
      .order("created_at",{ascending:true});
    if(error){
      console.error("WHO DM:",error);
      return;
    }
    setDmMessages(data||[]);
    await supabase.from("direct_messages")
      .update({is_read:true})
      .eq("sender_id",user.id)
      .eq("receiver_id",uid)
      .eq("is_read",false);
    await loadInbox();
  }

  async function openPrivateChat(user){
    if(!user?.id||user.id===uid)return;
    setSelectedUser(null);
    setDmUser(user);
    setDmMessages([]);
    setPage("dm");
  }

  async function sendDirectMessage(){
    const text=dmText.trim();
    if(!text||!dmUser?.id||!uid||dmSending)return;
    setDmSending(true);
    const {error}=await supabase.from("direct_messages").insert({
      sender_id:uid,receiver_id:dmUser.id,
      sender_nickname:profile?.nickname||nickname,
      sender_avatar:avatar,
      receiver_nickname:dmUser.nickname,
      content:text.slice(0,500),
      message_color:messageColor,message_font:messageFont,
      is_read:false
    });
    setDmSending(false);
    if(error)return alertUser(error.message);
    setDmText("");
    await loadDirectMessages(dmUser);
  }

  async function saveStyle(field,value){
    const {error}=await supabase.from("profiles")
      .update({[field]:value}).eq("id",uid);
    if(error)return alertUser(error.message);
    if(field==="message_color")setMessageColor(value);
    else setMessageFont(value);
  }

  useEffect(()=>{
    if(!uid||started!==true)return;
    loadInventory();
    loadShop();
    loadRooms();
    loadVotes();
    loadReports();
    loadInbox();
  },[uid,started]);

  useEffect(()=>{
    if(!uid||started!==true)return;
    roomRef.current=currentRoom;
    setMessages([]);
    setNewMessages(0);
    lastMessageRef.current=null;
    nearBottomRef.current=true;
    loadMessages();

    const ch=supabase.channel(`who-public-${currentRoom}`)
      .on("postgres_changes",{
        event:"*",schema:"public",table:"messages",
        filter:`room=eq.${currentRoom}`
      },()=>loadMessages()).subscribe();

    const timer=setInterval(loadMessages,5000);
    return ()=>{
      clearInterval(timer);
      supabase.removeChannel(ch);
    };
  },[uid,started,currentRoom]);

  useEffect(()=>{
    if(!uid||started!==true)return;
    loadInbox();
    const ch=supabase.channel(`who-inbox-${uid}`)
      .on("postgres_changes",{
        event:"INSERT",schema:"public",
        table:"direct_messages",
        filter:`receiver_id=eq.${uid}`
      },()=>loadInbox()).subscribe();
    const timer=setInterval(loadInbox,6000);
    return ()=>{
      clearInterval(timer);
      supabase.removeChannel(ch);
    };
  },[uid,started]);

  useEffect(()=>{
    if(page!=="dm"||!dmUser?.id||!uid)return;
    loadDirectMessages(dmUser);
    const timer=setInterval(
      ()=>loadDirectMessages(dmUser),5000
    );
    return ()=>clearInterval(timer);
  },[page,dmUser?.id,uid]);

  useEffect(()=>{
    if(!uid||started!==true)return;
    const ch=supabase.channel("who-global-presence",{
      config:{presence:{key:uid}}
    });
    presenceRef.current=ch;
    ch.on("presence",{event:"sync"},()=>{
      const result={};
      for(const entries of Object.values(ch.presenceState())){
        for(const p of entries){
          if(p.user_id)result[p.user_id]=p.room;
        }
      }
      setOnline(result);
    }).subscribe(async status=>{
      if(status==="SUBSCRIBED"){
        await ch.track({
          user_id:uid,room:roomRef.current
        });
      }
    });
    return ()=>{
      presenceRef.current=null;
      supabase.removeChannel(ch);
    };
  },[uid,started]);

  useEffect(()=>{
    if(uid&&presenceRef.current){
      presenceRef.current.track({
        user_id:uid,room:currentRoom
      });
    }
  },[uid,currentRoom]);

  useEffect(()=>{
    const el=publicChatRef.current;
    if(!el||page!=="chat")return;
    const last=messages[messages.length-1]?.id;
    if(last!==lastMessageRef.current){
      if(lastMessageRef.current!==null&&!nearBottomRef.current){
        setNewMessages(n=>n+1);
      }else{
        requestAnimationFrame(()=>{
          el.scrollTop=el.scrollHeight;
        });
      }
      lastMessageRef.current=last;
    }
  },[messages,page]);

  useEffect(()=>{
    if(page==="dm"&&dmChatRef.current){
      dmChatRef.current.scrollTop=dmChatRef.current.scrollHeight;
    }
  },[dmMessages,page]);

  function Logo(){
    return (
      <div style={{
        fontFamily:displayFont,fontSize:39,fontWeight:900,
        background:"linear-gradient(90deg,#fff,#f0b4ff,#9b63ff,#6eeeff)",
        WebkitBackgroundClip:"text",
        WebkitTextFillColor:"transparent"
      }}>WHO</div>
    );
  }

  function Nav(){
    return (
      <nav style={{
        position:"fixed",bottom:0,left:0,right:0,zIndex:100,
        display:"grid",gridTemplateColumns:"repeat(5,1fr)",
        background:"rgba(7,5,10,.98)",
        borderTop:`1px solid ${C.border}`,
        padding:"8px 2px 12px"
      }}>
        {[
          ["chat","✦","Chat"],["inbox","✉","Privati"],
          ["rooms","◉","Stanze"],["shop","◇","Shop"],
          ["profile","●","Profilo"]
        ].map(([id,symbol,label])=>(
          <button key={id} onClick={()=>setPage(id)}
            style={{
              position:"relative",border:0,
              background:"transparent",
              color:page===id?"#edaaff":"#776d7b",
              fontWeight:900,fontSize:10
            }}>
            <div style={{fontSize:19}}>{symbol}</div>
            {label}
            {id==="inbox"&&unreadDM>0&&(
              <span style={{
                position:"absolute",top:-3,right:"12%",
                borderRadius:20,background:C.red,color:"white",
                padding:"2px 5px",fontSize:9
              }}>{unreadDM>99?"99+":unreadDM}</span>
            )}
          </button>
        ))}
      </nav>
    );
  }

  function Notice(){
    if(!notice)return null;
    return (
      <div role="alert" style={{
        position:"fixed",bottom:95,left:14,right:14,
        maxWidth:600,margin:"auto",zIndex:900,
        ...panel,padding:15,
        border:`1px solid ${C.pink}`,
        boxShadow:"0 0 30px rgba(0,0,0,.8)"
      }}>
        <strong style={{color:C.pink}}>WHO</strong>
        <p style={{
          fontSize:12,overflowWrap:"anywhere",
          whiteSpace:"pre-wrap"
        }}>{notice}</p>
        <button style={buttonStyle}
          onClick={()=>setNotice("")}>OK</button>
      </div>
    );
  }

  if(loading)return (
    <main style={{
      ...background,display:"grid",placeItems:"center"
    }}><Logo/></main>
  );

  if(!session)return (
    <main style={background}>
      <section style={{
        maxWidth:420,margin:"auto",padding:"75px 20px"
      }}>
        <div style={{textAlign:"center",marginBottom:25}}>
          <Logo/>
          <p style={{color:C.muted}}>
            Nessun nome. Nessun giudizio. Solo WHO.
          </p>
        </div>
        <div style={{...panel,padding:20}}>
          <h2>{authMode==="login"
            ?"Bentornato in WHO":"Crea il tuo account WHO"}</h2>
          <input style={inputStyle} placeholder="Nickname"
            value={nickname}
            onChange={e=>setNickname(
              cleanNickname(e.target.value)
            )}/>
          <input style={{...inputStyle,marginTop:9}}
            type="password" placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}/>
          {authError&&<p style={{color:C.red}}>{authError}</p>}
          <button style={{
            ...buttonStyle,width:"100%",marginTop:14
          }} onClick={authMode==="login"?login:register}>
            {authMode==="login"?"ACCEDI":"CREA ACCOUNT"}
          </button>
          <button style={{
            ...secondaryButton,width:"100%",marginTop:10
          }} onClick={()=>{
            setAuthMode(
              authMode==="login"?"register":"login"
            );
            setAuthError("");
          }}>
            {authMode==="login"
              ?"Non hai un account? Registrati"
              :"Hai già un account? Accedi"}
          </button>
        </div>
      </section>
      <Notice/>
    </main>
  );

  if(started==="identity")return (
    <main style={background}>
      <section style={{
        maxWidth:650,margin:"auto",padding:18
      }}>
        <h1>Scegli la tua identità</h1>
        <div style={{
          display:"grid",gridTemplateColumns:"repeat(2,1fr)",
          gap:10
        }}>
          {[...(isFounder?[ownerAvatar]:[]),...avatars]
            .map(a=>(
              <button key={a.name}
                onClick={()=>selectAvatar(a.name)}
                style={{
                  ...panel,padding:13,textAlign:"center"
                }}>
                <AvatarView name={a.name} size={105}
                  catalog={catalog}
                  equipment={avatar===a.name?equipped:{}}/>
                <div style={{
                  marginTop:12,color:C.pink,fontWeight:900
                }}>
                  {avatar===a.name?"✓ SELEZIONATO":"SCEGLI"}
                </div>
              </button>
            ))}
        </div>
        <button style={{
          ...buttonStyle,width:"100%",marginTop:15,padding:16
        }} onClick={()=>setStarted(true)}>
          CONTINUA →
        </button>
      </section>
      <Notice/>
    </main>
  );

  // CONTINUA IMMEDIATAMENTE CON IL BLOCCO 2
  if(page==="rooms")return (
    <main style={background}>
      <section style={{maxWidth:650,margin:"auto",padding:18}}>
        <header style={{
          display:"flex",justifyContent:"space-between",
          alignItems:"center",gap:10
        }}>
          <h1 style={{fontFamily:displayFont}}>STANZE</h1>
          <button style={buttonStyle}
            onClick={()=>setShowCreateRoom(!showCreateRoom)}>
            ＋ CREA
          </button>
        </header>
        <div style={{
          ...panel,padding:13,marginBottom:12,
          color:C.green,fontSize:12
        }}>
          ● {Object.keys(online).length} utenti online su WHO
        </div>
        {showCreateRoom&&(
          <div style={{...panel,padding:15,marginBottom:14}}>
            <h3>CREA UNA STANZA</h3>
            <input style={inputStyle} placeholder="Nome stanza"
              maxLength={35} value={newRoomName}
              onChange={e=>setNewRoomName(e.target.value)}/>
            <input style={{...inputStyle,marginTop:8}}
              placeholder="Descrizione" maxLength={120}
              value={newRoomDescription}
              onChange={e=>setNewRoomDescription(e.target.value)}/>
            <label style={{
              display:"flex",alignItems:"center",gap:8,
              margin:"12px 0",color:C.muted
            }}>
              <input type="checkbox" checked={newRoomPrivate}
                onChange={e=>setNewRoomPrivate(e.target.checked)}/>
              Stanza privata
            </label>
            <div style={{display:"flex",gap:8}}>
              <button style={secondaryButton}
                onClick={()=>setShowCreateRoom(false)}>
                ANNULLA
              </button>
              <button style={buttonStyle}
                onClick={createRoom}>CREA STANZA</button>
            </div>
          </div>
        )}
        {rooms.map(r=>(
          <button key={r.id} style={{
            ...panel,width:"100%",padding:15,
            textAlign:"left",marginBottom:9
          }} onClick={()=>{
            if(r.is_private&&!r.is_official&&r.creator_id!==uid){
              alertUser("Questa stanza è privata. L'accesso richiede un sistema di inviti.");
              return;
            }
            setActiveRoom(r);
            setPage("chat");
          }}>
            <strong>{r.is_private?"🔒":"✦"} {r.name}</strong>
            <p style={{fontSize:11,color:C.muted,margin:"6px 0"}}>
              {r.description}
            </p>
            <small style={{color:C.cyan}}>
              {Object.values(online).filter(
                x=>x===roomKey(r)
              ).length} online
              {" · "}
              {r.is_official?"UFFICIALE":"COMMUNITY"}
            </small>
          </button>
        ))}
      </section>
      <Notice/>
      <Nav/>
    </main>
  );

  if(page==="inbox")return (
    <main style={background}>
      <section style={{maxWidth:650,margin:"auto",padding:18}}>
        <h1 style={{fontFamily:displayFont}}>MESSAGGI PRIVATI</h1>
        <p style={{color:C.muted,fontSize:12}}>
          Le tue conversazioni e i messaggi non letti.
        </p>
        <button style={{
          ...secondaryButton,marginBottom:14
        }} onClick={loadInbox}>↻ AGGIORNA</button>
        {conversations.length===0&&(
          <div style={{...panel,padding:20,textAlign:"center"}}>
            Nessuna conversazione ancora.
            <p style={{fontSize:12,color:C.muted}}>
              Apri il profilo di un utente nella chat pubblica
              e premi MESSAGGIO PRIVATO.
            </p>
          </div>
        )}
        {conversations.map(c=>(
          <button key={c.id} style={{
            ...panel,width:"100%",padding:12,marginBottom:8,
            display:"flex",alignItems:"center",
            gap:12,textAlign:"left"
          }} onClick={()=>openPrivateChat(c)}>
            <AvatarView name={c.avatar||"Shadow"}
              size={45} catalog={catalog}/>
            <div style={{flex:1,minWidth:0}}>
              <strong>@{c.nickname||"utente"}</strong>
              <div style={{
                fontSize:11,color:C.muted,
                overflow:"hidden",textOverflow:"ellipsis",
                whiteSpace:"nowrap"
              }}>{c.last}</div>
            </div>
            {c.unread>0&&(
              <span style={{
                background:C.red,color:"white",
                borderRadius:20,padding:"4px 7px",
                fontSize:10,fontWeight:900
              }}>{c.unread}</span>
            )}
          </button>
        ))}
      </section>
      <Notice/>
      <Nav/>
    </main>
  );

  if(page==="dm"&&dmUser)return (
    <main style={{
      ...background,height:"100dvh",
      overflow:"hidden",paddingBottom:0
    }}>
      <section style={{
        maxWidth:650,margin:"auto",height:"100%",
        padding:"12px 14px 80px",boxSizing:"border-box",
        display:"flex",flexDirection:"column"
      }}>
        <header style={{
          display:"flex",alignItems:"center",
          gap:10,paddingBottom:12,
          borderBottom:`1px solid ${C.border}`
        }}>
          <button style={secondaryButton}
            onClick={()=>setPage("inbox")}>‹</button>
          <button style={{
            background:"transparent",border:0,color:"white",
            display:"flex",alignItems:"center",gap:10
          }} onClick={()=>setSelectedUser(dmUser)}>
            <AvatarView name={dmUser.avatar||"Shadow"}
              size={42} catalog={catalog}/>
            <div style={{textAlign:"left"}}>
              <small style={{color:C.pink}}>CHAT PRIVATA</small>
              <div><strong>@{dmUser.nickname}</strong></div>
            </div>
          </button>
        </header>
        <div ref={dmChatRef} style={{
          flex:1,minHeight:0,overflowY:"auto",paddingTop:12
        }}>
          {dmMessages.length===0&&(
            <div style={{
              ...panel,padding:20,textAlign:"center",
              color:C.muted,fontSize:12
            }}>
              Nessun messaggio. Inizia la conversazione.
            </div>
          )}
          {dmMessages.map(m=>{
            const mine=m.sender_id===uid;
            return (
              <div key={m.id} style={{
                display:"flex",
                justifyContent:mine?"flex-end":"flex-start",
                marginBottom:9
              }}>
                <div style={{
                  ...panel,maxWidth:"82%",padding:"10px 12px",
                  background:mine?"#30133f":"#17101f",
                  borderRadius:mine
                    ?"15px 15px 4px 15px"
                    :"15px 15px 15px 4px"
                }}>
                  {!mine&&(
                    <div style={{
                      color:C.pink,fontSize:10,
                      fontWeight:900,marginBottom:4
                    }}>@{m.sender_nickname||dmUser.nickname}</div>
                  )}
                  <div style={messageStyle(m)}>{m.content}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{
          ...panel,padding:5,display:"flex",gap:6
        }}>
          <input style={{
            ...inputStyle,flex:1,minWidth:0,
            border:0,background:"transparent",
            color:getMessageColor(messageColor),
            fontFamily:getMessageFont(messageFont)
          }} value={dmText} maxLength={500}
            placeholder={`Messaggio a @${dmUser.nickname}`}
            onChange={e=>setDmText(e.target.value)}
            onKeyDown={e=>{
              if(e.key==="Enter"){
                e.preventDefault();
                sendDirectMessage();
              }
            }}/>
          <button style={buttonStyle}
            disabled={dmSending||!dmText.trim()}
            onClick={sendDirectMessage}>➤</button>
        </div>
      </section>
      <Notice/>
      <Nav/>
    </main>
  );

  if(page==="shop")return (
    <main style={background}>
      <section style={{maxWidth:650,margin:"auto",padding:18}}>
        <header style={{
          display:"flex",alignItems:"center",
          justifyContent:"space-between",gap:8
        }}>
          <h1 style={{fontFamily:displayFont}}>WHO SHOP</h1>
          <button style={secondaryButton}
            onClick={loadShop}>↻</button>
        </header>
        <div style={{
          ...panel,padding:15,marginBottom:14,
          display:"flex",justifyContent:"space-between",
          alignItems:"center"
        }}>
          <strong style={{color:C.pink}}>
            ✦ {points} WHO Points
          </strong>
          <small style={{color:C.muted}}>
            {owned.length} posseduti
          </small>
        </div>
        <p style={{fontSize:12,color:C.muted}}>
          Sblocca gli articoli con i WHO Points.
          Gli acquisti rimangono nella tua collezione.
        </p>
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(2,minmax(0,1fr))",
          gap:10
        }}>
          {catalog.map(item=>{
            const hasItem=owned.includes(item.id);
            const canEquip=equipmentSlots.includes(item.slot)
              &&item.legacy;
            const active=canEquip&&equipped[item.slot]===item.id;
            const insufficient=!hasItem&&points<item.price;
            const busy=busyPurchase||!!equipmentBusy;

            return (
              <div key={item.id} style={{
                ...panel,overflow:"hidden",
                border:active?`1px solid ${C.cyan}`:panel.border
              }}>
                <ShopPicture item={item} size={155}/>
                <div style={{padding:12}}>
                  <strong style={{fontSize:12}}>
                    {item.name}
                  </strong>
                  <div style={{
                    color:item.rarity==="MYTHIC"?"#ffce76":
                      item.rarity==="LIMITED"?C.cyan:C.pink,
                    fontSize:10,marginTop:5,fontWeight:900
                  }}>{item.rarity}</div>
                  <div style={{
                    color:C.muted,fontSize:10,marginTop:4
                  }}>
                    {String(item.category||item.slot||"ITEM").toUpperCase()}
                  </div>
                  <p style={{
                    color:"#dc9aff",fontWeight:900
                  }}>✦ {item.price}</p>
                  {insufficient&&(
                    <p style={{color:C.red,fontSize:10}}>
                      Ti mancano {item.price-points} WHO Points
                    </p>
                  )}
                  {active&&(
                    <p style={{
                      color:C.cyan,fontSize:10,fontWeight:900
                    }}>● EQUIPAGGIATO</p>
                  )}
                  {hasItem&&!canEquip&&(
                    <p style={{
                      color:C.muted,fontSize:10
                    }}>
                      Nella collezione. Equipaggiamento
                      non ancora configurato.
                    </p>
                  )}
                  <button type="button" style={{
                    ...buttonStyle,width:"100%",fontSize:10,
                    opacity:busy?0.6:1
                  }}
                    disabled={busy||hasItem&&!canEquip}
                    onClick={()=>{
                      setNotice("");
                      if(!hasItem)buyItem(item);
                      else if(active)unequipSlot(item.slot);
                      else equipItem(item);
                    }}>
                    {busyPurchase&&!hasItem?"ATTENDI...":
                      equipmentBusy===item.id?"EQUIPAGGIAMENTO...":
                      !hasItem?"SBLOCCA":
                      !canEquip?"POSSEDUTO":
                      active?"✓ RIMUOVI":"EQUIPAGGIA"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <Notice/>
      <Nav/>
    </main>
  );

  if(page==="profile"){
    const ownedItems=catalog.filter(x=>owned.includes(x.id));
    return (
      <main style={background}>
        <section style={{maxWidth:650,margin:"auto",padding:18}}>
          <div style={{
            textAlign:"center",padding:"25px 0 15px"
          }}>
            <div style={{
              minHeight:180,display:"grid",placeItems:"center"
            }}>
              <AvatarView name={avatar} size={130}
                equipment={equipped} catalog={catalog}/>
            </div>
            <h1>@{nickname}</h1>
            {isFounder&&(
              <strong style={{color:C.pink}}>
                ♛ WHO FOUNDER
              </strong>
            )}
          </div>
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(3,1fr)",gap:8
          }}>
            {[
              ["POINTS",`✦ ${points}`],
              ["VIBE",`⚡ ${vibe}`],
              ["LEVEL",level]
            ].map(([label,value])=>(
              <div key={label} style={{
                ...panel,padding:12,textAlign:"center"
              }}>
                <small style={{color:C.muted}}>{label}</small>
                <h2>{value}</h2>
              </div>
            ))}
          </div>

          <div style={{...panel,padding:15,marginTop:12}}>
            <h3>I MIEI ITEM ({ownedItems.length})</h3>
            {ownedItems.length===0&&(
              <p style={{color:C.muted,fontSize:12}}>
                Non possiedi ancora item. Visita WHO Shop.
              </p>
            )}
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(2,minmax(0,1fr))",
              gap:8
            }}>
              {ownedItems.map(item=>{
                const canEquip=item.legacy&&
                  equipmentSlots.includes(item.slot);
                const active=canEquip&&
                  equipped[item.slot]===item.id;

                return (
                  <div key={item.id} style={{
                    ...panel,padding:9,textAlign:"center",
                    border:active?`1px solid ${C.cyan}`:panel.border
                  }}>
                    <ShopPicture item={item} size={105}/>
                    <div style={{
                      fontSize:11,fontWeight:900,marginTop:8
                    }}>{item.name}</div>
                    <small style={{
                      color:active?C.cyan:C.muted
                    }}>
                      {active?"● EQUIPAGGIATO":
                        (item.category||item.slot||"ITEM").toUpperCase()}
                    </small>
                    <button style={{
                      ...buttonStyle,width:"100%",
                      fontSize:10,marginTop:8,
                      opacity:equipmentBusy||busyPurchase?0.6:1
                    }}
                      disabled={
                        !!equipmentBusy||busyPurchase||!canEquip
                      }
                      onClick={()=>
                        active?unequipSlot(item.slot):equipItem(item)
                      }>
                      {!canEquip?"NELLA COLLEZIONE":
                        equipmentBusy===item.id?"ATTENDI...":
                        active?"RIMUOVI":"EQUIPAGGIA"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{...panel,padding:15,marginTop:12}}>
            <h3>EQUIPAGGIAMENTO ATTIVO</h3>
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(2,1fr)",gap:8
            }}>
              {[
                ["head","👑 TESTA"],
                ["face","◈ VISO"],
                ["aura","✦ AURA"],
                ["frame","◇ CORNICE"]
              ].map(([slot,label])=>{
                const item=catalog.find(
                  x=>x.id===equipped[slot]
                );
                return (
                  <div key={slot} style={{
                    background:"#09070c",
                    border:`1px solid ${C.border}`,
                    borderRadius:11,padding:10
                  }}>
                    <small style={{color:C.muted}}>{label}</small>
                    <div style={{
                      fontSize:11,marginTop:5,
                      color:item?C.cyan:C.muted
                    }}>
                      {item?.name||"VUOTO"}
                    </div>
                    {item&&(
                      <button style={{
                        ...secondaryButton,width:"100%",
                        marginTop:8,fontSize:10,color:C.red
                      }}
                        disabled={!!equipmentBusy||busyPurchase}
                        onClick={()=>unequipSlot(slot)}>
                        {equipmentBusy===`remove-${slot}`
                          ?"RIMOZIONE...":"RIMUOVI"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{...panel,padding:15,marginTop:12}}>
            <h3>STILE MESSAGGI</h3>
            <div style={{
              ...panel,padding:13,
              ...messageStyle({
                message_color:messageColor,
                message_font:messageFont
              })
            }}>
              Questo è il mio stile WHO.
            </div>
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(3,1fr)",
              gap:7,marginTop:12
            }}>
              {Object.keys(messageColors).map(value=>(
                <button key={value}
                  onClick={()=>saveStyle("message_color",value)}
                  style={{
                    ...secondaryButton,
                    color:messageColors[value],
                    border:messageColor===value
                      ?`1px solid ${messageColors[value]}`
                      :secondaryButton.border
                  }}>
                  ● {value.toUpperCase()}
                </button>
              ))}
            </div>
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(2,1fr)",
              gap:7,marginTop:12
            }}>
              {Object.keys(messageFonts).map(value=>(
                <button key={value}
                  onClick={()=>saveStyle("message_font",value)}
                  style={{
                    ...secondaryButton,
                    fontFamily:messageFonts[value],
                    fontWeight:value==="bold"?900:400,
                    fontStyle:value==="elegant"?"italic":"normal",
                    border:messageFont===value
                      ?`1px solid ${C.pink}`
                      :secondaryButton.border
                  }}>
                  {value.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{...panel,padding:15,marginTop:12}}>
            <h3>REPUTAZIONE</h3>
            <strong style={{
              color:reputation>=70?C.green:C.red
            }}>
              {reputation>=70?"✓ IN REGOLA":"⚠ DA VERIFICARE"}
            </strong>
            <p>{reputation}/100</p>
            <p style={{color:C.muted,fontSize:11}}>
              Le segnalazioni non applicano automaticamente penalità.
            </p>
          </div>

          <div style={{...panel,padding:15,marginTop:12}}>
            <h3>WHO POINTS E VIBE</h3>
            <p style={{fontSize:12,color:C.muted}}>
              I WHO Points servono per acquistare gli item dello shop.
              Il sistema automatico di ricompense deve essere
              implementato e verificato sul database.
            </p>
            <p style={{fontSize:12,color:C.muted}}>
              VIBE rappresenta il punteggio sociale. Il calcolo
              automatico e le regole di moderazione richiedono
              una funzione sicura su Supabase.
            </p>
          </div>

          <button style={{
            ...secondaryButton,
            width:"100%",marginTop:12,padding:15
          }} onClick={()=>setStarted("identity")}>
            CAMBIA AVATAR
          </button>
          <button style={{
            ...secondaryButton,
            width:"100%",marginTop:10,
            padding:15,color:C.red
          }} onClick={logout}>ESCI</button>
        </section>
        <Notice/>
        <Nav/>
      </main>
    );
  }

  return (
    <main style={{
      ...background,height:"100dvh",
      overflow:"hidden",paddingBottom:0
    }}>
      <section style={{
        maxWidth:650,height:"100%",margin:"auto",
        padding:"12px 14px 78px",boxSizing:"border-box",
        display:"flex",flexDirection:"column"
      }}>
        <header style={{
          display:"flex",justifyContent:"space-between",
          alignItems:"center",minHeight:58
        }}>
          <Logo/>
          <div style={{display:"flex",gap:6}}>
            <button style={{
              ...secondaryButton,position:"relative"
            }} onClick={()=>setPage("inbox")}>
              ✉ PRIVATI
              {unreadDM>0&&(
                <span style={{
                  position:"absolute",top:-7,right:-7,
                  background:C.red,color:"#fff",
                  borderRadius:20,padding:"2px 6px",fontSize:10
                }}>{unreadDM}</span>
              )}
            </button>
            <button style={secondaryButton}
              onClick={()=>setPage("rooms")}>
              ◉ Stanze
            </button>
          </div>
        </header>

        <div style={{
          display:"flex",justifyContent:"space-between",
          alignItems:"center",marginBottom:8
        }}>
          <div>
            <small style={{color:"#c879ef"}}>CHAT PUBBLICA</small>
            <div style={{
              fontFamily:displayFont,fontSize:19
            }}>{activeRoom.name}</div>
            <div style={{
              color:C.green,fontSize:10,marginTop:4
            }}>
              ● {Object.keys(online).length} online WHO
              {" · "}
              {Object.values(online).filter(
                x=>x===currentRoom
              ).length} in stanza
            </div>
          </div>
          <div style={{
            display:"flex",alignItems:"center",gap:8
          }}>
            <AvatarView name={avatar} size={35}
              equipment={equipped} catalog={catalog}/>
            <small style={{color:C.muted}}>⚡ {vibe}</small>
          </div>
        </div>

        <div ref={publicChatRef}
          onScroll={e=>{
            const el=e.currentTarget;
            nearBottomRef.current=
              el.scrollHeight-el.scrollTop-el.clientHeight<100;
            if(nearBottomRef.current)setNewMessages(0);
          }}
          style={{
            flex:1,overflowY:"auto",minHeight:0
          }}>
          {messages.length===0&&(
            <p style={{
              color:C.muted,textAlign:"center",fontSize:12
            }}>
              Nessun messaggio in questa stanza.
            </p>
          )}
          {messages.map(msg=>{
            const mine=msg.user_id===uid;
            const reported=reportedMessages.includes(msg.id);
            return (
              <article key={msg.id} style={{
                background:mine
                  ?"rgba(112,37,150,.10)"
                  :"rgba(255,255,255,.018)",
                border:"1px solid rgba(190,100,255,.08)",
                borderRadius:12,padding:8,marginBottom:6
              }}>
                <div style={{display:"flex",gap:8}}>
                  <button disabled={mine}
                    onClick={()=>openUserProfile(msg)}
                    style={{
                      background:"transparent",border:0,
                      padding:0,height:34
                    }}>
                    <AvatarView name={msg.avatar}
                      size={34} catalog={catalog}
                      equipment={mine?equipped:{}}/>
                  </button>
                  <div style={{flex:1,minWidth:0}}>
                    <button disabled={mine}
                      onClick={()=>openUserProfile(msg)}
                      style={{
                        background:"transparent",border:0,
                        color:"#fff",fontWeight:900,
                        padding:0,fontFamily:font
                      }}>
                      @{msg.nickname||"anonimo"}
                    </button>
                    {msg.reply_to_nickname&&(
                      <div style={{
                        borderLeft:`2px solid ${C.purple}`,
                        paddingLeft:7,color:C.muted,
                        fontSize:10,marginTop:4
                      }}>
                        ↩ @{msg.reply_to_nickname}
                        {msg.reply_preview
                          ?` · ${msg.reply_preview}`:""}
                      </div>
                    )}
                    <div style={{
                      ...messageStyle(msg),margin:"6px 0"
                    }}>{msg.content}</div>
                    <div style={{
                      display:"flex",gap:5,
                      flexWrap:"wrap",marginTop:7
                    }}>
                      <button style={secondaryButton}
                        onClick={()=>setReplyingTo(msg)}>
                        ↩
                      </button>
                      {!mine&&(
                        <>
                          <button style={{
                            ...secondaryButton,
                            color:C.pink,fontSize:10
                          }} onClick={()=>openUserProfile(msg)}>
                            ● PROFILO
                          </button>
                          <button style={{
                            ...secondaryButton,
                            color:C.cyan,fontSize:10
                          }} onClick={()=>openPrivateChat({
                            id:msg.user_id,
                            nickname:msg.nickname,
                            avatar:msg.avatar
                          })}>
                            ✉ PRIVATO
                          </button>
                        </>
                      )}
                      <button style={{
                        ...secondaryButton,
                        color:myVotes[msg.id]==="like"
                          ?C.cyan:C.muted
                      }} onClick={()=>voteMessage(msg,"like")}>
                        ♡ {msg.likes||0}
                      </button>
                      <button style={{
                        ...secondaryButton,
                        color:myVotes[msg.id]==="dislike"
                          ?C.pink:C.muted
                      }} onClick={()=>voteMessage(msg,"dislike")}>
                        ♢− {msg.dislikes||0}
                      </button>
                      {!mine&&(
                        <button style={{
                          ...secondaryButton,color:C.red,
                          opacity:reported?.4:1
                        }}
                          disabled={reported}
                          onClick={()=>reportMessage(msg)}>
                          ⚑
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {newMessages>0&&(
          <button style={{
            ...buttonStyle,width:"100%",marginTop:5
          }} onClick={()=>{
            const el=publicChatRef.current;
            if(el)el.scrollTop=el.scrollHeight;
            nearBottomRef.current=true;
            setNewMessages(0);
          }}>
            ↓ {newMessages} nuovi messaggi
          </button>
        )}

        {replyingTo&&(
          <div style={{
            ...panel,padding:9,marginTop:5,
            display:"flex",alignItems:"center",gap:10
          }}>
            <div style={{
              flex:1,fontSize:11,overflowWrap:"anywhere"
            }}>
              <strong style={{color:C.pink}}>
                ↩ @{replyingTo.nickname}
              </strong>
              <div style={{color:C.muted}}>
                {replyingTo.content?.slice(0,100)}
              </div>
            </div>
            <button style={secondaryButton}
              onClick={()=>setReplyingTo(null)}>✕</button>
          </div>
        )}

        <div style={{
          ...panel,padding:5,display:"flex",
          gap:6,marginTop:6
        }}>
          <input style={{
            ...inputStyle,flex:1,minWidth:0,
            border:0,background:"transparent",
            color:getMessageColor(messageColor),
            fontFamily:getMessageFont(messageFont)
          }}
            value={message} maxLength={500}
            placeholder="Scrivi qualcosa..."
            onChange={e=>setMessage(e.target.value)}
            onKeyDown={e=>{
              if(e.key==="Enter"){
                e.preventDefault();
                sendMessage();
              }
            }}/>
          <button style={buttonStyle}
            disabled={sending||!message.trim()}
            onClick={sendMessage}>
            {sending?"…":"➤"}
          </button>
        </div>
      </section>

      {selectedUser&&(
        <div onClick={()=>setSelectedUser(null)}
          style={{
            position:"fixed",inset:0,zIndex:500,
            background:"rgba(0,0,0,.82)",
            display:"grid",placeItems:"center",padding:18
          }}>
          <div onClick={e=>e.stopPropagation()}
            style={{
              ...panel,width:"100%",maxWidth:390,
              padding:20,textAlign:"center",
              boxShadow:"0 0 50px rgba(181,76,255,.18)"
            }}>
            <button style={{
              ...secondaryButton,float:"right"
            }} onClick={()=>setSelectedUser(null)}>✕</button>
            <div style={{
              display:"grid",placeItems:"center",
              padding:"20px 0 5px"
            }}>
              <AvatarView
                name={selectedUser.avatar||"Shadow"}
                size={105} catalog={catalog}
                equipment={{
                  head:selectedUser.equipped_head,
                  face:selectedUser.equipped_face,
                  aura:selectedUser.equipped_aura,
                  frame:selectedUser.equipped_frame
                }}/>
            </div>
            <h2>@{selectedUser.nickname||"anonimo"}</h2>
            {String(selectedUser.role||"").toUpperCase()==="FOUNDER"&&(
              <strong style={{color:C.pink}}>
                ♛ WHO FOUNDER
              </strong>
            )}
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(3,1fr)",
              gap:7,marginTop:18
            }}>
              {[
                ["VIBE",`⚡ ${selectedUser.vibe??100}`],
                ["LEVEL",Math.max(1,Math.floor(
                  Number(selectedUser.who_points??0)/250
                )+1)],
                ["REP",selectedUser.reputation??100]
              ].map(([label,value])=>(
                <div key={label} style={{
                  background:"#09070c",
                  border:`1px solid ${C.border}`,
                  borderRadius:12,padding:10
                }}>
                  <small style={{color:C.muted}}>
                    {label}
                  </small>
                  <strong style={{
                    display:"block",marginTop:5
                  }}>{value}</strong>
                </div>
              ))}
            </div>
            {selectedUser.id!==uid&&(
              <button style={{
                ...buttonStyle,width:"100%",
                padding:14,marginTop:16
              }} onClick={()=>openPrivateChat(selectedUser)}>
                ✉ MESSAGGIO PRIVATO
              </button>
            )}
            <button style={{
              ...secondaryButton,
              width:"100%",marginTop:9
            }} onClick={()=>setSelectedUser(null)}>
              CHIUDI
            </button>
          </div>
        </div>
      )}
      <Notice/>
      <Nav/>
    </main>
  );
}
