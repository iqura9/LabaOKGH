import { FIELD_HEIGHT, FIELD_WIDTH, IPoint } from "./App";
import Voronoi from "voronoi";

export interface IVoronoiCell {
  site: IPoint;
  vertices: [number, number][];
}

export interface IVoronoiDiagram {
  cells: IVoronoiCell[];
  points: { x: number; y: number; radius: number }[];
  vertices: {
    x: number;
    y: number;
    radius: number;
    closestPoint: IPoint;
    distance: number;
  }[];
}

export function generateVoronoiDiagram(points: IPoint[]): IVoronoiDiagram {
  const voronoi = new Voronoi();

  // Define the bounding box for the Voronoi diagram
  const bbox = { xl: 0, xr: FIELD_WIDTH, yt: 0, yb: FIELD_HEIGHT };

  // Compute the Voronoi diagram with the given points and bounding box
  const diagram = voronoi.compute(points, bbox);

  // Extract the Voronoi cells and their vertices
  const cells: IVoronoiCell[] = diagram.cells.map((cell) => ({
    site: { x: cell.site.x, y: cell.site.y },
    vertices: cell.halfedges.map((halfedge) => [
      halfedge.getStartpoint().x,
      halfedge.getStartpoint().y,
    ]),
  }));

  // Extract all unique vertices from the Voronoi diagram and compute their radius
  const uniqueVertices = new Set<string>();
  const vertices: {
    x: number;
    y: number;
    radius: number;
    closestPoint: IPoint;
    distance: number;
  }[] = [];

  diagram.edges.forEach((edge) => {
    if (edge.va && edge.vb) {
      const va = { x: edge.va.x, y: edge.va.y };
      const vb = { x: edge.vb.x, y: edge.vb.y };

      const vaKey = `${va.x},${va.y}`;
      const vbKey = `${vb.x},${vb.y}`;

      if (!uniqueVertices.has(vaKey)) {
        uniqueVertices.add(vaKey);
        const closestPoint = getClosestPoint(va, points, bbox);
        vertices.push({
          x: va.x,
          y: va.y,
          radius: closestPoint.distance,
          closestPoint: closestPoint.point,
          distance: closestPoint.distance,
        });
      }

      if (!uniqueVertices.has(vbKey)) {
        uniqueVertices.add(vbKey);
        const closestPoint = getClosestPoint(vb, points, bbox);
        vertices.push({
          x: vb.x,
          y: vb.y,
          radius: closestPoint.distance,
          closestPoint: closestPoint.point,
          distance: closestPoint.distance,
        });
      }
    }
  });

  // Structure the result according to the IVoronoiDiagram interface
  const result: IVoronoiDiagram = {
    cells,
    points: points.map((point) => ({ x: point.x, y: point.y, radius: 0 })), // Assuming radius is 0 for now
    vertices,
  };

  console.log(result);
  return result;
}

function getClosestPoint(
  vertex: IPoint,
  points: IPoint[],
  bbox: { xl: number; xr: number; yt: number; yb: number }
): { point: IPoint; distance: number } {
  const newPoints = JSON.parse(JSON.stringify(points));
  const allPoints = [
    ...newPoints,
    { x: bbox.xl, y: bbox.yt },
    { x: bbox.xr, y: bbox.yt },
    { x: bbox.xr, y: bbox.yb },
    { x: bbox.xl, y: bbox.yb },

    { x: vertex.x, y: bbox.yt },
    { x: vertex.x, y: bbox.yb },

    { x: bbox.xl, y: vertex.y },
    { x: bbox.xr, y: vertex.y },
  ];
  return allPoints.reduce(
    (closest, point) => {
      const distance = Math.sqrt(
        (point.x - vertex.x) ** 2 + (point.y - vertex.y) ** 2
      );
      return distance < closest.distance ? { point, distance } : closest;
    },
    { point: allPoints[0], distance: Infinity }
  );
}
