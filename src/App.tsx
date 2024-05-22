import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";
import "./App.css";
interface IPoint {
  x: number;
  y: number;
  radius: number;
}

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
    const minDistance = 20;

    const isColliding = (point: IPoint, otherPoints: IPoint[]) => {
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

    while (points.length < numPoints) {
      const newPoint = {
        x: Math.floor(Math.random() * 500),
        y: Math.floor(Math.random() * 500),
        radius: 10,
      };

      if (!isColliding(newPoint, points)) {
        points.push(newPoint);
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
      <label htmlFor="numPoints">Number of Points:</label>
      <input
        type="number"
        id="numPoints"
        value={numPoints}
        onChange={handleNumPointsChange}
      />
      <div>
        x: {pointCoord?.evt?.offsetX}, y: {pointCoord?.evt?.offsetY}
      </div>

      <Stage width={500} height={500} style={{ cursor: "pointer" }}>
        <Layer onMouseMove={(e) => setPointCoord(e)}>
          <Rect
            x={0}
            y={0}
            width={500}
            height={500}
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
                <Text
                  x={point.x + 15}
                  y={point.y + 15}
                  text={`(${point.x.toFixed(0)}, ${point.y.toFixed(0)})`}
                />
              )}
            </Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
