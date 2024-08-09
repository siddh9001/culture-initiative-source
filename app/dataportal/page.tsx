"use client";
import { useState } from "react";
import SidePanel from "./sidepanel";
import PersonDetailForm from "./persondetailform";
import PersonRelationForm from "./personrelationform";

type Props = {};

const DataPortalPage = (props: Props) => {
  const [addPerson, setAddPerson] = useState<boolean>(true);
  const [addRelation, setAddRelation] = useState<boolean>(false);
  const [toggleForm, setToggleForm] = useState<boolean>(true);
  return (
    <div className="min-h-screen w-full bg-slate-900">
      <h2 className="text-white text-3xl p-10">Person Form Fillup</h2>
      <div className="w-full flex">
        <div className="basis-1/4 border-[1px] border-zinc-400">
          <SidePanel setToggleForm={setToggleForm} />
        </div>
        <div className="basis-3/4">
          {toggleForm ? <PersonDetailForm /> : <PersonRelationForm />}
        </div>
      </div>
    </div>
  );
};

export default DataPortalPage;
