
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EventSuggestionCardProps {
  title: string;
  description: string;
  icon: string;
  category: string;
  onSelect: (category: string) => void;
}

export default function EventSuggestionCard({
  title,
  description,
  icon,
  category,
  onSelect
}: EventSuggestionCardProps) {
  return (
    <Card className="border border-gray-200 h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-xl">{icon}</span> {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-koffa-green"
          onClick={() => onSelect(category)}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </CardFooter>
    </Card>
  );
}
