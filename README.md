# Buyer Lead Management System

A comprehensive buyer lead management application built with Next.js, TypeScript, Prisma, and PostgreSQL. This system allows you to capture, manage, and track buyer leads with advanced filtering, search, and import/export capabilities.

## Features

### Core Functionality
- ✅ **Lead Management**: Create, read, update, and delete buyer leads
- ✅ **Advanced Search & Filtering**: Search by name, phone, email with URL-synced filters
- ✅ **Real-time Pagination**: Server-side pagination with 10 leads per page
- ✅ **CSV Import/Export**: Bulk import (max 200 rows) with validation and filtered export
- ✅ **Lead History**: Track all changes with detailed audit trail
- ✅ **User Authentication**: Simple demo login system with session management

### Data Model
- **Buyers**: Complete lead information with validation
- **Buyer History**: Audit trail for all changes
- **Users**: Authentication and ownership management

### Validation & Safety
- ✅ **Zod Validation**: Client and server-side validation
- ✅ **Ownership Checks**: Users can only edit their own leads
- ✅ **Rate Limiting**: Prevents spam with configurable limits
- ✅ **Error Boundaries**: Graceful error handling
- ✅ **Input Sanitization**: XSS protection and data validation

### Technical Features
- ✅ **Server-Side Rendering**: Fast initial page loads
- ✅ **Real-time Updates**: Optimistic UI with rollback
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS
- ✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- ✅ **Type Safety**: Full TypeScript coverage

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with custom demo provider
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Testing**: Jest with React Testing Library
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd buyer-lead
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/buyer_lead_db?schema=public"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Login

The application includes a simple demo authentication system. You can log in with any email and name combination for testing purposes.

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── buyers/               # Buyer-related API endpoints
│   ├── buyers/                   # Buyer management pages
│   │   ├── [id]/                 # Individual buyer pages
│   │   ├── new/                  # Create new buyer
│   │   └── components/           # Buyer-specific components
│   └── auth/                     # Authentication pages
├── components/                   # Reusable UI components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility functions and configurations
│   ├── actions/                  # Server actions
│   ├── validations/              # Zod schemas
│   └── rate-limit.ts             # Rate limiting utilities
├── prisma/                       # Database schema and migrations
└── __tests__/                    # Test files
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Demo login
- `POST /api/auth/signout` - Sign out

### Buyers
- `GET /api/buyers/export` - Export filtered buyers as CSV
- `POST /api/buyers/import` - Import buyers from CSV

### Server Actions
- `getBuyers()` - Fetch buyers with filters and pagination
- `getBuyer(id)` - Fetch single buyer with history
- `createBuyer(data)` - Create new buyer
- `updateBuyer(id, data)` - Update existing buyer
- `deleteBuyer(id)` - Delete buyer

## Validation Rules

### Buyer Schema
- **Full Name**: 2-80 characters, required
- **Phone**: 10-15 digits, required
- **Email**: Valid email format, optional
- **City**: Enum (Chandigarh, Mohali, Zirakpur, Panchkula, Other)
- **Property Type**: Enum (Apartment, Villa, Plot, Office, Retail)
- **BHK**: Required for Apartment/Villa, optional for others
- **Budget**: Min ≤ Max when both provided
- **Timeline**: Enum (0-3m, 3-6m, >6m, Exploring)
- **Source**: Enum (Website, Referral, Walk-in, Call, Other)
- **Notes**: Max 1000 characters
- **Tags**: Array of strings

## CSV Import Format

Expected CSV headers:
```csv
fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status
```

### Import Rules
- Maximum 200 rows per import
- Validates each row individually
- Shows detailed error messages for failed rows
- Only imports valid rows in a transaction
- Creates history entries for imported leads

## Rate Limiting

- **Create Lead**: 10 requests per 15 minutes per user
- **Update Lead**: 20 requests per 15 minutes per user
- Uses in-memory storage (reset on server restart)

## Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage
- ✅ Buyer validation schemas
- ✅ CSV import validation
- ✅ Budget constraint validation
- ✅ Phone number format validation

## Deployment

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build and deploy the application


## Design Decisions

### Validation Architecture
- **Client-side**: React Hook Form with Zod resolver for immediate feedback
- **Server-side**: Zod validation in server actions and API routes
- **Database**: Prisma enums and constraints as final validation layer

### SSR vs Client-side
- **List Page**: Server-side rendering with URL-synced filters for SEO and performance
- **Forms**: Client-side with optimistic updates for better UX
- **Search**: Debounced client-side search with server-side filtering

### Ownership Enforcement
- All CRUD operations check `ownerId` against session user
- Server actions validate ownership before any modifications
- UI shows/hides edit options based on ownership

## What's Included vs Skipped

### ✅ Completed Features
- Complete CRUD operations for buyer leads
- Advanced search and filtering with URL sync
- CSV import/export with validation
- User authentication and ownership
- Lead history tracking
- Rate limiting
- Responsive design
- Unit tests for validation
- Error handling and accessibility

### 🔄 Nice-to-Have Features (Not Implemented)
- Tag chips with typeahead
- Status quick-actions in table
- Full-text search on notes
- File upload for attachments
- Advanced analytics dashboard
- Email notifications
- Bulk operations (delete, update status)

### 🎯 Future Enhancements
- Real-time notifications
- Advanced reporting
- Integration with CRM systems
- Mobile app
- Advanced user roles and permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.
#   B u y e r s - L e a d  
 