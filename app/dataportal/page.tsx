"use client";
import { useState } from "react";
import SidePanel from "./sidepanel";
import PersonDetailForm from "./persondetailform";
import PersonRelationForm from "./personrelationform";
import PersonUpdateDetailForm from "./personupdatedetailform";

type Props = {};
const menulist = [
  { key: "m1", value: "addPerson" },
  { key: "m2", value: "updatePerson" },
  { key: "m3", value: "addRelation" },
];

const DataPortalPage = (props: Props) => {
  const [toggleForm, setToggleForm] = useState<boolean>(true);
  const [menuToggle, setMenuToggle] = useState<string>("addPerson");
  return (
    <div className="min-h-screen w-full bg-slate-900">
      <h2 className="text-white text-3xl p-10">Person Form Fillup</h2>
      <div className="w-full flex">
        <div className="basis-1/4 border-[1px] border-zinc-400">
          <SidePanel setMenuToggle={setMenuToggle} />
        </div>
        <div className="basis-3/4">
          {menuToggle == "addPerson" && <PersonDetailForm />}
          {menuToggle == "updatePerson" && <PersonUpdateDetailForm />}
          {menuToggle == "addRelation" && <PersonRelationForm />}
          {/* {toggleForm ? <PersonDetailForm /> : <PersonRelationForm />} */}
        </div>
      </div>
    </div>
  );
};

export default DataPortalPage;
