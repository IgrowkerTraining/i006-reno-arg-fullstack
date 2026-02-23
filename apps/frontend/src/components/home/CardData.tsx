import React from 'react'
import { Card } from '../common/Card'
import { LucideIcon } from "lucide-react";

type ColorVariant = "primary" | "secondary" | "accent";

interface CardDataProps {
    key: string;
    icon: LucideIcon;
    title: string;
    data: string;
    color: string;
}

const colorVariants: Record<ColorVariant, string> = {
  primary: "bg-primary/10 border-primary",
  secondary: "bg-secondary/10 border-secondary",
  accent: "bg-accent/10 border-accent",
};

const textColorVariants = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

const CardData = ({ icon: Icon, title, data, color }: CardDataProps) => {
    return (
        <Card className={`flex flex-col items-center gap-2 ${colorVariants[color]}`}>
            <Icon className={`inline size-10 mr-2 ${textColorVariants[color]} pl-0.5`} />
            <span className="text-m font-semibold text-center">{title}</span>
            <p className="text-3xl font-bold">{data}</p>
        </Card>
    )
}

export default CardData



