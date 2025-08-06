"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import type { FlightAlert } from "@/types";
import { estimateRoutePrice, type EstimateRoutePriceOutput } from "@/ai/flows/estimate-route-price";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, Wand2 } from "lucide-react";

interface FlightAlertFormProps {
  alertToEdit?: FlightAlert | null;
  onFormSubmit: () => void;
}

const formSchema = z.object({
  origin: z.string().min(1, "Origin is required."),
  destination: z.string().min(1, "Destination is required."),
  dates: z.string().min(1, "Dates are required."),
  standardPrice: z.coerce.number().positive("Standard price must be a positive number for estimation."),
  targetPrice: z.coerce.number().positive("Target price must be a positive number."),
});

export function FlightAlertForm({ alertToEdit, onFormSubmit }: FlightAlertFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimation, setEstimation] = useState<EstimateRoutePriceOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      dates: "",
      standardPrice: 1000,
      targetPrice: 500,
    },
  });

  useEffect(() => {
    if (alertToEdit) {
      form.reset({
        origin: alertToEdit.origin,
        destination: alertToEdit.destination,
        dates: alertToEdit.dates,
        targetPrice: alertToEdit.targetPrice,
        standardPrice: 1000, // This is for estimation, not stored
      });
    } else {
      form.reset({
        origin: "",
        destination: "",
        dates: "",
        standardPrice: 1000,
        targetPrice: 500,
      });
    }
  }, [alertToEdit, form]);

  const handleEstimatePrice = async () => {
    const { origin, destination, dates, standardPrice } = form.getValues();
    if (!origin || !destination || !dates || !standardPrice) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in origin, destination, dates, and a max standard price to get an estimation.",
      });
      return;
    }

    setIsEstimating(true);
    setEstimation(null);
    try {
      const result = await estimateRoutePrice({ origin, destination, dates, standardPrice });
      setEstimation(result);
    } catch (error) {
      console.error("AI Estimation Error:", error);
      toast({
        variant: "destructive",
        title: "Estimation Failed",
        description: "Could not get a price estimation. Please try again.",
      });
    } finally {
      setIsEstimating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ variant: "destructive", title: "Not Authenticated" });
      return;
    }
    setIsSubmitting(true);
    try {
      const alertData = {
        userId: user.uid,
        origin: values.origin,
        destination: values.destination,
        dates: values.dates,
        targetPrice: values.targetPrice,
      };

      if (alertToEdit) {
        await updateDoc(doc(db, "flightAlerts", alertToEdit.id), {
          ...alertData,
          updatedAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Alert updated successfully." });
      } else {
        await addDoc(collection(db, "flightAlerts"), {
          ...alertData,
          createdAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "New alert created successfully." });
      }
      onFormSubmit();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not save the alert." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="origin" render={({ field }) => (
            <FormItem><FormLabel>Origin</FormLabel><FormControl><Input placeholder="e.g., SFO" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="destination" render={({ field }) => (
            <FormItem><FormLabel>Destination</FormLabel><FormControl><Input placeholder="e.g., JFK" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="dates" render={({ field }) => (
          <FormItem><FormLabel>Travel Dates</FormLabel><FormControl><Input placeholder="e.g., October 2024" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <FormField control={form.control} name="standardPrice" render={({ field }) => (
            <FormItem><FormLabel>Max Standard Price</FormLabel><FormControl><Input type="number" placeholder="1000" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="button" variant="outline" onClick={handleEstimatePrice} disabled={isEstimating} className="w-full md:w-auto">
            {isEstimating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Estimate Standard Price
          </Button>
        </div>

        {isEstimating && <div className="text-sm text-muted-foreground flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /><span>Getting AI price estimation...</span></div>}

        {estimation && (
          <Alert className="bg-primary/10 border-primary/50">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertTitle className="font-headline text-primary">AI Price Suggestion</AlertTitle>
            <AlertDescription>
              Estimated standard price is around <strong>${estimation.estimatedPrice.toLocaleString()}</strong>.
              <br/>
              <span className="text-xs">{estimation.reasoning}</span>
            </AlertDescription>
          </Alert>
        )}

        <FormField control={form.control} name="targetPrice" render={({ field }) => (
            <FormItem><FormLabel>Your Target Price ($)</FormLabel><FormControl><Input type="number" placeholder="500" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onFormSubmit}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {alertToEdit ? "Save Changes" : "Create Alert"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
