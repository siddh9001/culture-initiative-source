import neo4j, { RecordShape } from "neo4j-driver";
import cytoscape from "cytoscape";

const neo4jUri = process.env.NEXT_PUBLIC_NEO4J_URI!;
const neo4jUser = process.env.NEXT_PUBLIC_NEO4J_USERNAME!;
const neo4jPassword = process.env.NEXT_PUBLIC_NEO4J_PASSWORD!;

// ===================================== function to return the relationship data ===================================
export async function fetchData(query: string) {
  const driver = neo4j.driver(
    neo4jUri,
    neo4j.auth.basic(neo4jUser, neo4jPassword)
  );
  const session = driver.session();

  try {
    const result = await session.run(query);
    return result.records.map((record) => record.toObject());
  } catch (error) {
    console.log("fetchdata error: ", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

//===================================== function to return list of names searched ===================================
export async function fetchNames(query: string) {
  const driver = neo4j.driver(
    neo4jUri,
    neo4j.auth.basic(neo4jUser, neo4jPassword)
  );
  const session = driver.session();

  try {
    const result = await session.run(query);
    return result.records.map((record) => record.toObject());
  } catch (error) {
    console.error("fetchnames error: ", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// ==================================== function to create a person node ============================================
export async function CreatePersonNode(query: string) {
  const driver = neo4j.driver(
    neo4jUri,
    neo4j.auth.basic(neo4jUser, neo4jPassword)
  );
  const session = driver.session();

  try {
    const result = await session.run(query);
    // console.log("node create success: ", result);
    // return result.records.map((record) => record.toObject());
  } catch (error) {
    console.error("node create error: ", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

export function convertToCytoscapeElements(
  paths: RecordShape[] | undefined
): cytoscape.ElementDefinition[] {
  const elements: cytoscape.ElementDefinition[] = [];
  const nodes = new Set();
  const edges = new Set();

  paths?.forEach((path) => {
    const { p } = path;
    const firstNode = p.start;
    const lastNode = p.end;

    if (!nodes.has(firstNode.identity.toString())) {
      nodes.add(firstNode.identity.toString());
      elements.push({
        data: {
          id: firstNode.identity.toString(),
          label: firstNode.properties.person_name,
          ...firstNode.properties,
        },
      });
    }
    if (!nodes.has(lastNode.identity.toString())) {
      nodes.add(lastNode.identity.toString());
      elements.push({
        data: {
          id: lastNode.identity.toString(),
          label: lastNode.properties.person_name,
          ...lastNode.properties,
        },
      });
    }
    p.segments.forEach((segment: any) => {
      const startNode = segment.start;
      const endNode = segment.end;
      const relationship = segment.relationship;

      if (!nodes.has(startNode.identity.toString())) {
        nodes.add(startNode.identity.toString());
        elements.push({
          data: {
            id: startNode.identity.toString(),
            label: startNode.properties.person_name,
            ...startNode.properties,
          },
        });
      }

      if (!nodes.has(endNode.identity.toString())) {
        nodes.add(endNode.identity.toString());
        elements.push({
          data: {
            id: endNode.identity.toString(),
            label: endNode.properties.person_name,
            ...endNode.properties,
          },
        });
      }

      const edgeId = `${startNode.identity.toString()}-${
        relationship.type
      }-${endNode.identity.toString()}`;
      if (!edges.has(edgeId)) {
        edges.add(edgeId);
        elements.push({
          data: {
            id: edgeId,
            source: startNode.identity.toString(),
            target: endNode.identity.toString(),
            label: relationship.type,
            ...relationship.properties,
          },
        });
      }
    });
  });
  return elements;
}
