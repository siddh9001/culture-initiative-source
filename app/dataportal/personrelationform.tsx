"use client";
import React, { useEffect, useState } from "react";

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
import { useToast } from "@/components/hooks/use-toast";
import { fetchNames, CreateRelationship } from "../utils/neo4j";
import { RecordShape } from "neo4j-driver";
type Props = {};

const PersonRelationForm = (props: Props) => {
  const { toast } = useToast();
  const [fromPersonList, setFromPersonList] = useState<
    RecordShape[] | undefined
  >([]);
  const [toPersonList, setToPersonList] = useState<RecordShape[] | undefined>(
    []
  );
  const [nameLoading, setNameLoading] = useState<boolean>(false);
  const [fromNameOpen, setFromNameOpen] = useState<boolean>(false);
  const [fromNameValue, setFromNameValue] = useState<string>("");
  const [toNameOpen, setToNameOpen] = useState<boolean>(false);
  const [toNameValue, setToNameValue] = useState<string>("");
  const [relationValue, setRelationValue] = useState<string>("");
  const [fromName, setFromName] = useState<string>("");

  useEffect(() => {
    const setData = setTimeout(async () => {
      await onFromNameSearch(fromName);
    }, 1500);
    return () => clearTimeout(setData);
  }, [fromName]);

  const onFromNameSearch = async (val: string) => {
    // const val = e.target.value;
    const query = `MATCH (p:Person) WHERE lower(p.person_name) STARTS WITH '${val}' OR lower(p.person_name) ENDS WITH '${val}' OR lower(p.person_name) CONTAINS '${val}' RETURN p.person_name AS name, p.person_id AS id`;
    try {
      setNameLoading(true);
      if (val !== "" && val.length > 2) {
        const result = await fetchNames(query);
        console.log("names list: ", result, typeof result);
        setFromPersonList(result);
      }
    } catch (error) {
      console.error("error loading name: ", error);
    } finally {
      setNameLoading(false);
    }
  };
  const onToNameSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const query = `MATCH (p:Person) WHERE lower(p.person_name) STARTS WITH '${val}' OR lower(p.person_name) ENDS WITH '${val}' OR lower(p.person_name) CONTAINS '${val}' RETURN p.person_name AS name, p.person_id AS id`;
    try {
      setNameLoading(true);
      if (val !== "" && val.length > 2) {
        const result = await fetchNames(query);
        // console.log("names list: ", result, typeof result);
        setToPersonList(result);
      }
    } catch (error) {
      console.error("error loading name: ", error);
    } finally {
      setNameLoading(false);
    }
  };
  const onSubmitRelation = async () => {
    const query = `MATCH (a:Person {person_id: "${fromNameValue}"}) WITH a MATCH (b:Person {person_id: "${toNameValue}"}) MERGE (a)-[:${relationValue}]->(b);`;
    try {
      if (fromNameValue !== "" && toNameValue !== "" && relationValue !== "") {
        await CreateRelationship(query);
        toast({
          description: "Relation Created Successfully!",
          variant: "success",
        });
      } else {
        toast({
          description: "persons required",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("relation submit error:", error);
      toast({
        description: "unable to create relationship",
        variant: "destructive",
      });
    } finally {
      setFromNameValue("");
      setToNameValue("");
      setRelationValue("");
      setFromPersonList([]);
      setToPersonList([]);
    }
  };

  return (
    <div className="w-full space-y-6 p-8 border-[1px] border-zinc-400">
      <div className="grid w-full items-center gap-1.5">
        <Popover open={fromNameOpen} onOpenChange={setFromNameOpen}>
          <Label className="text-white">From Person</Label>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={fromNameOpen}
              className="w-[468px] justify-start text-black"
            >
              {fromNameValue
                ? fromPersonList?.find((person) => person.id === fromNameValue)
                    ?.name
                : "Search Name..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[468px]">
            <Command>
              <CommandInput
                placeholder="From Person"
                // onChangeCapture={onFromNameSearch}
                value={fromName}
                onValueChange={(value) => setFromName(value)}
              />
              <CommandList>
                <CommandEmpty>
                  {/* {nameLoading ? "Loading..." : "No Person found."} */}
                  No Person found.
                </CommandEmpty>
                <CommandGroup>
                  {fromPersonList?.map((person) => (
                    <CommandItem
                      key={person.id}
                      value={person.id}
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
                          fromNameValue === person.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {person.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid w-[468px] items-center gap-1.5">
        <Label htmlFor="realtiontype" className="text-white">
          Relation Type
        </Label>
        <Select
          onValueChange={(val) => setRelationValue(val)}
          value={relationValue}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ex. FATHER_IS" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="">None</SelectItem> */}
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
        <Popover open={toNameOpen} onOpenChange={setToNameOpen}>
          <Label className="text-white">To Person</Label>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={toNameOpen}
              className="w-[468px] justify-start"
            >
              {toNameValue
                ? toPersonList?.find((person) => person.id === toNameValue)
                    ?.name
                : "Search Name..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[468px]">
            <Command>
              <CommandInput
                placeholder="To Person"
                onChangeCapture={onToNameSearch}
              />
              <CommandList>
                <CommandEmpty>
                  {nameLoading ? "Loading..." : "No Person found."}
                </CommandEmpty>
                <CommandGroup>
                  {toPersonList?.map((person) => (
                    <CommandItem
                      key={person.id}
                      value={person.id}
                      onSelect={(currentValue) => {
                        setToNameValue(
                          currentValue === toNameValue ? "" : currentValue
                        );
                        setToNameOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          toNameValue === person.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {person.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
