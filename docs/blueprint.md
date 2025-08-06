# **App Name**: Skyscanner Sentinel

## Core Features:

- User Authentication: Enable users to sign up and log in using email and password via Firebase Authentication.
- Flight Alert Form: Allow users to submit flight alert requests including origin, destination, dates and target price.
- Alert Storage: Save user flight alerts in Firestore, organized under their respective User IDs.
- Alert Dashboard: Present users with a dashboard displaying their saved flight alerts with options to edit or delete alerts.
- AI Price Estimation: Use a Genkit-powered tool to provide a standard price estimation for the specified route, and display this within the user interface, offering guidance to users when setting up an alert. The standard price informs the LLM of the maximum typical value that can be found.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to evoke trust and security in travel planning.
- Background color: Very light blue (#F0F2FA), a desaturated variant of the primary, to create a calming backdrop.
- Accent color: Yellow-orange (#FFAB40), analogous to blue and adding vibrancy for calls to action.
- Headline font: 'Poppins', sans-serif, for headlines and titles, to project a contemporary and fashionable style.
- Body font: 'PT Sans', sans-serif, for body text to ensure readability and a bit of warmth.
- Consistent use of simple, outlined icons from a set like Feather or Lucide to represent destinations, dates, and price ranges, ensuring easy comprehension.
- Subtle transition animations for loading states and form submissions, enhancing the user experience and providing feedback during interactions.