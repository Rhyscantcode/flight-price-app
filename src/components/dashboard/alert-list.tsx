"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc, orderBy } from "firebase/firestore";
import type { FlightAlert } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Calendar, Edit, MoreVertical, PlaneLanding, PlaneTakeoff, Tag, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from 'date-fns';

interface AlertListProps {
  onEdit: (alert: FlightAlert) => void;
}

export function AlertList({ onEdit }: AlertListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<FlightAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(collection(db, "flightAlerts"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FlightAlert));
      setAlerts(alertsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching alerts:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not fetch alerts." });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleDelete = async (alertId: string) => {
    try {
      await deleteDoc(doc(db, "flightAlerts", alertId));
      toast({ title: "Success", description: "Alert deleted successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete alert." });
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold font-headline">No Alerts Found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You haven't created any flight alerts yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Click "New Alert" to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className="flex flex-col">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="font-headline text-lg">{alert.origin} to {alert.destination}</CardTitle>
              <CardDescription>
                {alert.createdAt ? `Created on ${format(alert.createdAt.toDate(), 'PPP')}` : ''}
              </CardDescription>
            </div>
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(alert)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your flight alert.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(alert.id)} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent className="flex-grow space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <PlaneTakeoff className="h-4 w-4 text-muted-foreground" />
              <span><strong>From:</strong> {alert.origin}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <PlaneLanding className="h-4 w-4 text-muted-foreground" />
              <span><strong>To:</strong> {alert.destination}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span><strong>Dates:</strong> {alert.dates}</span>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Tag className="h-5 w-5" />
              <span>Target Price: ${alert.targetPrice.toLocaleString()}</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
