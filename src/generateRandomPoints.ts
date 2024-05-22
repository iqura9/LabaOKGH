import { POINT_RADIUS, FIELD_HEIGHT, FIELD_WIDTH, IPoint } from "./App";

export function generateRandomPoints(numPoints: number) {
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
}
