"use client"

import React, { useState } from 'react'
import { CharacterEdit } from '../_models/characterEdit'
import { toast } from 'react-toastify';
import { useLanguage } from '@/app/_context/LanguageContext';

export default function AddStatsCard({characterEdit}: {characterEdit: CharacterEdit} ) {
    const { lang } = useLanguage();
    //set the base values of points left and all the other stats
    const [basePoints, setBasePoints] = useState(characterEdit.levelUpPoints)
    const [baseStr, setBaseStr] = useState(characterEdit.strength);
    const [baseAgi, setBaseAgi] = useState(characterEdit.agility);
    const [baseVit, setBaseVit] = useState(characterEdit.vitality);
    const [baseEne, setBaseEne] = useState(characterEdit.energy);
    const [baseLead, setBaseLead] = useState(characterEdit.leadership);

    //set the points that are gonna be added
    const [str, setStr] = useState(0);
    const [agi, setAgi] = useState(0);
    const [vit, setVit] = useState(0);
    const [ene, setEne] = useState(0);
    const [lead, setLead] = useState(0);

    //dl codes that are gonna be cked toshow leadership or not
    const dlCodes = ["00000040-0011-0000-0000-000000000000", "00000040-0010-0000-0000-000000000000"]

    async function addStats(){
        const response = await fetch("/api/characters/addstats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: characterEdit.name,
                str: str,
                agi: agi,
                vit: vit,
                ene: ene,
                lead: lead  
            })
        })
        const responseFinal = await response.json();
        if( response.ok ){
            //if ok change the base values that are showed in the character card
            setBasePoints(basePoints - (str+agi+vit+ene+lead))
            setBaseStr(str + baseStr);
            setBaseAgi(agi + baseAgi);
            setBaseVit(vit + baseVit);
            setBaseEne(ene + baseEne);
            setBaseLead(lead + baseLead);
            //reset all the points that were added previously
            setStr(0);
            setAgi(0);
            setVit(0);
            setEne(0);
            setLead(0);
            toast.success(responseFinal.message);  
        } else {
            toast.error(responseFinal.message);
        }
    }

  return (
    <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">
          {lang === "th" ? "แต้มสเตตัสคงเหลือ (Level-Up Points)" : "Available Level-Up Points"}
        </span>
        <span className="font-mono tabular-nums font-bold text-amber-400 text-sm">{basePoints}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-slate-300">
            {lang === "th" ? "ความแข็งแกร่ง (STR):" : "Strength:"}{" "}
            <strong className="font-mono tabular-nums text-slate-100">{baseStr}</strong>
          </span>
          <input
            type="number"
            value={str}
            onChange={(e) => setStr(+e.target.value)}
            className="w-24 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono tabular-nums text-xs text-slate-100 text-right remove-arrow focus:outline-none focus:border-amber-400"
            placeholder="+"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-slate-300">
            {lang === "th" ? "ความเร็ว (AGI):" : "Agility:"}{" "}
            <strong className="font-mono tabular-nums text-slate-100">{baseAgi}</strong>
          </span>
          <input
            type="number"
            value={agi}
            onChange={(e) => setAgi(+e.target.value)}
            className="w-24 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono tabular-nums text-xs text-slate-100 text-right remove-arrow focus:outline-none focus:border-amber-400"
            placeholder="+"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-slate-300">
            {lang === "th" ? "พลังชีวิต (VIT):" : "Vitality:"}{" "}
            <strong className="font-mono tabular-nums text-slate-100">{baseVit}</strong>
          </span>
          <input
            type="number"
            value={vit}
            onChange={(e) => setVit(+e.target.value)}
            className="w-24 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono tabular-nums text-xs text-slate-100 text-right remove-arrow focus:outline-none focus:border-amber-400"
            placeholder="+"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-slate-300">
            {lang === "th" ? "เวทมนตร์ (ENE):" : "Energy:"}{" "}
            <strong className="font-mono tabular-nums text-slate-100">{baseEne}</strong>
          </span>
          <input
            type="number"
            value={ene}
            onChange={(e) => setEne(+e.target.value)}
            className="w-24 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono tabular-nums text-xs text-slate-100 text-right remove-arrow focus:outline-none focus:border-amber-400"
            placeholder="+"
          />
        </div>

        {dlCodes.includes(characterEdit.characterClassId) && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-xs text-slate-300">
              {lang === "th" ? "คำสั่ง (CMD):" : "Leadership:"}{" "}
              <strong className="font-mono tabular-nums text-slate-100">{baseLead}</strong>
            </span>
            <input
              type="number"
              value={lead}
              onChange={(e) => setLead(+e.target.value)}
              className="w-24 px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono tabular-nums text-xs text-slate-100 text-right remove-arrow focus:outline-none focus:border-amber-400"
              placeholder="+"
            />
          </div>
        )}
      </div>

      <button
        onClick={addStats}
        className="self-end px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
      >
        {lang === "th" ? "ยืนยันการอัพแต้ม" : "Add Points"}
      </button>
    </div>
  )
}

