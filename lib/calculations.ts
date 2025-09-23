import { SocialSecurity, Annuity, HousingPreference } from '@/types'

export function calculateTotalMonthlyIncome(
  socialSecurity: SocialSecurity,
  annuities: Annuity[]
): number {
  const ssIncome = socialSecurity.expectedMonthlyBenefit + 
    (socialSecurity.spouseExpectedMonthlyBenefit || 0)
  
  const annuityIncome = annuities.reduce(
    (total, annuity) => total + annuity.monthlyPayment, 
    0
  )
  
  return ssIncome + annuityIncome
}

export function calculateAffordableHousePrice(
  totalMonthlyIncome: number,
  preferences: HousingPreference
): number {
  // Use 28% rule for housing affordability
  const maxMonthlyPayment = totalMonthlyIncome * 0.28
  
  // Calculate monthly payment components
  const monthlyPrincipalAndInterest = maxMonthlyPayment - 
    (preferences.downPayment * preferences.propertyTaxRate / 12 / 100) -
    (preferences.downPayment * preferences.insuranceRate / 12 / 100)
  
  // Calculate loan amount using mortgage formula
  const monthlyRate = preferences.interestRate / 100 / 12
  const numPayments = preferences.loanTerm * 12
  
  const loanAmount = monthlyPrincipalAndInterest * 
    (Math.pow(1 + monthlyRate, numPayments) - 1) / 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments))
  
  return loanAmount + preferences.downPayment
}

export function calculateMonthlyHousingPayment(
  housePrice: number,
  preferences: HousingPreference
): number {
  const loanAmount = housePrice - preferences.downPayment
  const monthlyRate = preferences.interestRate / 100 / 12
  const numPayments = preferences.loanTerm * 12
  
  const principalAndInterest = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  
  const monthlyTax = housePrice * preferences.propertyTaxRate / 100 / 12
  const monthlyInsurance = housePrice * preferences.insuranceRate / 100 / 12
  
  return principalAndInterest + monthlyTax + monthlyInsurance
}
