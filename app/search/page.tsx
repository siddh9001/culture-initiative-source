"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TbCirclesRelation } from "react-icons/tb";
import {
  fetchData,
  fetchNames,
  convertToCytoscapeElements,
} from "../utils/neo4j";
import cytoscape from "cytoscape";
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
import { RecordShape } from "neo4j-driver";

type Props = {};

const SearchPage = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fromPersonList, setFromPersonList] = useState<
    RecordShape[] | undefined
  >([]);
  const [toPersonList, setToPersonList] = useState<RecordShape[] | undefined>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nameLoading, setNameLoading] = useState<boolean>(false);
  const [fromNameOpen, setFromNameOpen] = useState<boolean>(false);
  // const [fromPerson, setFromPerson] = useState<string>("");
  const [fromNameValue, setFromNameValue] = useState<string>("");
  const [toNameOpen, setToNameOpen] = useState<boolean>(false);
  const [toNameValue, setToNameValue] = useState<string>("");
  // const [toPerson, setToPerson] = useState<string>("");

  // const onChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFromPerson(event.target.value);
  // };

  // const onChangeTo = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setToPerson(event.target.value);
  // };

  const onFromNameSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
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
        console.log("names list: ", result, typeof result);
        setToPersonList(result);
      }
    } catch (error) {
      console.error("error loading name: ", error);
    } finally {
      setNameLoading(false);
    }
  };

  const onClickSearch = async () => {
    try {
      setIsLoading(true);
      const query = `match p=shortestPath((a:Person {person_id: "${fromNameValue}"})-[*1..10]-(b:Person {person_id: "${toNameValue}"})) RETURN p`;
      // console.log(query);
      const data = await fetchData(query);

      const elements = convertToCytoscapeElements(data);
      // console.log(data);

      const cy = cytoscape({
        container: containerRef.current,
        elements,
        style: [
          {
            selector: "node",
            style: {
              label: "data(label)",
              width: "80px",
              height: "80px",
              "background-color": "#0074D9",
              color: "#fff",
              "text-valign": "center",
              "text-halign": "center",
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              "line-color": "#fff",
              "target-arrow-color": "#fff",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
              label: "data(label)",
              color: "#fff",
            },
          },
        ],
        layout: {
          name: "cose",
          fit: true,
          // directed: true,
          padding: 10,
          randomize: false,
          componentSpacing: 100,
          nodeRepulsion: () => 400000,
          edgeElasticity: () => 100,
          nestingFactor: 5,
          gravity: 80,
          numIter: 1000,
          initialTemp: 200,
          coolingFactor: 0.95,
          minTemp: 1.0,
        },
      });
    } catch (error) {
      console.error("Search Click failed: ", error);
    } finally {
      setFromNameValue("");
      setToNameValue("");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900">
      <div className="w-full bg-slate-700 px-8 py-6 flex justify-evenly gap-4">
        <div>
          <Popover open={fromNameOpen} onOpenChange={setFromNameOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={fromNameOpen}
                className="w-[468px] justify-start text-black"
              >
                {fromNameValue
                  ? fromPersonList?.find(
                      (person) => person.id === fromNameValue
                    )?.name
                  : "From Person"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[468px]">
              <Command>
                <CommandInput
                  placeholder="From Person"
                  onChangeCapture={onFromNameSearch}
                />
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
        <div className="h-10 flex flex-col justify-center">
          <TbCirclesRelation size={32} color="white" />
        </div>
        <div>
          <Popover open={toNameOpen} onOpenChange={setToNameOpen}>
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
                  : "To Person"}
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
          onClick={onClickSearch}
          className="text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors"
        >
          Search
        </Button>
      </div>
      <div className="w-[98%] border-2 border-gray-400 mx-auto m-4">
        {isLoading && <div>Loading...</div>}
        <div
          id="graph01"
          ref={containerRef}
          style={{ height: "800px", width: "1200px" }}
        ></div>
      </div>
    </div>
  );
};

export default SearchPage;
