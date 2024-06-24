"use client";
import React, { useState, useRef } from "react";
import { TbCirclesRelation } from "react-icons/tb";
import { fetchData, convertToCytoscapeElements } from "../utils/neo4j";
import cytoscape from "cytoscape";

type Props = {};

const SearchPage = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fromPerson, setFromPerson] = useState<string>("");
  const [toPerson, setToPerson] = useState<string>("");

  const onChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromPerson(event.target.value);
  };

  const onChangeTo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToPerson(event.target.value);
  };

  const onClickSearch = async () => {
    try {
      setIsLoading(true);
      const query = `match p=shortestPath((a:Person {person_name: "${fromPerson}"})-[*1..10]-(b:Person {person_name: "${toPerson}"})) RETURN p`;
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
      setFromPerson("");
      setToPerson("");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900">
      <div className="w-full bg-slate-700 px-8 py-6 flex justify-evenly gap-4">
        <div className="h-12 w-full bg-slate-200 rounded-lg flex place-content-center">
          <input
            value={fromPerson}
            onChange={onChangeFrom}
            className="bg-inherit w-full p-4 rounded-lg caret-slate-900 placeholder-slate-700 text-slate-900"
            placeholder="From"
          />
        </div>
        <div className="h-12 flex flex-col justify-center">
          <TbCirclesRelation size={32} />
        </div>
        <div className="h-12 w-full bg-slate-200 rounded-lg flex place-content-center">
          <input
            value={toPerson}
            onChange={onChangeTo}
            className="bg-inherit w-full p-4 rounded-lg caret-slate-900 placeholder-slate-700 text-slate-900"
            placeholder="To"
          />
        </div>
        <button
          onClick={onClickSearch}
          className="h-12 px-7 py-3 text-white bg-sky-800 rounded-lg hover:bg-sky-700 transition-colors"
        >
          Search
        </button>
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
