
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Dog, PawPrint, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWelpingManagement } from "../../hooks/useWelpingManagement";
import EmptyState from "@/components/common/EmptyState";
import { format, addDays } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const PregnantDogsTab = () => {
  const navigate = useNavigate();
  const { pregnantDogs, isLoading } = useWelpingManagement();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pregnantDogs || pregnantDogs.length === 0) {
    return (
      <EmptyState
        icon={<Dog className="h-12 w-12 text-muted-foreground" />}
        title="No pregnant dogs"
        description="There are currently no dogs marked as pregnant in the system."
        action={{
          label: "Add Pregnant Dog",
          onClick: () => navigate("/reproductive-management"),
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pregnantDogs.map((dog) => {
        const dueDate = dog.tie_date
          ? addDays(new Date(dog.tie_date), 63)
          : undefined;
          
        return (
          <Card key={dog.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={dog.photoUrl || ''} alt={dog.name} />
                  <AvatarFallback>{dog.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{dog.name}</CardTitle>
                  <CardDescription>
                    {dog.breed || "Unknown breed"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-2 mt-2">
                <div className="flex items-center text-sm">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">
                    {dueDate
                      ? `Due around ${format(dueDate, "PPP")}`
                      : "Due date unknown"}
                  </span>
                </div>
                
                {dog.last_heat_date && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      Last heat: {format(new Date(dog.last_heat_date), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
                
                <div className="flex mt-2">
                  <Badge variant="outline" className="bg-pink-50 text-pink-800 border-pink-200">
                    <PawPrint className="h-3 w-3 mr-1" />
                    Pregnant
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dogs/${dog.id}`)}
              >
                View Profile
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(`/reproductive-management/${dog.id}`)}
              >
                Manage Pregnancy
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default PregnantDogsTab;
