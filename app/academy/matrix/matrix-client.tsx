"use client";

import { Button } from "@/components/ui/button";

const styles = ["spartan", "bushido", "stoic", "yogic", "ubuntu", "highperf"];

interface MatrixClientProps {
  module: any;
}

export function MatrixClient({ module }: MatrixClientProps) {
  const handlePreview = async (style: string) => {
    try {
      const response = await fetch(
        `/api/generate/practice?moduleId=${module.id}&level=Beginner&style=${style}`
      );
      const data = await response.json();
      console.log(`${style} preview:`, data);
      
      // You could also show this in a modal or toast
      alert(`${style} preview generated! Check console for details.`);
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Error generating preview. Please try again.');
    }
  };

  return (
    <div className="flex flex-wrap gap-1">
      {styles.map((style) => (
        <Button
          key={style}
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={() => handlePreview(style)}
        >
          {style}
        </Button>
      ))}
    </div>
  );
} 