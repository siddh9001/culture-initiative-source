"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TbCirclesRelation } from "react-icons/tb";
type Props = {};

const PersonRelationForm = (props: Props) => {
  function onSubmit() {}

  return (
    <div className="w-full space-y-6 p-8 border-[1px] border-zinc-400">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="frompersonsearch" className="text-white">
          From Person
        </Label>
        <Input
          type="search"
          id="frompersonsearch"
          placeholder="ex. Father name"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="realtiontype" className="text-white">
          Relation Type
        </Label>
        <Input type="text" id="realtiontype" placeholder="ex. FATHER_IS" />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="topersonsearch" className="text-white">
          To Person
        </Label>
        <Input type="search" id="topersonsearch" placeholder="ex. Child name" />
      </div>
      <Button
        type="submit"
        className="text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors"
      >
        <TbCirclesRelation size={16} color="white" className="mr-1.5" />
        Create Relation
      </Button>
    </div>
  );
};

export default PersonRelationForm;
