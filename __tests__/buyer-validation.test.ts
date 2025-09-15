import { buyerSchema, csvImportSchema } from '@/lib/validations/buyer'

describe('Buyer Validation', () => {
  describe('buyerSchema', () => {
    it('should validate a valid buyer', () => {
      const validBuyer = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        city: 'CHANDIGARH',
        propertyType: 'APARTMENT',
        bhk: 'TWO',
        purpose: 'BUY',
        budgetMin: 5000000,
        budgetMax: 10000000,
        timeline: 'ZERO_TO_THREE_MONTHS',
        source: 'WEBSITE',
        notes: 'Looking for a 2BHK apartment',
        tags: ['urgent', 'first-time-buyer']
      }

      const result = buyerSchema.safeParse(validBuyer)
      expect(result.success).toBe(true)
    })

    it('should require BHK for apartment and villa', () => {
      const buyerWithoutBHK = {
        fullName: 'John Doe',
        phone: '9876543210',
        city: 'CHANDIGARH',
        propertyType: 'APARTMENT',
        purpose: 'BUY',
        timeline: 'ZERO_TO_THREE_MONTHS',
        source: 'WEBSITE'
      }

      const result = buyerSchema.safeParse(buyerWithoutBHK)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('BHK is required for Apartment and Villa properties')
      }
    })

    it('should validate budget constraints', () => {
      const buyerWithInvalidBudget = {
        fullName: 'John Doe',
        phone: '9876543210',
        city: 'CHANDIGARH',
        propertyType: 'PLOT',
        purpose: 'BUY',
        budgetMin: 10000000,
        budgetMax: 5000000, // Less than min
        timeline: 'ZERO_TO_THREE_MONTHS',
        source: 'WEBSITE'
      }

      const result = buyerSchema.safeParse(buyerWithInvalidBudget)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Maximum budget must be greater than or equal to minimum budget')
      }
    })

    it('should validate phone number format', () => {
      const buyerWithInvalidPhone = {
        fullName: 'John Doe',
        phone: '12345', // Too short
        city: 'CHANDIGARH',
        propertyType: 'PLOT',
        purpose: 'BUY',
        timeline: 'ZERO_TO_THREE_MONTHS',
        source: 'WEBSITE'
      }

      const result = buyerSchema.safeParse(buyerWithInvalidPhone)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Phone must be 10-15 digits')
      }
    })

    it('should validate full name length', () => {
      const buyerWithShortName = {
        fullName: 'J', // Too short
        phone: '9876543210',
        city: 'CHANDIGARH',
        propertyType: 'PLOT',
        purpose: 'BUY',
        timeline: 'ZERO_TO_THREE_MONTHS',
        source: 'WEBSITE'
      }

      const result = buyerSchema.safeParse(buyerWithShortName)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Full name must be at least 2 characters')
      }
    })
  })

  describe('csvImportSchema', () => {
    it('should validate CSV row with string numbers', () => {
      const csvRow = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        city: 'CHANDIGARH',
        propertyType: 'APARTMENT',
        bhk: 'TWO',
        purpose: 'BUY',
        budgetMin: '5000000', // String number
        budgetMax: '10000000', // String number
        timeline: 'ZERO_TO_THREE_MONTHS',
        source: 'WEBSITE',
        notes: 'Looking for apartment',
        tags: 'urgent,first-time-buyer', // Comma-separated string
        status: 'NEW'
      }

      const result = csvImportSchema.safeParse(csvRow)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.budgetMin).toBe(5000000)
        expect(result.data.budgetMax).toBe(10000000)
        expect(result.data.tags).toEqual(['urgent', 'first-time-buyer'])
      }
    })

    it('should handle empty CSV values', () => {
      const csvRow = {
        fullName: 'John Doe',
        email: '',
        phone: '9876543210',
        city: 'CHANDIGARH',
        propertyType: 'PLOT',
        purpose: 'BUY',
        budgetMin: '',
        budgetMax: '',
        timeline: 'ZERO_TO_THREE_MONTHS',
        source: 'WEBSITE',
        notes: '',
        tags: '',
        status: 'NEW'
      }

      const result = csvImportSchema.safeParse(csvRow)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('')
        expect(result.data.budgetMin).toBeUndefined()
        expect(result.data.budgetMax).toBeUndefined()
        expect(result.data.tags).toEqual([])
      }
    })
  })
})
