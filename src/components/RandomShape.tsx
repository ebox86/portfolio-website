"use client";
import React, { useState } from 'react';

interface RandomShapeProps {
  clipPath?: string;
  hoverable?: boolean;
  children?: React.ReactNode;
}

const RandomShape: React.FC<RandomShapeProps> = ({ clipPath, hoverable, children }) => {
  const [style, setStyle] = useState<{ [key: string]: string | undefined }>({});

  const getRandomClipPath = () => {
    const points = [];
    const numPoints = Math.floor(Math.random() * 4) + 3; // Random number of points (between 3 and 6)
  
    // Generate points evenly distributed on a circle
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const x = 50 + 40 * Math.cos(angle); // Adjust the 40 to control the shape size
      const y = 50 + 40 * Math.sin(angle); // Adjust the 40 to control the shape size
      points.push(`${x}% ${y}%`);
    }
  
    return `polygon(${points.join(', ')})`;
  };

  const handleMouseEnter = () => {
    if (hoverable) {
      const newClipPath = getRandomClipPath();
      setStyle({ clipPath: newClipPath });
    }
  };

  const handleMouseLeave = () => {
    setStyle({});
  };

  return (
    <div
      className={`random-shape ${hoverable ? 'hover-effect' : ''}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hoverable ? (
        <div>{children}</div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default RandomShape;
