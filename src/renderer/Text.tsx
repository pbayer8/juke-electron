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

export const Text = ({ text, config, theme }: TextProps) => (
  <p
    style={{
      top: `${config.y}px`,
      left: `${config.x}px`,
      width: `${config.textWidth || theme.config?.textWidth || 100}px`,
      fontSize: `${config.fontSize || theme.config?.fontSize || 12}px`,
      color: config.fontColor || theme.config?.fontColor || '#000000',
    }}
  >
    {text}
  </p>
);
