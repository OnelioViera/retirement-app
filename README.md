# Retirement Tracker

A comprehensive retirement planning application built with Next.js, shadcn/ui, and MongoDB Atlas. Track your Social Security benefits, annuities, and housing affordability to plan your retirement with confidence.

## Features

- **Social Security Tracking**: Input current and expected Social Security benefits for you and your spouse
- **Annuity Management**: Track multiple annuities with different types and payment schedules
- **Housing Affordability Calculator**: Calculate what size house you can afford based on retirement income
- **Interactive Dashboard**: Visual charts showing income sources and housing cost breakdowns
- **Scenario Planning**: Compare conservative vs aggressive housing scenarios
- **Real-time Calculations**: Automatically updates calculations as you input data

## Tech Stack

- **Next.js 14**: React framework with App Router
- **shadcn/ui**: Modern, accessible UI components
- **MongoDB Atlas**: Cloud database for data persistence
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **TypeScript**: Type-safe JavaScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd retirement-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with your MongoDB Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/retirement-app?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Social Security Tab
- Enter your current monthly Social Security benefit
- Input your expected monthly benefit at retirement
- Add spouse's current and expected benefits
- Benefits are automatically included in total income calculations

### Annuities Tab
- Add multiple annuities with different types (Immediate, Deferred, Variable, Fixed)
- Specify monthly payments and initial investments
- Track total annuity income contribution

### Housing Tab
- Set your preferred location
- Configure down payment amount
- Adjust interest rate, loan term, property tax, and insurance rates
- See real-time affordable house price calculations

### Scenarios Tab
- Compare conservative (25% income) vs aggressive (32% income) housing scenarios
- View current vs expected Social Security income comparison
- Analyze different retirement planning approaches

## Key Calculations

### Housing Affordability (28% Rule)
The app uses the standard 28% rule where housing costs should not exceed 28% of gross monthly income.

### Mortgage Calculation
Uses standard mortgage formula:
```
M = P * [r(1+r)^n] / [(1+r)^n - 1]
```
Where:
- M = Monthly payment
- P = Principal loan amount
- r = Monthly interest rate
- n = Number of payments

### Total Income
```
Total Income = Social Security Benefits + Annuity Payments
```

## Database Schema

The application uses MongoDB collections for:
- Users
- Social Security data
- Annuities
- Housing preferences
- Retirement plans

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
