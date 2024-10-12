import React from "react";
import { UserRoundPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

type SidePanelProps = {
  // setToggleForm: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuToggle: React.Dispatch<React.SetStateAction<string>>;
};

const SidePanel = ({ setMenuToggle }: SidePanelProps) => {
  return (
    <div className="flex flex-col p-8 gap-6">
      <Button
        className="text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors justify-start"
        onClick={() => {
          setMenuToggle("addPerson");
        }}
      >
        <UserRoundPlus className="mr-2 h-4 w-4" /> Add Person Details
      </Button>
      <Button
        className="text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors justify-start"
        onClick={() => {
          setMenuToggle("updatePerson");
        }}
      >
        <UserRoundPlus className="mr-2 h-4 w-4" /> Update Person Details
      </Button>
      <Button
        className="text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors justify-start"
        onClick={() => {
          setMenuToggle("addRelation");
        }}
      >
        <Users className="mr-2 h-4 w-4" /> Add Person Relationship
      </Button>
    </div>
  );
};

export default SidePanel;
