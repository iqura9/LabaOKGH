import React, { Fragment, useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";
import { FIELD_WIDTH, FIELD_HEIGHT, IPoint } from "./App";

interface FieldProps {
  circle?: IPoint;
  points?: IPoint[];
  voronoiPoints?: IPoint[];
  setPointCoord: React.Dispatch<React.SetStateAction<undefined>>;
}

export function Field({
  circle,
  points,
  voronoiPoints,
  setPointCoord,
}: FieldProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const handleMouseEnter = (index: number) => {
    setHoveredPoint(index);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
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
            {/* {hoveredPoint === index && ( */}
            {/* <span style={{ zIndex: 1000 }}>
              <Text
                x={point.x + 15}
                y={point.y + 15}
                text={`(${point.x.toFixed(0)}, ${point.y.toFixed(0)})`}
              />
            </span> */}
          </Fragment>
        ))}
        {voronoiPoints?.map((point, index) => (
          <Fragment key={index}>
            <Circle
              x={point.x}
              y={point.y}
              radius={5}
              //stroke="blue"
              fill="blue"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            />
            {/* {hoveredPoint === index && ( */}
            {/* <span style={{ zIndex: 1000 }}>
            <Text
              x={point.x + 15}
              y={point.y + 15}
              text={`(${point.x.toFixed(0)}, ${point.y.toFixed(0)})`}
            />
          </span> */}
          </Fragment>
        ))}
      </Layer>
    </Stage>
  );
}
