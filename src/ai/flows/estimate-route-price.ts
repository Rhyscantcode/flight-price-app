'use server';

/**
 * @fileOverview An AI agent for estimating the standard price of a flight route.
 *
 * - estimateRoutePrice - A function that estimates the price of a flight route.
 * - EstimateRoutePriceInput - The input type for the estimateRoutePrice function.
 * - EstimateRoutePriceOutput - The return type for the estimateRoutePrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateRoutePriceInputSchema = z.object({
  origin: z.string().describe('The origin airport code (e.g., SFO).'),
  destination: z.string().describe('The destination airport code (e.g., JFK).'),
  dates: z.string().describe('The approximate travel dates (e.g., "October 2024").'),
  standardPrice: z.number().describe('The maximum standard price for this route.'),
});
export type EstimateRoutePriceInput = z.infer<typeof EstimateRoutePriceInputSchema>;

const EstimateRoutePriceOutputSchema = z.object({
  estimatedPrice: z.number().describe('The estimated standard price for the flight route.'),
  reasoning: z.string().describe('The reasoning behind the estimated price.'),
});
export type EstimateRoutePriceOutput = z.infer<typeof EstimateRoutePriceOutputSchema>;

export async function estimateRoutePrice(input: EstimateRoutePriceInput): Promise<EstimateRoutePriceOutput> {
  return estimateRoutePriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateRoutePricePrompt',
  input: {schema: EstimateRoutePriceInputSchema},
  output: {schema: EstimateRoutePriceOutputSchema},
  prompt: `You are an expert travel agent specializing in estimating flight prices.

You will be provided with the origin and destination airport codes, the approximate travel dates, and the maximum standard price for this route.

Based on this information, estimate the standard price for the flight route and provide a brief reasoning for your estimate.

Origin: {{{origin}}}
Destination: {{{destination}}}
Dates: {{{dates}}}
Maximum Standard Price: {{{standardPrice}}}

Consider various factors such as seasonality, demand, and current market trends to provide the most accurate estimate.
`,
});

const estimateRoutePriceFlow = ai.defineFlow(
  {
    name: 'estimateRoutePriceFlow',
    inputSchema: EstimateRoutePriceInputSchema,
    outputSchema: EstimateRoutePriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
