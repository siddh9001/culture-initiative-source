import React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type ButtonProps = {
  title: string;
};

export function ButtonWithIcon(props: ButtonProps) {
  return (
    <Button className="text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors justify-start">
      <Plus className="mr-2 h-4 w-4" /> {props.title}
    </Button>
  );
}

type Props = {};

const DataPortalPage = (props: Props) => {
  return (
    <div className="min-h-screen w-full bg-slate-900">
      <h2 className="text-white text-3xl p-10">Person Form Fillup</h2>
      <div className="w-full flex">
        <div className="basis-1/6 flex flex-col p-8 gap-6">
          <ButtonWithIcon title="Add Person Details" />
          <ButtonWithIcon title="Add Person Relationship" />
        </div>
        <div className="basis-5/6"></div>
      </div>
    </div>
  );
};

export default DataPortalPage;
