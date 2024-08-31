import { useEffect, useRef, useState } from 'react';
import { Theme } from '../main/theme-parser';
import './App.css';

interface TextProps {
  text: string;
  config: {
    x: number;
    y: number;
    textWidth?: number;
    fontSize?: number;
    fontColor?: string;
  };
  theme: Theme;
}

export const Text = ({ text, config, theme }: TextProps) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const width = config.textWidth || theme.config?.textWidth || 100;
  const fontSize = config.fontSize || theme.config?.fontSize || 12;
  const color = config.fontColor || theme.config?.fontColor || '#000000';

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        const isOverflow =
          textRef.current.scrollWidth > containerRef.current.clientWidth;
        setIsOverflowing(isOverflow);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text, width, fontSize]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: `${config.y}px`,
        left: `${config.x}px`,
        width: `${width}px`,
        height: `${fontSize + 4}px`,
        overflow: 'hidden',
      }}
    >
      <p
        ref={textRef}
        className={isOverflowing ? 'marquee' : ''}
        style={{
          fontSize: `${fontSize}px`,
          color,
          whiteSpace: 'nowrap',
          margin: 0,
          lineHeight: `${fontSize + 4}px`,
          display: 'inline-block', // Ensure the p takes only the width of its content
          paddingLeft: isOverflowing ? `${width}px` : '0', // Start the text outside the container if overflowing
        }}
      >
        {text}
      </p>
    </div>
  );
};
