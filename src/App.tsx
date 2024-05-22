import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";
import "./App.css";
import { generateRandomPoints } from "./generateRandomPoints";
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
  const [circle, setCircle] = useState<IPoint | null>();
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const handleNumPointsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setNumPoints(isNaN(value) ? 0 : value);
  };

  useEffect(() => {
    setPoints(generateRandomPoints(numPoints));
  }, [numPoints, setPoints]);

  const handleMouseEnter = (index: number) => {
    setHoveredPoint(index);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const [pointCoord, setPointCoord] = useState();

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
        x: {pointCoord?.evt?.offsetX}, y: {pointCoord?.evt?.offsetY}
      </div>

      <Stage
        width={FIELD_WIDTH}
        height={FIELD_HEIGHT}
        style={{ cursor: "pointer" }}
      >
        <Layer onMouseMove={(e) => setPointCoord(e)}>
          <Rect
            x={0}
            y={0}
            width={FIELD_WIDTH}
            height={FIELD_HEIGHT}
            fill="#f0f0f0"
            stroke="black"
          />
          {circle ? (
            <Circle
              x={circle?.x}
              y={circle?.y}
              radius={circle?.radius}
              stroke="blue"
            />
          ) : null}
          {points?.map((point, index) => (
            <Fragment key={index}>
              <Circle
                x={point.x}
                y={point.y}
                radius={point.radius}
                fill="red"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              />
              {hoveredPoint === index && (
                <span style={{ zIndex: 1000 }}>
                  <Text
                    x={point.x + 15}
                    y={point.y + 15}
                    text={`(${point.x.toFixed(0)}, ${point.y.toFixed(0)})`}
                  />
                </span>
              )}
            </Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
