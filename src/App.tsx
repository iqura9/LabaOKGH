import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";
import "./App.css";
interface IPoint {
  x: number;
  y: number;
  radius: number;
}

const POINT_RADIUS = 10;
const FIELD_WIDTH = 1000;
const FIELD_HEIGHT = 500;

const App = () => {
  const [numPoints, setNumPoints] = useState(10);
  const [points, setPoints] = useState<IPoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const handleNumPointsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setNumPoints(isNaN(value) ? 0 : value);
  };

  useEffect(() => {
    setPoints(generateRandomPoints(numPoints));
  }, [numPoints, setPoints]);

  const generateRandomPoints = (numPoints: number) => {
    const points = [];
    const minDistance = POINT_RADIUS * 2;

    const isColliding = (point: IPoint, otherPoints: IPoint[]) => {
      if (point.y <= point.radius) return true;
      if (point.y >= FIELD_HEIGHT - point.radius - 1) return true;

      if (point.x <= point.radius) return true;
      if (point.x >= FIELD_WIDTH - point.radius - 1) return true;

      for (const otherPoint of otherPoints) {
        const distance = Math.sqrt(
          Math.pow(point.x - otherPoint.x, 2) +
            Math.pow(point.y - otherPoint.y, 2)
        );
        if (distance < minDistance) {
          return true;
        }
      }
      return false;
    };
    let i = 0;
    while (points.length < numPoints) {
      const newPoint = {
        x: Math.floor(Math.random() * FIELD_WIDTH),
        y: Math.floor(Math.random() * FIELD_HEIGHT),
        radius: POINT_RADIUS,
      };

      if (!isColliding(newPoint, points)) {
        points.push(newPoint);
      } else {
        i++;
        if (i > 10000) {
          alert("To many points, try less");
          return points;
        }
      }
    }

    return points;
  };

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
