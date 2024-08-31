import React, { useState } from 'react';

interface ButtonProps {
  onClick: () => void;
  imageSrc: string;
  pressedImageSrc?: string;
  alt: string;
  x: number;
  y: number;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  imageSrc,
  pressedImageSrc,
  alt,
  x,
  y,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getFilterStyle = () => {
    if (isPressed) {
      return pressedImageSrc ? 'none' : 'brightness(0.5)';
    }
    return isHovered ? 'brightness(0.7)' : 'none';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        top: `${y}px`,
        left: `${x}px`,
        padding: 0,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <img
        src={isPressed && pressedImageSrc ? pressedImageSrc : imageSrc}
        alt={alt}
        style={{
          filter: getFilterStyle(),
          transition: 'filter 0.1s ease-in-out',
        }}
      />
    </button>
  );
};

export default Button;
