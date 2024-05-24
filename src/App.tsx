import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import { generateRandomPoints } from "./generateRandomPoints";
import { generateVoronoiDiagram } from "./generateVoronoiDiagram";
import { Field } from "./Field";
export interface IPoint {
  x: number;
  y: number;
  radius: number;
}

export const POINT_RADIUS = 10;
export const FIELD_WIDTH = 1000;
export const FIELD_HEIGHT = 500;

const App = () => {
  const [numPoints, setNumPoints] = useState(10);
  const [points, setPoints] = useState<IPoint[]>([]);

  const [voronoiPoints, setVoronoiPoints] = useState<IPoint[]>([]);
  const [circle, setCircle] = useState<IPoint | null>();

  const handleNumPointsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setNumPoints(isNaN(value) ? 0 : value);
  };

  useEffect(() => {
    setPoints(generateRandomPoints(numPoints));
  }, [numPoints, setPoints]);

  const [pointCoord, setPointCoord] = useState();

  // React useEffect to handle updating voronoi points
  useEffect(() => {
    const voronoiPoints = generateVoronoiDiagram(points); // Assume points is already defined
    setVoronoiPoints(voronoiPoints.vertices);
    let maxDistance = 0;
    let maxCircle: IPoint | null = null;

    voronoiPoints.vertices.forEach((v) => {
      if (v.distance > maxDistance) {
        maxDistance = v.distance;
        maxCircle = {
          x: v.x,
          y: v.y,
          radius: v.radius,
        };
      }
      console.log(
        `Voronoi Vertex: (${v.x}, ${v.y}), Closest Point: (${v.closestPoint.x}, ${v.closestPoint.y}), Distance: ${v.distance}`
      );
    });
    console.log(maxCircle);
    setCircle(maxCircle);
  }, [points]);

  return (
    <div className="Wrapper">
      <label htmlFor="numPoints">Number of Points: {numPoints}</label>
      <input
        type="number"
        id="numPoints"
        value={numPoints}
        onChange={handleNumPointsChange}
      />
      <div>
        x: {pointCoord?.evt?.offsetX}, y: {pointCoord?.evt?.offsetY}, Circle
        square: {(3.14 * (circle?.radius ?? 0) ** 2).toFixed(2)}, Circle radius:{" "}
        {circle?.radius.toFixed(2)}
      </div>
      <Field circle={circle} points={points} setPointCoord={setPointCoord} />
      <Field
        circle={circle}
        points={points}
        voronoiPoints={voronoiPoints}
        setPointCoord={setPointCoord}
      />
    </div>
  );
};

export default App;
