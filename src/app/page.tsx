import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, BellRing } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm border-b">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <Logo />
          <span className="text-xl font-bold font-headline">Sky Sentinel</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/signup" prefetch={false}>
              Sign Up
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Never Miss a Flight Deal Again
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Sky Sentinel is your personal flight price watchdog. Set your desired routes and get instant alerts when prices drop.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/signup" prefetch={false}>
                      Get Started for Free
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                     <Link href="/dashboard" prefetch={false}>
                      Login to Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
              <img
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="travel airplane"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simple steps to start saving on your next adventure.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center items-center space-y-4 text-center p-4 rounded-lg hover:bg-card hover:shadow-lg transition-all">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Logo className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Create Alerts</h3>
                <p className="text-muted-foreground">
                  Set your origin, destination, and desired travel dates. We'll monitor the prices 24/7.
                </p>
              </div>
              <div className="flex flex-col justify-center items-center space-y-4 text-center p-4 rounded-lg hover:bg-card hover:shadow-lg transition-all">
                <div className="bg-primary/10 p-4 rounded-full">
                 <BellRing className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Get Notified</h3>
                <p className="text-muted-foreground">
                  Receive an alert the moment the price for your tracked flight drops to your target price or below.
                </p>
              </div>
              <div className="flex flex-col justify-center items-center space-y-4 text-center p-4 rounded-lg hover:bg-card hover:shadow-lg transition-all">
                 <div className="bg-primary/10 p-4 rounded-full">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Book & Save</h3>
                <p className="text-muted-foreground">
                  Use our insights to book your flight at the perfect time and save money for your trip.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Sky Sentinel. All rights reserved.</p>
      </footer>
    </div>
  );
}
