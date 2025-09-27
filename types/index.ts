export interface User {
  _id?: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface SocialSecurity {
  _id?: string
  userId: string
  currentMonthlyBenefit: number
  expectedRetirementAge: number
  expectedMonthlyBenefit: number
  spouseCurrentMonthlyBenefit?: number
  spouseExpectedMonthlyBenefit?: number
  createdAt: Date
  updatedAt: Date
}

export interface Annuity {
  _id?: string
  userId: string
  name: string
  type: 'immediate' | 'deferred' | 'variable' | 'fixed'
  monthlyPayment: number
  startDate: Date
  endDate?: Date
  initialInvestment?: number
  createdAt: Date
  updatedAt: Date
}

export interface HousingPreference {
  _id?: string
  userId: string
  preferredLocation: string
  maxMonthlyPayment: number
  downPayment: number
  interestRate: number
  loanTerm: number
  propertyTaxRate: number
  insuranceRate: number
  createdAt: Date
  updatedAt: Date
}

export interface RetirementPlan {
  _id?: string
  userId: string
  totalMonthlyIncome: number
  affordableHousePrice: number
  monthlyHousingPayment: number
  remainingIncome: number
  lastCalculated: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserInputs {
  currentAge: number
  retirementAge: number
  currentSalary: number
  annualIncrease: number
  currentSavings: number
  monthlyContribution: number
  employerMatch: number
  expectedReturn: number
  inflationRate: number
  desiredRetirementIncome: number
}

export interface SocialSecurityData {
  currentMonthlyBenefit: number
  expectedRetirementAge: number
  expectedMonthlyBenefit: number
  spouseCurrentMonthlyBenefit: number
  spouseExpectedMonthlyBenefit: number
}

export interface AnnuityData {
  name: string
  type: 'fixed' | 'variable' | 'immediate' | 'deferred'
  monthlyPayment: number
  initialInvestment: number
}

export interface HousingData {
  preferredLocation: string
  maxMonthlyPayment: number
  downPayment: number
  interestRate: number
  loanTerm: number
  propertyTaxRate: number
  insuranceRate: number
}

export interface CurrentHomeData {
  currentValue: number
  mortgageBalance: number
  monthlyPayment: number
  interestRate: number
  location: string
  yearsRemaining: number
  propertyTaxRate: number
  insuranceRate: number
}

export interface Calculations {
  totalMonthlyIncome: number
  affordableHousePrice: number
  monthlyHousingPayment: number
  remainingIncome: number
  currentHomeEquity: number
  currentHomePayment: number
  netHousingChange: number
}
