import React from 'react'
import { Card } from '../common/Card'
import { LucideIcon } from "lucide-react";

type ColorVariant = "primary" | "secondary" | "accent" | "accent-2";

interface CardDataProps {
  icon: LucideIcon;
  title: string;
  data: string;
  color: ColorVariant;
}

const colorVariants: Record<ColorVariant, string> = {
  primary: "bg-primary/10 border-primary",
  secondary: "bg-secondary-plus/10 border-secondary-plus",
  accent: "bg-accent/10 border-accent",
  "accent-2": "bg-accent-2/10 border-accent-2",
};

const textColorVariants: Record<ColorVariant, string> = {
  primary: "text-primary",
  secondary: "text-secondary-plus",
  accent: "text-accent",
  "accent-2": "text-accent-2",
};

const CardData: React.FC<CardDataProps> = ({ icon: Icon, title, data, color}) => {
  return (
    <Card className={`flex flex-col rounded-lg p-6 items-center gap-2 ${colorVariants[color]} ${textColorVariants[color]} hover:scale-105 transition-transform `}>
      <Icon className={`size-10 `} />
      <span className="text-md font-semibold text-center">{title}</span>
      <p className="text-3xl font-bold">{data}</p>
    </Card>
  );
};
export default CardData



