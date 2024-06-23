"use client";
import React, { useState } from "react";
import { TbCirclesRelation } from "react-icons/tb";
import NeoGraph from "./neograph";

type Props = {};

const SearchPage = (props: Props) => {
  return (
    <div className="min-h-screen w-full bg-slate-900">
      <div className="w-full bg-slate-700 px-8 py-6 flex justify-evenly gap-4">
        <div className="h-12 w-full bg-slate-200 rounded-lg flex place-content-center">
          <input
            className="bg-inherit w-full p-4 rounded-lg caret-slate-900 placeholder-slate-700"
            placeholder="From"
          />
        </div>
        <div className="h-12 flex flex-col justify-center">
          <TbCirclesRelation size={32} />
        </div>
        <div className="h-12 w-full bg-slate-200 rounded-lg flex place-content-center">
          <input
            className="bg-inherit w-full p-4 rounded-lg caret-slate-900 placeholder-slate-700"
            placeholder="To"
          />
        </div>
        <button className="h-12 px-7 py-3 text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors">
          Search
        </button>
      </div>
      <div className="h-60 w-60">
        <NeoGraph containerID="1065c742" />
      </div>
    </div>
  );
};

export default SearchPage;
