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
    change:"CAMBIA AVATAR
