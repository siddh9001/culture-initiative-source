"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/hooks/use-toast";
import { fetchNames, CreateRelationship } from "../utils/neo4j";
import { RecordShape } from "neo4j-driver";
type FromNameType = {
  name?: string;
  id?: string;
};
type Props = {};

const querySelector = (
  fromPerson: RecordShape | undefined,
  toPerson: RecordShape | undefined,
  relationValue: string
): string => {
  switch (relationValue) {
    case "MOTHER_IS" || "FATHER_IS":
      if (fromPerson?.gender === "M")
        return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:SON_IS]->(b);`;
      return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:DAUGHTER_IS]->(b);`;
    case "BROTHER_IS" || "SISTER_IS":
      if (fromPerson?.gender === "M")
        return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:BROTHER_IS]->(b);`;
      return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:SISTER_IS]->(b);`;
    case "SON_IS" || "DAUGHTER_IS":
      if (fromPerson?.gender === "M")
        return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:FATHER_IS]->(b);`;
      return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:MOTHER_IS]->(b);`;
    case "WIFE_IS":
      return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:HUSBAND_IS]->(b);`;
    case "HUSBAND_IS":
      return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:WIFE_IS]->(b);`;
    case "STEP_SON_IS" || "STEP_DAUGHTER_IS":
      if (fromPerson?.gender === "M")
        return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:STEP_FATHER_IS]->(b);`;
      return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:STEP_MOTHER_IS]->(b);`;
    case "STEP_MOTHER_IS" || "STEP_FATHER_IS":
      if (fromPerson?.gender === "M")
        return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:STEP_SON_IS]->(b);`;
      return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:STEP_DAUGHTER_IS]->(b);`;
    case "STEP_SISTER_IS" || "STEP_BROTHER_IS":
      if (fromPerson?.gender === "M")
        return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:STEP_BROTHER_IS]->(b);`;
      return `MATCH (a:Person {person_id: "${toPerson?.id}"}) WITH a MATCH (b:Person {person_id: "${fromPerson?.id}"}) MERGE (a)-[:STEP_SISTER_IS]->(b);`;
    default:
      break;
  }
  return "";
};

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
  const [currentFromPerson, setCurrentFromPerson] = useState<
    RecordShape | undefined
  >();
  const [toNameOpen, setToNameOpen] = useState<boolean>(false);
  const [toNameValue, setToNameValue] = useState<string>("");
  const [currentToPerson, setCurrentToPerson] = useState<
    RecordShape | undefined
  >();
  const [relationValue, setRelationValue] = useState<string>("");
  const [fromName, setFromName] = useState<string>("");
  const [toName, setToName] = useState<string>("");

  useEffect(() => {
    const setData = setTimeout(async () => {
      await onFromNameSearch(fromName);
    }, 1000);
    return () => clearTimeout(setData);
  }, [fromName]);

  useEffect(() => {
    const setData = setTimeout(async () => {
      await onToNameSearch(toName);
    }, 1000);
    return () => clearTimeout(setData);
  }, [toName]);

  const onFromNameSearch = async (val: string) => {
    const str = val.toLowerCase();
    const query = `MATCH (p:Person) WHERE lower(p.person_name) STARTS WITH '${str}' OR lower(p.person_name) ENDS WITH '${str}' OR lower(p.person_name) CONTAINS '${str}' RETURN p.person_name AS name, p.person_surname as lname, p.person_id AS id, p.person_gender AS gender`;
    // const query = `MATCH (p:Person) WHERE p.person_id STARTS WITH '${val}' return p.person_name AS name, p.person_id AS id`;
    try {
      setNameLoading(true);
      if (str !== "" && str.length > 2) {
        const result = await fetchNames(query);
        // console.log("names list: ", result, typeof result);
        setFromPersonList(result);
      }
    } catch (error) {
      console.error("error loading name: ", error);
    } finally {
      setNameLoading(false);
    }
  };
  const onToNameSearch = async (val: string) => {
    const str = val.toLowerCase();
    const query = `MATCH (p:Person) WHERE lower(p.person_name) STARTS WITH '${str}' OR lower(p.person_name) ENDS WITH '${str}' OR lower(p.person_name) CONTAINS '${str}' RETURN p.person_name AS name, p.person_surname as lname, p.person_id AS id, p.person_gender AS gender`;
    try {
      setNameLoading(true);
      if (str !== "" && str.length > 2) {
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
    // Relation from A to B
    const queryAtoB = `MATCH (a:Person {person_id: "${fromNameValue}"}) WITH a MATCH (b:Person {person_id: "${toNameValue}"}) MERGE (a)-[:${relationValue}]->(b);`;
    try {
      if (fromNameValue !== "" && toNameValue !== "" && relationValue !== "") {
        await CreateRelationship(queryAtoB);
        toast({
          description: "Relation Created Successfully!",
          variant: "success",
        });

        // Relation From B to A.
        const queryBtoA: string = querySelector(
          currentFromPerson,
          currentToPerson,
          relationValue
        );
        try {
          if (
            currentFromPerson !== undefined &&
            currentToPerson !== undefined &&
            relationValue !== ""
          ) {
            await CreateRelationship(queryBtoA);
            toast({
              description: "Relation Created Successfully!",
              variant: "success",
            });
          } else {
            toast({
              description:
                "Something went wrong!! `To` to `from` Relationship Failed",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("`To` to `From` relation submit error:", error);
          toast({
            description: "unable to create `To` to `From` relationship",
            variant: "destructive",
          });
        } finally {
          setCurrentFromPerson(undefined);
          setCurrentToPerson(undefined);
          setRelationValue("");
        }
      } else {
        toast({
          description:
            "Something went wrong!! `From` to `To` relationship failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("`From` to `To` relation submit error:", error);
      toast({
        description: "unable to create `From` to `To` relationship",
        variant: "destructive",
      });
    } finally {
      setFromNameValue("");
      setToNameValue("");
      // setRelationValue("");
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
                ? (() => {
                    const res = fromPersonList?.find(
                      (person) => person.id === fromNameValue
                    );
                    return res
                      ? `${res?.name} ${res?.lname}`
                      : "Search Name...";
                  })()
                : "Search Name..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[468px]">
            <Command>
              {/* <CommandInput
                placeholder="From Person"
                // onChangeCapture={(e) => setFromName(e.currentTarget.value)}
                onValueChange={(value) => setFromName(value)}
              /> */}
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  placeholder="From Person"
                  value={fromName}
                  onChange={(e) => setFromName(e.currentTarget.value)}
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400"
                />
              </div>
              <CommandList>
                <CommandEmpty>
                  {nameLoading ? "Loading..." : "No Person found."}
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
                        setCurrentFromPerson(person);
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
                      {person.name + " " + person.lname}
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
                ? (() => {
                    const res = toPersonList?.find(
                      (person) => person.id === toNameValue
                    );
                    return res
                      ? `${res?.name} ${res?.lname}`
                      : "Search Name...";
                  })()
                : "Search Name..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[468px]">
            <Command>
              {/* <CommandInput
                placeholder="To Person"
                onChangeCapture={onToNameSearch}
              /> */}
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  placeholder="From Person"
                  value={toName}
                  onChange={(e) => setToName(e.currentTarget.value)}
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400"
                />
              </div>
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
                        setCurrentToPerson(person);
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
                      {person.name + " " + person.lname}
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
