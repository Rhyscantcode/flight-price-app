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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

interface FlightAlertFormProps {
  alertToEdit?: FlightAlert | null;
  onFormSubmit: () => void;
}

const formSchema = z.object({
  origin: z.string().min(1, "Origin is required."),
  destination: z.string().min(1, "Destination is required."),
  dates: z.string().min(1, "Dates are required."),
  targetPrice: z.coerce.number().positive("Target price must be a positive number."),
});

export function FlightAlertForm({ alertToEdit, onFormSubmit }: FlightAlertFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      dates: "",
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
      });
    } else {
      form.reset({
        origin: "",
        destination: "",
        dates: "",
        targetPrice: 500,
      });
    }
  }, [alertToEdit, form]);

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
