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
].map(name => ({
  name,
  image: `/${name.toLowerCase()}.png`
}));

const shopItems = [
  {
    id:"void-crown",
    name:"VOID CROWN",
    rarity:"LEGENDARY",
    price:1200,
    image:"/shop/void-crown.png"
  },
  {
    id:"phantom-mask",
    name:"PHANTOM MASK",
    rarity:"LEGENDARY",
    price:1000,
    image:"/shop/phantom-mask.png"
  },
  {
    id:"neon-halo",
    name:"NEON HALO",
    rarity:"EPIC",
    price:650,
    image:"/shop/neon-halo.png"
  },
  {
    id:"cyber-visor",
    name:"CYBER VISOR",
    rarity:"EPIC",
    price:550,
    image:"/shop/cyber-visor.png"
  },
  {
    id:"dark-wings",
    name:"DARK WINGS",
    rarity:"LIMITED",
    price:1500,
    image:"/shop/dark-wings.png"
  },
  {
    id:"plasma-frame",
    name:"PLASMA FRAME",
    rarity:"RARE",
    price:350,
    image:"/shop/plasma-frame.png"
  }
];

const translations = {
  it:{
    enter:"ENTRA IN WHO",
    slogan:"Nessun nome. Nessun giudizio. Solo WHO.",
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
    change:"CAMBIA IDENTITÀ",
    noRooms:"Non hai ancora creato stanze.",
    creator:"CREATOR",
    members:"membri"
  },
  en:{
    enter:"ENTER WHO",
    slogan:"No names. No judgment. Just WHO.",
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
    change:"CHANGE IDENTITY",
    noRooms:"You haven't created any rooms yet.",
    creator:"CREATOR",
    members:"members"
  }
};

function getAvatar(name){
  return avatars.find(a => a.name === name)?.image || "/shadow.png";
}

export default function Home(){

  const [started,setStarted] = useState(false);
  const [page,setPage] = useState("chat");

  const [nickname,setNickname] = useState("");
  const [avatar,setAvatar] = useState("Shadow");

  const [messages,setMessages] = useState([]);
  const [message,setMessage] = useState("");

  const [language,setLanguage] = useState("it");

  const [points,setPoints] = useState(500);
  const [owned,setOwned] = useState([]);

  const [rooms,setRooms] = useState([]);
  const [creatingRoom,setCreatingRoom] = useState(false);
  const [roomName,setRoomName] = useState("");
  const [roomTheme,setRoomTheme] = useState("");
  const [roomPrivate,setRoomPrivate] = useState(false);

  const t = translations[language];

  useEffect(()=>{
    const saved = localStorage.getItem("who-language");
    if(saved === "it" || saved === "en") setLanguage(saved);

    const savedRooms = localStorage.getItem("who-rooms");
    if(savedRooms){
      try{
        setRooms(JSON.parse(savedRooms));
      }catch{}
    }
  },[]);

  function changeLanguage(lang){
    setLanguage(lang);
    localStorage.setItem("who-language",lang);
  }

  async function loadMessages(){

    const {data,error} = await supabase
      .from("messages")
      .select("*")
      .eq("room","generale")
      .order("id",{ascending:true});

    if(!error) setMessages(data || []);
  }

  useEffect(()=>{
    loadMessages();
  },[]);

  async function sendMessage(){

    if(!message.trim()) return;

    const {error} = await supabase
      .from("messages")
      .insert({
        room:"generale",
        nickname:nickname || "Anonimo",
        avatar,
        content:message.trim(),
        likes:0,
        dislikes:0
      });

    if(error){
      alert(error.message);
      return;
    }

    setMessage("");
    loadMessages();
  }

  async function vote(id,type,current){

    const value = (current || 0) + 1;

    const {error} = await supabase
      .from("messages")
      .update({[type]:value})
      .eq("id",id);

    if(error) return;

    setMessages(old =>
      old.map(m =>
        m.id === id ? {...m,[type]:value} : m
      )
    );
  }

  function createRoom(){

    if(!roomName.trim()) return;

    const newRoom = {
      id:Date.now(),
      name:roomName.trim(),
      theme:roomTheme.trim(),
      private:roomPrivate,
      creator:nickname,
      members:1
    };

    const updated = [newRoom,...rooms];

    setRooms(updated);
    localStorage.setItem("who-rooms",JSON.stringify(updated));

    setRoomName("");
    setRoomTheme("");
    setRoomPrivate(false);
    setCreatingRoom(false);
  }

  function buy(item){

    if(owned.includes(item.id)) return;

    if(points < item.price){
      alert(t.insufficient);
      return;
    }

    setPoints(p => p-item.price);
    setOwned(old => [...old,item.id]);
  }

  const background = {
    minHeight:"100vh",
    color:"#fff",
    background:
      "radial-gradient(circle at 50% -10%,#38105f 0,#150921 35%,#07050c 75%)",
    paddingBottom:started === true ? 90 : 25
  };

  const card = {
    background:
      "linear-gradient(145deg,rgba(35,18,54,.96),rgba(12,8,20,.97))",
    border:"1px solid #542975",
    borderRadius:22,
    color:"#fff",
    boxShadow:"0 12px 35px rgba(0,0,0,.3)"
  };

  function Language(){

    return(
      <div style={{
        display:"flex",
        justifyContent:"flex-end",
        gap:6,
        padding:"13px 17px"
      }}>

        {["it","en"].map(lang => (
          <button
            key={lang}
            onClick={()=>changeLanguage(lang)}
            style={{
              background:language === lang ? "#66258c":"#15101c",
              border:"1px solid #663a7b",
              borderRadius:20,
              padding:"7px 11px",
              color:"#fff"
            }}
          >
            {lang === "it" ? "🇮🇹 IT":"🇬🇧 EN"}
          </button>
        ))}

      </div>
    );
  }

  function Logo(){

    return(
      <div style={{textAlign:"center"}}>

        <div style={{
          fontSize:74,
          lineHeight:1,
          fontWeight:950,
          letterSpacing:-6,
          background:
            "linear-gradient(90deg,#fff,#e993ff,#8c59ff,#5ee8ff)",
          WebkitBackgroundClip:"text",
          color:"transparent",
          filter:"drop-shadow(0 0 20px #922eff)"
        }}>
          WHO
        </div>

        <div style={{
          fontSize:10,
          letterSpacing:7,
          color:"#ad75ca",
          marginTop:8
        }}>
          BE ANYONE
        </div>

      </div>
    );
  }

  function Nav(){

    const nav = [
      ["chat","💬",t.chat],
      ["rooms","◉",t.rooms],
      ["shop","◆",t.shop],
      ["profile","●",t.profile]
    ];

    return(
      <nav style={{
        position:"fixed",
        zIndex:100,
        bottom:0,
        left:0,
        right:0,
        display:"grid",
        gridTemplateColumns:"repeat(4,1fr)",
        background:"rgba(7,4,12,.97)",
        borderTop:"1px solid #48245f",
        padding:"9px 4px 12px",
        backdropFilter:"blur(15px)"
      }}>

        {nav.map(([id,icon,label])=>(
          <button
            key={id}
            onClick={()=>setPage(id)}
            style={{
              background:"transparent",
              border:0,
              color:page === id ? "#df91ff":"#817589",
              fontSize:11,
              fontWeight:700
            }}
          >

            <span style={{
              display:"block",
              fontSize:21,
              marginBottom:3
            }}>
              {icon}
            </span>

            {label}

          </button>
        ))}

      </nav>
    );
  }

  /* WELCOME */

  if(started === false){

    return(
      <main style={background}>

        <Language/>

        <section style={{
          minHeight:"78vh",
          display:"flex",
          flexDirection:"column",
          justifyContent:"center",
          alignItems:"center",
          padding:22
        }}>

          <Logo/>

          <p style={{
            opacity:.72,
            marginTop:30,
            textAlign:"center"
          }}>
            {t.slogan}
          </p>

          <button
            onClick={()=>setStarted("identity")}
            style={{
              marginTop:20,
              width:"100%",
              maxWidth:370,
              padding:18,
              borderRadius:22,
              border:"1px solid #d066ff",
              background:
                "linear-gradient(90deg,#7725a6,#382065)",
              color:"#fff",
              fontWeight:900,
              boxShadow:"0 0 30px rgba(170,50,255,.25)"
            }}
          >
            {t.enter} →
          </button>

        </section>

      </main>
    );
  }

  /* IDENTITY */

  if(started === "identity"){

    return(
      <main style={background}>

        <Language/>

        <section style={{padding:"5px 18px 20px"}}>

          <small style={{
            color:"#d285f6",
            letterSpacing:3
          }}>
            {t.identity}
          </small>

          <h1 style={{fontSize:34}}>
            {t.who}
          </h1>

          <input
            value={nickname}
            onChange={e=>setNickname(e.target.value)}
            placeholder={t.nick}
            maxLength={20}
            style={{
              ...card,
              boxSizing:"border-box",
              width:"100%",
              padding:17,
              fontSize:16,
              outline:0
            }}
          />

          <h3 style={{marginTop:26}}>
            {t.avatar}
          </h3>

        </section>

        <section style={{
          display:"grid",
          gridTemplateColumns:"repeat(2,minmax(0,1fr))",
          gap:12,
          padding:"0 18px"
        }}>

          {avatars.map(item=>{

            const selected = avatar === item.name;

            return(
              <button
                key={item.name}
                onClick={()=>setAvatar(item.name)}
                style={{
                  ...card,
                  padding:"13px 7px",
                  border:selected
                    ? "2px solid #d168ff"
                    : card.border,
                  boxShadow:selected
                    ? "0 0 22px rgba(199,70,255,.4)"
                    : card.boxShadow
                }}
              >

                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width:100,
                    height:100,
                    maxWidth:"100%",
                    borderRadius:"50%",
                    objectFit:"cover",
                    border:selected
                      ? "3px solid #d86cff"
                      : "2px solid #5b3470"
                  }}
                />

                <strong style={{
                  display:"block",
                  marginTop:8
                }}>
                  {item.name}
                </strong>

                <small style={{
                  color:selected ? "#e39aff":"#887c91"
                }}>
                  {selected ? t.selected:t.choose}
                </small>

              </button>
            );
          })}

        </section>

        <div style={{padding:18}}>

          <button
            onClick={()=>{

              if(!nickname.trim()){
                alert(
                  language === "it"
                    ? "Inserisci un nickname"
                    : "Enter a nickname"
                );
                return;
              }

              setNickname(nickname.trim());
              setStarted(true);
              setPage("chat");
            }}
            style={{
              width:"100%",
              padding:18,
              borderRadius:20,
              background:"#68258e",
              border:"1px solid #c35bea",
              color:"#fff",
              fontWeight:900
            }}
          >
            {t.continue} →
          </button>

        </div>

      </main>
    );
  }

  /* ROOMS */

  if(page === "rooms"){

    const officialRooms = [
      ["WHO GENERAL","🌐","LIVE"],
      ["NIGHT WHO","🌙","LIVE"],
      ["GAMING","🎮","LIVE"],
      ["MUSIC","♫","LIVE"],
      ["MEET PEOPLE","✦","LIVE"]
    ];

    return(
      <main style={background}>

        <Language/>

        <section style={{padding:"0 18px"}}>

          <small style={{
            color:"#d486fa",
            letterSpacing:3
          }}>
            {t.official}
          </small>

          <h1 style={{
            fontSize:36,
            margin:"7px 0 18px"
          }}>
            {t.rooms}
          </h1>

          <button
            onClick={()=>setCreatingRoom(!creatingRoom)}
            style={{
              width:"100%",
              padding:17,
              marginBottom:18,
              borderRadius:20,
              border:"1px solid #d166ff",
              background:
                "linear-gradient(90deg,#71299a,#3c1d69)",
              color:"#fff",
              fontWeight:900
            }}
          >
            ＋ {t.createRoom}
          </button>

          {creatingRoom && (

            <div style={{
              ...card,
              padding:16,
              marginBottom:20
            }}>

              <input
                value={roomName}
                onChange={e=>setRoomName(e.target.value)}
                placeholder={t.roomName}
                style={{
                  boxSizing:"border-box",
                  width:"100%",
                  padding:13,
                  marginBottom:9,
                  borderRadius:13,
                  border:"1px solid #55306c",
                  background:"#0d0913",
                  color:"#fff"
                }}
              />

              <input
                value={roomTheme}
                onChange={e=>setRoomTheme(e.target.value)}
                placeholder={t.roomTheme}
                style={{
                  boxSizing:"border-box",
                  width:"100%",
                  padding:13,
                  marginBottom:12,
                  borderRadius:13,
                  border:"1px solid #55306c",
                  background:"#0d0913",
                  color:"#fff"
                }}
              />

              <button
                onClick={()=>setRoomPrivate(!roomPrivate)}
                style={{
                  background:"#21142c",
                  border:"1px solid #583370",
                  color:"#fff",
                  borderRadius:13,
                  padding:"10px 14px",
                  marginRight:8
                }}
              >
                {roomPrivate ? "🔒 "+t.private:"🌐 "+t.public}
              </button>

              <button
                onClick={createRoom}
                style={{
                  background:"#68258e",
                  border:"1px solid #b94ee4",
                  color:"#fff",
                  borderRadius:13,
                  padding:"10px 16px",
                  fontWeight:800
                }}
              >
                {t.create}
              </button>

            </div>
          )}

          {officialRooms.map(([name,icon,status])=>(
            <div
              key={name}
              style={{
                ...card,
                padding:17,
                marginBottom:11,
                display:"flex",
                alignItems:"center",
                gap:14
              }}
            >

              <div style={{
                width:50,
                height:50,
                borderRadius:16,
                display:"grid",
                placeItems:"center",
                fontSize:25,
                background:"#28123b"
              }}>
                {icon}
              </div>

              <div style={{flex:1}}>
                <strong>{name}</strong>
                <small style={{
                  display:"block",
                  color:"#50e99c",
                  marginTop:4
                }}>
                  ● {status}
                </small>
              </div>

              <span style={{color:"#cf7aff"}}>→</span>

            </div>
          ))}

          <h3 style={{marginTop:28}}>
            {t.community}
          </h3>

          {rooms.length === 0 && (
            <p style={{opacity:.55}}>
              {t.noRooms}
            </p>
          )}

          {rooms.map(room=>(
            <div
              key={room.id}
              style={{
                ...card,
                padding:17,
                marginBottom:11
              }}
            >

              <div style={{
                display:"flex",
                justifyContent:"space-between"
              }}>

                <strong>
                  {room.private ? "🔒 ":"🌐 "}
                  {room.name}
                </strong>

                <small style={{color:"#d181f5"}}>
                  {t.creator}
                </small>

              </div>

              <p style={{
                opacity:.65,
                fontSize:13
              }}>
                {room.theme || "WHO Community"}
              </p>

              <small>
                {room.creator} · {room.members} {t.members}
              </small>

            </div>
          ))}

        </section>

        <Nav/>

      </main>
    );
  }

  /* SHOP */

  if(page === "shop"){

    return(
      <main style={background}>

        <Language/>

        <section style={{padding:"0 18px 15px"}}>

          <small style={{
            color:"#d687ff",
            letterSpacing:3
          }}>
            {t.shopTitle}
          </small>

          <h1 style={{
            fontSize:38,
            margin:"5px 0"
          }}>
            {t.shop}
          </h1>

          <p style={{opacity:.65}}>
            {t.collection}
          </p>

          <div style={{
            ...card,
            padding:17,
            marginTop:17
          }}>

            <small style={{color:"#cf83f5"}}>
              {t.points}
            </small>

            <div style={{
              fontSize:31,
              fontWeight:950
            }}>
              ✦ {points}
            </div>

          </div>

        </section>

        <section style={{
          display:"grid",
          gridTemplateColumns:"repeat(2,minmax(0,1fr))",
          gap:12,
          padding:"0 18px 20px"
        }}>

          {shopItems.map(item=>{

            const isOwned = owned.includes(item.id);

            return(
              <div
                key={item.id}
                style={{
                  ...card,
                  overflow:"hidden"
                }}
              >

                <div style={{
                  height:155,
                  position:"relative",
                  background:
                    "radial-gradient(circle,#3d175b,#100817)"
                }}>

                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width:"100%",
                      height:"100%",
                      objectFit:"cover"
                    }}
                    onError={e=>{
                      e.currentTarget.style.display="none";
                    }}
                  />

                  <div style={{
                    position:"absolute",
                    top:8,
                    left:8,
                    background:"rgba(5,3,9,.8)",
                    border:"1px solid #754095",
                    borderRadius:10,
                    padding:"5px 7px",
                    fontSize:9,
                    letterSpacing:1
                  }}>
                    {item.rarity}
                  </div>

                </div>

                <div style={{padding:12}}>

                  <strong style={{fontSize:13}}>
                    {item.name}
                  </strong>

                  <div style={{
                    color:"#df94ff",
                    fontWeight:900,
                    margin:"8px 0"
                  }}>
                    ✦ {item.price}
                  </div>

                  <button
                    disabled={isOwned}
                    onClick={()=>buy(item)}
                    style={{
                      width:"100%",
                      padding:10,
                      borderRadius:12,
                      border:"1px solid #784093",
                      background:isOwned
                        ? "#27202c"
                        : "#592078",
                      color:"#fff",
                      fontWeight:800,
                      fontSize:11
                    }}
                  >
                    {isOwned ? t.owned:t.unlock}
                  </button>

                </div>

              </div>
            );
          })}

        </section>

        <Nav/>

      </main>
    );
  }

  /* PROFILE */

  if(page === "profile"){

    const level = Math.max(1,Math.floor(points/250)+1);

    return(
      <main style={background}>

        <Language/>

        <section style={{
          textAlign:"center",
          padding:"5px 18px 20px"
        }}>

          <img
            src={getAvatar(avatar)}
            alt={avatar}
            style={{
              width:135,
              height:135,
              objectFit:"cover",
              borderRadius:"50%",
              border:"4px solid #d268ff",
              boxShadow:"0 0 35px #7629a2"
            }}
          />

          <h1 style={{marginBottom:2}}>
            {nickname}
          </h1>

          <span style={{color:"#bd7ad6"}}>
            {avatar}
          </span>

        </section>

        <section style={{padding:"0 18px"}}>

          <div style={{
            display:"grid",
            gridTemplateColumns:"1fr 1fr",
            gap:11
          }}>

            <div style={{
              ...card,
              padding:17
            }}>
              <small>{t.points}</small>
              <div style={{
                fontSize:27,
                fontWeight:900
              }}>
                ✦ {points}
              </div>
            </div>

            <div style={{
              ...card,
              padding:17
            }}>
              <small>{t.level}</small>
              <div style={{
                fontSize:27,
                fontWeight:900
              }}>
                {level}
              </div>
            </div>

          </div>

          <div style={{
            ...card,
            padding:17,
            marginTop:11
          }}>
            <small>{t.reputation}</small>
            <h3 style={{
              color:"#5ce5a1",
              marginBottom:3
            }}>
              ✓ {t.good}
            </h3>
            <p style={{
              opacity:.6,
              fontSize:13
            }}>
              Le segnalazioni non sottraggono automaticamente punti.
              Una penalità può essere applicata solo dopo una violazione
              confermata dalla moderazione.
            </p>
          </div>

          <div style={{
            ...card,
            padding:17,
            marginTop:11
          }}>
            <small>{t.inventory}</small>
            <h2 style={{marginBottom:4}}>
              {owned.length}
            </h2>
            <span style={{opacity:.6}}>
              WHO cosmetics
            </span>
          </div>

          <button
            onClick={()=>setStarted("identity")}
            style={{
              ...card,
              width:"100%",
              padding:17,
              marginTop:11
            }}
          >
            {t.change}
          </button>

        </section>

        <Nav/>

      </main>
    );
  }

  /* CHAT */

  return(
    <main style={background}>

      <Language/>

      <header style={{
        padding:"0 18px 15px",
        display:"flex",
        justifyContent:"space-between"
      }}>

        <div>
          <strong style={{
            display:"block",
            fontSize:28,
            color:"#dc8dff",
            textShadow:"0 0 13px #7927a5"
          }}>
            WHO
          </strong>

          <small style={{opacity:.55}}>
            GENERAL ROOM
          </small>
        </div>

        <small style={{color:"#52e69c"}}>
          ● ONLINE
        </small>

      </header>

      <section style={{padding:"0 18px 14px"}}>

        <small style={{
          color:"#cd7af3",
          letterSpacing:2
        }}>
          {t.publicChat}
        </small>

        <h1 style={{
          fontSize:35,
          margin:"5px 0 15px"
        }}>
          {t.general}
        </h1>

        <div style={{
          display:"flex",
          gap:10,
          alignItems:"center"
        }}>

          <img
            src={getAvatar(avatar)}
            alt={avatar}
            style={{
              width:50,
              height:50,
              objectFit:"cover",
              borderRadius:"50%"
            }}
          />

          <div>
            <strong>{nickname}</strong>

            <small style={{
              display:"block",
              color:"#b473ce"
            }}>
              {avatar} · ✦ {points}
            </small>
          </div>

        </div>

      </section>

      <section style={{padding:"0 18px"}}>

        {messages.map(msg=>(
          <div
            key={msg.id}
            style={{
              ...card,
              padding:15,
              marginBottom:11
            }}
          >

            <div style={{
              display:"flex",
              gap:11
            }}>

              <img
                src={getAvatar(msg.avatar)}
                alt=""
                style={{
                  width:50,
                  height:50,
                  objectFit:"cover",
                  borderRadius:"50%"
                }}
              />

              <div style={{
                flex:1,
                minWidth:0
              }}>

                <strong>
                  {msg.nickname || "Anonimo"}
                </strong>

                <small style={{
                  display:"block",
                  color:"#ad73c5"
                }}>
                  {msg.avatar || "Shadow"}
                </small>

                <p style={{
                  overflowWrap:"anywhere"
                }}>
                  {msg.content || msg.message || msg.text}
                </p>

                <div style={{
                  display:"flex",
                  gap:7
                }}>

                  <button
                    onClick={()=>
                      vote(msg.id,"likes",msg.likes)
                    }
                  >
                    👍 {msg.likes || 0}
                  </button>

                  <button
                    onClick={()=>
                      vote(msg.id,"dislikes",msg.dislikes)
                    }
                  >
                    👎 {msg.dislikes || 0}
                  </button>

                  <button
                    onClick={()=>
                      alert(
                        language === "it"
                          ? "Segnalazione inviata alla moderazione."
                          : "Report sent to moderation."
                      )
                    }
                  >
                    🚩 {t.report}
                  </button>

                </div>

              </div>

            </div>

          </div>
        ))}

        <div style={{
          ...card,
          padding:11,
          display:"flex",
          gap:8
        }}>

          <input
            value={message}
            onChange={e=>setMessage(e.target.value)}
            onKeyDown={e=>{
              if(e.key === "Enter") sendMessage();
            }}
            placeholder={t.write}
            style={{
              flex:1,
              minWidth:0,
              background:"#0d0913",
              border:"1px solid #533069",
              borderRadius:13,
              color:"#fff",
              padding:13
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              background:"#68238d",
              border:"1px solid #aa48d1",
              color:"#fff",
              borderRadius:13,
              padding:"0 14px",
              fontWeight:800
            }}
          >
            {t.send}
          </button>

        </div>

      </section>

      <Nav/>

    </main>
  );
                     }
