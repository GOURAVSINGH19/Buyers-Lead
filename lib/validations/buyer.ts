import { z } from 'zod'

export const citySchema = z.enum(['CHANDIGARH', 'MOHALI', 'ZIRAKPUR', 'PANCHKULA', 'OTHER'])
export const propertyTypeSchema = z.enum(['APARTMENT', 'VILLA', 'PLOT', 'OFFICE', 'RETAIL'])
export const bhkSchema = z.enum(['STUDIO', 'ONE', 'TWO', 'THREE', 'FOUR'])
export const purposeSchema = z.enum(['BUY', 'RENT'])
export const timelineSchema = z.enum(['ZERO_TO_THREE_MONTHS', 'THREE_TO_SIX_MONTHS', 'MORE_THAN_SIX_MONTHS', 'EXPLORING'])
export const sourceSchema = z.enum(['WEBSITE', 'REFERRAL', 'WALK_IN', 'CALL', 'OTHER'])
export const statusSchema = z.enum(['NEW', 'QUALIFIED', 'CONTACTED', 'VISITED', 'NEGOTIATION', 'CONVERTED', 'DROPPED'])

export const buyerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80, 'Full name must be less than 80 characters'),
  email: z.string().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  city: citySchema,
  propertyType: propertyTypeSchema,
  bhk: bhkSchema,
  purpose: purposeSchema,
  budgetMin: z.number().int().positive(),
  budgetMax: z.number().int().positive(),
  timeline: timelineSchema,
  source: sourceSchema,
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional().or(z.literal('')),
  tags: z.array(z.string()).optional().default([]),
  status: statusSchema.optional().default('NEW')
}).refine((data) => {
  if (['APARTMENT', 'VILLA'].includes(data.propertyType) && !data.bhk) {
    return false
  }
  return true
}, {
  message: 'BHK is required for Apartment and Villa properties',
  path: ['bhk']
}).refine((data) => {
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false
  }
  return true
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax']
})

export const buyerUpdateSchema = buyerSchema.partial().extend({
  id: z.string(),
  updatedAt: z.date()
})


export type BuyerInput = z.infer<typeof buyerSchema>
export type BuyerUpdateInput = z.infer<typeof buyerUpdateSchema>

// Display mappings for UI
export const cityLabels: Record<string, string> = {
  CHANDIGARH: 'Chandigarh',
  MOHALI: 'Mohali',
  ZIRAKPUR: 'Zirakpur',
  PANCHKULA: 'Panchkula',
  OTHER: 'Other'
}

export const propertyTypeLabels: Record<string, string> = {
  APARTMENT: 'Apartment',
  VILLA: 'Villa',
  PLOT: 'Plot',
  OFFICE: 'Office',
  RETAIL: 'Retail'
}

export const bhkLabels: Record<string, string> = {
  STUDIO: 'Studio',
  ONE: '1 BHK',
  TWO: '2 BHK',
  THREE: '3 BHK',
  FOUR: '4 BHK'
}

export const purposeLabels: Record<string, string> = {
  BUY: 'Buy',
  RENT: 'Rent'
}

export const timelineLabels: Record<string, string> = {
  ZERO_TO_THREE_MONTHS: '0-3 months',
  THREE_TO_SIX_MONTHS: '3-6 months',
  MORE_THAN_SIX_MONTHS: '>6 months',
  EXPLORING: 'Exploring'
}

export const sourceLabels: Record<string, string> = {
  WEBSITE: 'Website',
  REFERRAL: 'Referral',
  WALK_IN: 'Walk-in',
  CALL: 'Call',
  OTHER: 'Other'
}

export const statusLabels: Record<string, string> = {
  NEW: 'New',
  QUALIFIED: 'Qualified',
  CONTACTED: 'Contacted',
  VISITED: 'Visited',
  NEGOTIATION: 'Negotiation',
  CONVERTED: 'Converted',
  DROPPED: 'Dropped'
}
