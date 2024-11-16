"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TbCirclesRelation } from "react-icons/tb";
import {
  fetchData,
  fetchNames,
  convertToCytoscapeElements,
} from "../utils/neo4j";
import cytoscape from "cytoscape";
import { Check, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
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
  const [fromNameValue, setFromNameValue] = useState<string>("");
  const [toNameOpen, setToNameOpen] = useState<boolean>(false);
  const [toNameValue, setToNameValue] = useState<string>("");
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
    const query = `MATCH (p:Person) WHERE lower(p.person_name) STARTS WITH '${str}' OR lower(p.person_name) ENDS WITH '${str}' OR lower(p.person_name) CONTAINS '${str}' RETURN p.person_name AS name, p.person_surname as lname, p.person_id AS id`;
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
    const query = `MATCH (p:Person) WHERE lower(p.person_name) STARTS WITH '${str}' OR lower(p.person_name) ENDS WITH '${str}' OR lower(p.person_name) CONTAINS '${str}' RETURN p.person_name AS name, p.person_surname as lname, p.person_id AS id`;
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

  const onClickSearch = async () => {
    try {
      setIsLoading(true);
      const query = `match p=shortestPath((a:Person {person_id: "${fromNameValue}"})-[*1..10]->(b:Person {person_id: "${toNameValue}"})) RETURN p`;
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
        wheelSensitivity: 0.2,
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
      <div className="w-full bg-slate-700 px-8 py-6 flex max-md:flex-col justify-evenly gap-4">
        <div>
          <Popover open={fromNameOpen} onOpenChange={setFromNameOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={fromNameOpen}
                className="w-[468px] max-md:w-full justify-start text-black"
              >
                {fromNameValue
                  ? (() => {
                      const res = fromPersonList?.find(
                        (person) => person.id === fromNameValue
                      );
                      return res ? `${res?.name} ${res?.lname}` : "From Person";
                    })()
                  : "From Person"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[468px] max-md:w-full">
              <Command>
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    placeholder="Type Name here..."
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
        <div className="h-10 flex flex-col justify-center max-md:hidden">
          <TbCirclesRelation size={32} color="white" />
        </div>
        <div>
          <Popover open={toNameOpen} onOpenChange={setToNameOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={toNameOpen}
                className="w-[468px] max-md:w-full justify-start"
              >
                {toNameValue
                  ? (() => {
                      const res = toPersonList?.find(
                        (person) => person.id === toNameValue
                      );
                      return res ? `${res?.name} ${res?.lname}` : "To Person";
                    })()
                  : "To Person"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[468px]">
              <Command>
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input
                    placeholder="Type Name here..."
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
          style={{ height: "800px", width: "100%" }}
        ></div>
      </div>
    </div>
  );
};

export default SearchPage;
