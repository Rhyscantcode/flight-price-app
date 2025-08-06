"use client";

import { useState } from 'react';
import type { FlightAlert } from '@/types';
import Header from '@/components/dashboard/header';
import { FlightAlertForm } from '@/components/dashboard/flight-alert-form';
import { AlertList } from '@/components/dashboard/alert-list';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const [selectedAlert, setSelectedAlert] = useState<FlightAlert | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (alert: FlightAlert) => {
    setSelectedAlert(alert);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAlert(null);
    setIsFormOpen(true);
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedAlert(null);
    }
    setIsFormOpen(open);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">
              Flight Alerts
            </h1>
            <p className="text-muted-foreground">
              Manage your price alerts and never miss a deal.
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-headline text-xl">
                  {selectedAlert ? 'Edit Flight Alert' : 'Create a New Flight Alert'}
                </DialogTitle>
                <DialogDescription>
                  Enter the flight details below. We'll watch the prices for you.
                </DialogDescription>
              </DialogHeader>
              <FlightAlertForm 
                alertToEdit={selectedAlert} 
                onFormSubmit={() => setIsFormOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
        <AlertList onEdit={handleEdit} />
      </main>
    </div>
  );
}
