"use client";
import React from "react";
import SidePanel from "./sidepanel";
import PersonDetailForm from "./persondetailform";

type Props = {};

const DataPortalPage = (props: Props) => {
  return (
    <div className="min-h-screen w-full bg-slate-900">
      <h2 className="text-white text-3xl p-10">Person Form Fillup</h2>
      <div className="w-full flex">
        <div className="basis-1/4 border-[1px] border-zinc-400">
          <SidePanel />
        </div>
        <div className="basis-3/4">
          <PersonDetailForm />{" "}
        </div>
      </div>
    </div>
  );
};

export default DataPortalPage;
