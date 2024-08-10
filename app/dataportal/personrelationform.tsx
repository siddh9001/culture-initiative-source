"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TbCirclesRelation } from "react-icons/tb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchNames } from "../utils/neo4j";
type Props = {};
type NameListType = {
  value: string;
  label: string;
};

const PersonRelationForm = (props: Props) => {
  const [nameList, setNameList] = useState<NameListType[]>([]);
  const [nameLoading, setNameLoading] = useState<boolean>(false);
  const [fromNameOpen, setFromNameOpen] = useState<boolean>(false);
  const [fromNameValue, setFromNameValue] = useState<string>("");

  const onNameSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const query = `MATCH (p:Person) WHERE lower(p.person_name) STARTS WITH '${val}' OR lower(p.person_name) ENDS WITH '${val}' OR lower(p.person_name) CONTAINS '${val}' RETURN p.person_name AS name`;
    try {
      setNameLoading(true);
      if (val !== "" && val.length > 2) {
        const result = await fetchNames(query);
        console.log("names list: ", result);
        result?.forEach((name) =>
          setNameList([...nameList, { value: name, label: name }])
        );
        // setNameList(result);
      }
    } catch (error) {
      console.error("error loading name: ", error);
    } finally {
      setNameLoading(false);
    }
  };
  const onSubmitRelation = () => {};

  return (
    <div className="w-full space-y-6 p-8 border-[1px] border-zinc-400">
      <div className="grid w-full items-center gap-1.5">
        {/* <Label htmlFor="frompersonsearch" className="text-white">
          From Person
        </Label>
        <Input
          type="search"
          id="frompersonsearch"
          placeholder="ex. Father name"
          onChange={onNameSearch}
        /> */}
        <Popover open={fromNameOpen} onOpenChange={setFromNameOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={fromNameOpen}
              className="w-[460px] justify-start"
            >
              {fromNameValue
                ? nameList.find((name) => name.value === fromNameValue)?.label
                : "Search Name..."}
              {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[460px]">
            <Command>
              <CommandInput
                placeholder="Search Name..."
                onChangeCapture={onNameSearch}
              />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {nameList.map((name) => (
                    <CommandItem
                      key={name.value}
                      value={name.value}
                      onSelect={(currentValue) => {
                        setFromNameValue(
                          currentValue === fromNameValue ? "" : currentValue
                        );
                        setFromNameOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          fromNameValue === name.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {name.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {/* <div className="absolute m-8"></div> */}
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="realtiontype" className="text-white">
          Relation Type
        </Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ex. FATHER_IS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">None</SelectItem>
            <SelectItem value="MOTHER_IS">MOTHER_IS</SelectItem>
            <SelectItem value="FATHER_IS">FATHER_IS</SelectItem>
            <SelectItem value="BROTHER_IS">BROTHER_IS</SelectItem>
            <SelectItem value="SISTER_IS">SISTER_IS</SelectItem>
            <SelectItem value="SON_IS">SON_IS</SelectItem>
            <SelectItem value="DAUGHTER_IS">DAUGHTER_IS</SelectItem>
            <SelectItem value="WIFE_IS">WIFE_IS</SelectItem>
            <SelectItem value="HUSBAND_IS">HUSBAND_IS</SelectItem>
            <SelectItem value="STEP_SON_IS">STEP_SON_IS</SelectItem>
            <SelectItem value="STEP_DAUGHTER_IS">STEP_DAUGHTER_IS</SelectItem>
            <SelectItem value="STEP_MOTHER_IS">STEP_MOTHER_IS</SelectItem>
            <SelectItem value="STEP_FATHER_IS">STEP_FATHER_IS</SelectItem>
            <SelectItem value="STEP_SISTER_IS">STEP_SISTER_IS</SelectItem>
            <SelectItem value="STEP_BROTHER_IS">STEP_BROTHER_IS</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="topersonsearch" className="text-white">
          To Person
        </Label>
        <Input
          type="search"
          id="topersonsearch"
          placeholder="ex. Child name"
          onChange={onNameSearch}
        />
      </div>
      <Button
        type="submit"
        className="text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors"
        onClick={onSubmitRelation}
      >
        <TbCirclesRelation size={16} color="white" className="mr-1.5" />
        Create Relation
      </Button>
    </div>
  );
};

export default PersonRelationForm;
