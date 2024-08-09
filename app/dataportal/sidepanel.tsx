import React, { SetStateAction } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type SidePanelProps = {
  setAddPerson?: React.Dispatch<React.SetStateAction<boolean>>;
  setAddRelation?: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidePanel = ({ setToggleForm }: SidePanelProps) => {
  return (
    <div className="flex flex-col p-8 gap-6">
      <Button
        className="text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors justify-start"
        onClick={() => {
          setToggleForm(true);
        }}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Person Details
      </Button>
      <Button
        className="text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors justify-start"
        onClick={() => {
          setToggleForm(false);
        }}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Person Relationship
      </Button>
    </div>
  );
};

export default SidePanel;
