"use client";
import React, { useEffect, useRef } from "react";
import { fetchData, convertToCytoscapeElements } from "../utils/neo4j";
import cytoscape from "cytoscape";

type NeoGraphProps = {
  containerID: string;
};

const NeoGraph = ({ containerID }: NeoGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDataAndRender = async () => {
      const data = await fetchData(
        'match p=shortestPath((a:Person {person_name: "Poorvi"})-[*1..10]-(b:Person {person_name: "Nirvi"})) RETURN p'
      );

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
    };
    fetchDataAndRender();
  }, []);
  return (
    <div
      id={containerID}
      ref={containerRef}
      style={{ width: "800px", height: "600px" }}
    />
  );
};

export default NeoGraph;
