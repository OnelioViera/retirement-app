'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { UserInputs, SocialSecurityData, AnnuityData, HousingData, CurrentHomeData, Calculations } from '@/types'

// Utility function to format numbers with commas and decimals
const formatCurrency = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '')
  
  // Handle multiple decimal points
  const parts = numericValue.split('.')
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('')
  }
  
  // If it's empty, return empty string
  if (numericValue === '' || numericValue === '.') {
    return ''
  }
  
  // Parse the number
  const num = parseFloat(numericValue)
  if (isNaN(num)) return ''
  
  // Format with commas and 2 decimal places
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}

// Utility function to get display value for inputs with zero placeholder
const getDisplayValue = (value: number, isFocused: boolean): string => {
  if (isFocused) {
    return value === 0 ? '' : value.toString()
  }
  return value === 0 ? '0' : value.toString()
}

// Utility function to parse formatted currency back to number
const parseCurrency = (formattedValue: string): number => {
  return parseFloat(formattedValue.replace(/,/g, '')) || 0
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DollarSign, Home, PiggyBank, TrendingUp, Plus, Trash2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'


export default function Dashboard() {
  const [socialSecurity, setSocialSecurity] = useState<SocialSecurityData>({
    currentMonthlyBenefit: 0,
    expectedRetirementAge: 67,
    expectedMonthlyBenefit: 0,
    spouseCurrentMonthlyBenefit: 0,
    spouseExpectedMonthlyBenefit: 0,
  })

  const [annuities, setAnnuities] = useState<AnnuityData[]>([
    { name: '', type: 'fixed', monthlyPayment: 0, initialInvestment: 0 }
  ])

  const [housing, setHousing] = useState<HousingData>({
    preferredLocation: '',
    maxMonthlyPayment: 0,
    downPayment: 0,
    interestRate: 7.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    insuranceRate: 0.5,
  })

  const [currentHome, setCurrentHome] = useState<CurrentHomeData>({
    currentValue: 0,
    mortgageBalance: 0,
    monthlyPayment: 0,
    interestRate: 0,
    location: '',
    yearsRemaining: 0,
    propertyTaxRate: 0,
    insuranceRate: 0,
  })

  const [calculations, setCalculations] = useState<Calculations>({
    totalMonthlyIncome: 0,
    affordableHousePrice: 0,
    monthlyHousingPayment: 0,
    remainingIncome: 0,
    currentHomeEquity: 0,
    currentHomePayment: 0,
    netHousingChange: 0,
  })

  // Track focused inputs for zero placeholder behavior
  const [focusedInputs, setFocusedInputs] = useState<Set<string>>(new Set())
  
  // Track saving status
  const [isSaving, setIsSaving] = useState(false)
  
  // Track if data has been loaded from database
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  // Helper functions for focus handling
  const handleFocus = (inputId: string) => {
    setFocusedInputs(prev => new Set(prev).add(inputId))
  }

  const handleBlur = (inputId: string) => {
    setFocusedInputs(prev => {
      const newSet = new Set(prev)
      newSet.delete(inputId)
      return newSet
    })
  }

  // Database persistence functions
  const saveDataToDatabase = async () => {
    try {
      console.log('💾 Saving data to database:', { socialSecurity, annuities, housing, currentHome })
      console.log('🌐 Making POST request to:', '/api/retirement-data')
      setIsSaving(true)
      
      const response = await fetch('/api/retirement-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          socialSecurity,
          annuities,
          housing,
          currentHome,
        }),
      })
      
      console.log('📡 Save response status:', response.status)
      console.log('📡 Save response ok:', response.ok)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('✅ Data saved successfully:', result)
    } catch (error) {
      console.error('❌ Error saving data:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const loadDataFromDatabase = async () => {
    try {
      console.log('🔄 Loading data from database...')
      console.log('🌐 Making request to:', '/api/retirement-data')
      const response = await fetch('/api/retirement-data')
      
      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📥 Loaded data from API:', data)
      
      if (data.socialSecurity) {
        console.log('✅ Setting social security data:', data.socialSecurity)
        setSocialSecurity(data.socialSecurity)
      }
      if (data.annuities) {
        console.log('✅ Setting annuities data:', data.annuities)
        console.log('📊 Annuities array length:', data.annuities.length)
        console.log('📊 First annuity:', data.annuities[0])
        setAnnuities(data.annuities)
      }
      if (data.housing) {
        console.log('✅ Setting housing data:', data.housing)
        console.log('🏠 Housing location:', data.housing.preferredLocation)
        console.log('🏠 Housing down payment:', data.housing.downPayment)
        console.log('🏠 Housing interest rate:', data.housing.interestRate)
        setHousing(data.housing)
      }
      if (data.currentHome) {
        console.log('✅ Setting current home data:', data.currentHome)
        console.log('🏡 Current home value:', data.currentHome.currentValue)
        console.log('🏡 Current mortgage balance:', data.currentHome.mortgageBalance)
        console.log('🏡 Current monthly payment:', data.currentHome.monthlyPayment)
        setCurrentHome(data.currentHome)
      }
      
      // Mark data as loaded to enable saving
      setIsDataLoaded(true)
      console.log('✅ Data loading complete - isDataLoaded set to true')
    } catch (error) {
      console.error('❌ Error loading data:', error)
      // Still mark as loaded to prevent infinite loading state
      setIsDataLoaded(true)
    }
  }

  const calculateRetirementPlan = () => {
    // Calculate total monthly income
    const totalSS = socialSecurity.expectedMonthlyBenefit + socialSecurity.spouseExpectedMonthlyBenefit
    const totalAnnuities = annuities.reduce((sum, annuity) => sum + annuity.monthlyPayment, 0)
    const totalMonthlyIncome = totalSS + totalAnnuities

    // Calculate affordable house price (simplified)
    const maxMonthlyPayment = totalMonthlyIncome * 0.28 // 28% rule
    const monthlyRate = housing.interestRate / 100 / 12
    const numPayments = housing.loanTerm * 12
    
    const loanAmount = maxMonthlyPayment * 
      (Math.pow(1 + monthlyRate, numPayments) - 1) / 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments))
    
    const affordableHousePrice = loanAmount + housing.downPayment

    // Calculate actual monthly payment for the affordable house
    const actualLoanAmount = affordableHousePrice - housing.downPayment
    const principalAndInterest = actualLoanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    
    const monthlyTax = affordableHousePrice * housing.propertyTaxRate / 100 / 12
    const monthlyInsurance = affordableHousePrice * housing.insuranceRate / 100 / 12
    const monthlyHousingPayment = principalAndInterest + monthlyTax + monthlyInsurance

    const remainingIncome = totalMonthlyIncome - monthlyHousingPayment

    // Calculate current home equity and payment
    const currentHomeEquity = currentHome.currentValue - currentHome.mortgageBalance
    const currentHomePayment = currentHome.monthlyPayment
    const netHousingChange = monthlyHousingPayment - currentHomePayment

    setCalculations({
      totalMonthlyIncome,
      affordableHousePrice,
      monthlyHousingPayment,
      remainingIncome,
      currentHomeEquity,
      currentHomePayment,
      netHousingChange,
    })
  }

  // Load data from database on component mount
  useEffect(() => {
    console.log('🚀 Component mounted - starting data load')
    loadDataFromDatabase()
  }, [])

  // Calculate retirement plan when data changes
  useEffect(() => {
    console.log('🧮 Calculating retirement plan with data:', { socialSecurity, annuities, housing, currentHome })
    calculateRetirementPlan()
  }, [socialSecurity, annuities, housing, currentHome])

  // Save data to database when any data changes (with debouncing)
  // Only save if data has been loaded from database first
  useEffect(() => {
    console.log('💾 Save effect triggered - isDataLoaded:', isDataLoaded, 'data:', { socialSecurity, annuities, housing, currentHome })
    
    if (!isDataLoaded) {
      console.log('⏳ Skipping save - data not loaded yet')
      return // Don't save until data is loaded
    }
    
    const timeoutId = setTimeout(() => {
      console.log('⏰ Save timeout triggered - calling saveDataToDatabase')
      saveDataToDatabase()
    }, 1000) // Save 1 second after last change

    return () => {
      console.log('🧹 Clearing save timeout')
      clearTimeout(timeoutId)
    }
  }, [socialSecurity, annuities, housing, currentHome, isDataLoaded])

  const incomeData = [
    { name: 'Social Security', value: socialSecurity.expectedMonthlyBenefit + socialSecurity.spouseExpectedMonthlyBenefit, color: '#3B82F6' },
    { name: 'Annuities', value: annuities.reduce((sum, annuity) => sum + annuity.monthlyPayment, 0), color: '#10B981' },
  ]

  const housingData = [
    { name: 'Principle & Interest', value: calculations.monthlyHousingPayment * 0.8 },
    { name: 'Property Tax', value: calculations.monthlyHousingPayment * 0.12 },
    { name: 'Insurance', value: calculations.monthlyHousingPayment * 0.08 },
  ]

  const addAnnuity = () => {
    setAnnuities([...annuities, { name: '', type: 'fixed', monthlyPayment: 0, initialInvestment: 0 }])
  }

  const removeAnnuity = (index: number) => {
    if (annuities.length > 1) {
      setAnnuities(annuities.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="space-y-8">
      {/* Status Indicators */}
      {!isDataLoaded && (
        <div className="fixed top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium z-50">
          📥 Loading data...
        </div>
      )}
      {isSaving && (
        <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium z-50">
          💾 Saving data...
        </div>
      )}
      
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculations.totalMonthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Social Security + Annuities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affordable House Price</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculations.affordableHousePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Based on 28% rule
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Housing Payment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculations.monthlyHousingPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              P&I + Taxes + Insurance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Income</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculations.remainingIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              After housing costs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Home Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Home Equity</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculations.currentHomeEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Value - Mortgage Balance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Monthly Payment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculations.currentHomePayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Current housing cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Housing Change</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${calculations.netHousingChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              ${Math.abs(calculations.netHousingChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {calculations.netHousingChange >= 0 ? ' more' : ' less'}
            </div>
            <p className="text-xs text-muted-foreground">
              vs. current payment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
            <CardDescription>Monthly retirement income breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Housing Payment Breakdown</CardTitle>
            <CardDescription>Monthly housing cost distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={housingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Input Forms */}
      <Tabs defaultValue="social-security" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="social-security">Social Security</TabsTrigger>
          <TabsTrigger value="annuities">Annuities</TabsTrigger>
          <TabsTrigger value="current-home">Current Home</TabsTrigger>
          <TabsTrigger value="housing">Future Housing</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="social-security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Security Information</CardTitle>
              <CardDescription>
                Enter your current and expected Social Security benefits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-benefit">Your Current Monthly Benefit</Label>
                  <Input
                    id="current-benefit"
                    type="text"
                    placeholder="0"
                    value={focusedInputs.has('current-benefit') ? 
                      (socialSecurity.currentMonthlyBenefit === 0 ? '' : formatCurrency(socialSecurity.currentMonthlyBenefit.toString())) :
                      (socialSecurity.currentMonthlyBenefit === 0 ? '0' : formatCurrency(socialSecurity.currentMonthlyBenefit.toString()))
                    }
                    onChange={(e) => {
                      const formattedValue = formatCurrency(e.target.value)
                      const numericValue = parseCurrency(formattedValue)
                      setSocialSecurity(prev => ({
                        ...prev,
                        currentMonthlyBenefit: Math.round(numericValue * 100) / 100
                      }))
                    }}
                    onFocus={() => handleFocus('current-benefit')}
                    onBlur={() => handleBlur('current-benefit')}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected-benefit">Your Expected Monthly Benefit</Label>
                  <Input
                    id="expected-benefit"
                    type="text"
                    placeholder="0"
                    value={focusedInputs.has('expected-benefit') ? 
                      (socialSecurity.expectedMonthlyBenefit === 0 ? '' : formatCurrency(socialSecurity.expectedMonthlyBenefit.toString())) :
                      (socialSecurity.expectedMonthlyBenefit === 0 ? '0' : formatCurrency(socialSecurity.expectedMonthlyBenefit.toString()))
                    }
                    onChange={(e) => {
                      const formattedValue = formatCurrency(e.target.value)
                      const numericValue = parseCurrency(formattedValue)
                      setSocialSecurity(prev => ({
                        ...prev,
                        expectedMonthlyBenefit: Math.round(numericValue * 100) / 100
                      }))
                    }}
                    onFocus={() => handleFocus('expected-benefit')}
                    onBlur={() => handleBlur('expected-benefit')}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spouse-current">Spouse Current Monthly Benefit</Label>
                  <Input
                    id="spouse-current"
                    type="text"
                    placeholder="0"
                    value={focusedInputs.has('spouse-current') ? 
                      (socialSecurity.spouseCurrentMonthlyBenefit === 0 ? '' : formatCurrency(socialSecurity.spouseCurrentMonthlyBenefit.toString())) :
                      (socialSecurity.spouseCurrentMonthlyBenefit === 0 ? '0' : formatCurrency(socialSecurity.spouseCurrentMonthlyBenefit.toString()))
                    }
                    onChange={(e) => {
                      const formattedValue = formatCurrency(e.target.value)
                      const numericValue = parseCurrency(formattedValue)
                      setSocialSecurity(prev => ({
                        ...prev,
                        spouseCurrentMonthlyBenefit: Math.round(numericValue * 100) / 100
                      }))
                    }}
                    onFocus={() => handleFocus('spouse-current')}
                    onBlur={() => handleBlur('spouse-current')}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spouse-expected">Spouse Expected Monthly Benefit</Label>
                  <Input
                    id="spouse-expected"
                    type="text"
                    placeholder="0"
                    value={focusedInputs.has('spouse-expected') ? 
                      (socialSecurity.spouseExpectedMonthlyBenefit === 0 ? '' : formatCurrency(socialSecurity.spouseExpectedMonthlyBenefit.toString())) :
                      (socialSecurity.spouseExpectedMonthlyBenefit === 0 ? '0' : formatCurrency(socialSecurity.spouseExpectedMonthlyBenefit.toString()))
                    }
                    onChange={(e) => {
                      const formattedValue = formatCurrency(e.target.value)
                      const numericValue = parseCurrency(formattedValue)
                      setSocialSecurity(prev => ({
                        ...prev,
                        spouseExpectedMonthlyBenefit: Math.round(numericValue * 100) / 100
                      }))
                    }}
                    onFocus={() => handleFocus('spouse-expected')}
                    onBlur={() => handleBlur('spouse-expected')}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="annuities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Annuity Information</CardTitle>
              <CardDescription>
                Track your annuity payments and investments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {annuities.map((annuity, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor={`annuity-name-${index}`}>Annuity Name</Label>
                    <Input
                      id={`annuity-name-${index}`}
                      placeholder="0"
                      value={annuity.name}
                      onChange={(e) => {
                        const newAnnuities = [...annuities]
                        newAnnuities[index].name = e.target.value
                        setAnnuities(newAnnuities)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`annuity-type-${index}`}>Type</Label>
                    <select
                      id={`annuity-type-${index}`}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={annuity.type}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        const newAnnuities = [...annuities]
                        newAnnuities[index].type = e.target.value as 'fixed' | 'variable' | 'immediate' | 'deferred'
                        setAnnuities(newAnnuities)
                      }}
                    >
                      <option value="immediate">Immediate</option>
                      <option value="deferred">Deferred</option>
                      <option value="variable">Variable</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`annuity-payment-${index}`}>Monthly Payment</Label>
                    <Input
                      id={`annuity-payment-${index}`}
                      type="text"
                      placeholder="0"
                      value={focusedInputs.has(`annuity-payment-${index}`) ? 
                        (annuity.monthlyPayment === 0 ? '' : formatCurrency(annuity.monthlyPayment.toString())) :
                        (annuity.monthlyPayment === 0 ? '0' : formatCurrency(annuity.monthlyPayment.toString()))
                      }
                      onChange={(e) => {
                        const formattedValue = formatCurrency(e.target.value)
                        const numericValue = parseCurrency(formattedValue)
                        const newAnnuities = [...annuities]
                        newAnnuities[index].monthlyPayment = Math.round(numericValue * 100) / 100
                        setAnnuities(newAnnuities)
                      }}
                      onFocus={() => handleFocus(`annuity-payment-${index}`)}
                      onBlur={() => handleBlur(`annuity-payment-${index}`)}
                      onWheel={(e) => e.currentTarget.blur()}
                      style={{ MozAppearance: 'textfield' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`annuity-investment-${index}`}>Initial Investment</Label>
                    <Input
                      id={`annuity-investment-${index}`}
                      type="text"
                      placeholder="0"
                      value={focusedInputs.has(`annuity-investment-${index}`) ? 
                        (annuity.initialInvestment === 0 ? '' : formatCurrency(annuity.initialInvestment.toString())) :
                        (annuity.initialInvestment === 0 ? '0' : formatCurrency(annuity.initialInvestment.toString()))
                      }
                      onChange={(e) => {
                        const formattedValue = formatCurrency(e.target.value)
                        const numericValue = parseCurrency(formattedValue)
                        const newAnnuities = [...annuities]
                        newAnnuities[index].initialInvestment = Math.round(numericValue * 100) / 100
                        setAnnuities(newAnnuities)
                      }}
                      onFocus={() => handleFocus(`annuity-investment-${index}`)}
                      onBlur={() => handleBlur(`annuity-investment-${index}`)}
                      onWheel={(e) => e.currentTarget.blur()}
                      style={{ MozAppearance: 'textfield' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Actions</Label>
                    <div className="flex gap-2">
                      {annuities.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAnnuity(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                onClick={addAnnuity}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Annuity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current-home" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Home Information</CardTitle>
              <CardDescription>
                Enter details about your current home for retirement planning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-home-value">Current Home Value</Label>
                  <Input
                    id="current-home-value"
                    type="text"
                    placeholder="0"
                    value={focusedInputs.has('current-home-value') ? 
                      (currentHome.currentValue === 0 ? '' : formatCurrency(currentHome.currentValue.toString())) :
                      (currentHome.currentValue === 0 ? '0' : formatCurrency(currentHome.currentValue.toString()))
                    }
                    onChange={(e) => {
                      const formattedValue = formatCurrency(e.target.value)
                      const numericValue = parseCurrency(formattedValue)
                      setCurrentHome(prev => ({
                        ...prev,
                        currentValue: Math.round(numericValue * 100) / 100
                      }))
                    }}
                    onFocus={() => handleFocus('current-home-value')}
                    onBlur={() => handleBlur('current-home-value')}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mortgage-balance">Mortgage Balance</Label>
                  <Input
                    id="mortgage-balance"
                    type="text"
                    placeholder="0"
                    value={focusedInputs.has('mortgage-balance') ? 
                      (currentHome.mortgageBalance === 0 ? '' : formatCurrency(currentHome.mortgageBalance.toString())) :
                      (currentHome.mortgageBalance === 0 ? '0' : formatCurrency(currentHome.mortgageBalance.toString()))
                    }
                    onChange={(e) => {
                      const formattedValue = formatCurrency(e.target.value)
                      const numericValue = parseCurrency(formattedValue)
                      setCurrentHome(prev => ({
                        ...prev,
                        mortgageBalance: Math.round(numericValue * 100) / 100
                      }))
                    }}
                    onFocus={() => handleFocus('mortgage-balance')}
                    onBlur={() => handleBlur('mortgage-balance')}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-monthly-payment">Monthly Payment</Label>
                  <Input
                    id="current-monthly-payment"
                    type="text"
                    placeholder="0"
                    value={focusedInputs.has('current-monthly-payment') ? 
                      (currentHome.monthlyPayment === 0 ? '' : formatCurrency(currentHome.monthlyPayment.toString())) :
                      (currentHome.monthlyPayment === 0 ? '0' : formatCurrency(currentHome.monthlyPayment.toString()))
                    }
                    onChange={(e) => {
                      const formattedValue = formatCurrency(e.target.value)
                      const numericValue = parseCurrency(formattedValue)
                      setCurrentHome(prev => ({
                        ...prev,
                        monthlyPayment: Math.round(numericValue * 100) / 100
                      }))
                    }}
                    onFocus={() => handleFocus('current-monthly-payment')}
                    onBlur={() => handleBlur('current-monthly-payment')}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-interest-rate">Interest Rate (%)</Label>
                  <Input
                    id="current-interest-rate"
                    type="text"
                    placeholder="0"
                    value={currentHome.interestRate === 0 ? '' : currentHome.interestRate.toFixed(2)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '')
                      const numValue = parseFloat(value) || 0
                      setCurrentHome(prev => ({
                        ...prev,
                        interestRate: Math.round(numValue * 100) / 100
                      }))
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-location">Current Location</Label>
                  <Input
                    id="current-location"
                    value={currentHome.location}
                    onChange={(e) => setCurrentHome(prev => ({
                      ...prev,
                      location: e.target.value
                    }))}
                    placeholder="e.g., Austin, TX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years-remaining">Years Remaining</Label>
                  <Input
                    id="years-remaining"
                    type="text"
                    placeholder="0"
                    value={currentHome.yearsRemaining === 0 ? '' : currentHome.yearsRemaining.toFixed(0)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      const numValue = parseInt(value) || 0
                      setCurrentHome(prev => ({
                        ...prev,
                        yearsRemaining: numValue
                      }))
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-property-tax">Property Tax Rate (%)</Label>
                  <Input
                    id="current-property-tax"
                    type="text"
                    placeholder="0"
                    value={currentHome.propertyTaxRate === 0 ? '' : currentHome.propertyTaxRate.toFixed(2)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '')
                      const numValue = parseFloat(value) || 0
                      setCurrentHome(prev => ({
                        ...prev,
                        propertyTaxRate: Math.round(numValue * 100) / 100
                      }))
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-insurance">Insurance Rate (%)</Label>
                  <Input
                    id="current-insurance"
                    type="text"
                    placeholder="0"
                    value={currentHome.insuranceRate === 0 ? '' : currentHome.insuranceRate.toFixed(2)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '')
                      const numValue = parseFloat(value) || 0
                      setCurrentHome(prev => ({
                        ...prev,
                        insuranceRate: Math.round(numValue * 100) / 100
                      }))
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="housing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Housing Preferences</CardTitle>
              <CardDescription>
                Set your housing affordability parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Preferred Location</Label>
                  <Input
                    id="location"
                    value={housing.preferredLocation}
                    onChange={(e) => setHousing(prev => ({
                      ...prev,
                      preferredLocation: e.target.value
                    }))}
                    placeholder="e.g., Austin, TX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="down-payment">Down Payment</Label>
                  <Input
                    id="down-payment"
                    type="text"
                    placeholder="0"
                    value={housing.downPayment === 0 ? '' : formatCurrency(housing.downPayment.toString())}
                    onChange={(e) => {
                      const formattedValue = formatCurrency(e.target.value)
                      const numericValue = parseCurrency(formattedValue)
                      setHousing(prev => ({
                        ...prev,
                        downPayment: Math.round(numericValue * 100) / 100
                      }))
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                  <Input
                    id="interest-rate"
                    type="text"
                    placeholder="0"
                    value={housing.interestRate === 0 ? '' : housing.interestRate.toFixed(2)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '')
                      const numValue = parseFloat(value) || 0
                      setHousing(prev => ({
                        ...prev,
                        interestRate: Math.round(numValue * 100) / 100
                      }))
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loan-term">Loan Term (years)</Label>
                  <Input
                    id="loan-term"
                    type="text"
                    placeholder="0"
                    value={housing.loanTerm === 0 ? '' : housing.loanTerm.toFixed(0)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      const numValue = parseInt(value) || 0
                      setHousing(prev => ({
                        ...prev,
                        loanTerm: numValue
                      }))
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property-tax">Property Tax Rate (%)</Label>
                  <Input
                    id="property-tax"
                    type="text"
                    placeholder="0"
                    value={housing.propertyTaxRate === 0 ? '' : housing.propertyTaxRate.toFixed(2)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '')
                      const numValue = parseFloat(value) || 0
                      setHousing(prev => ({
                        ...prev,
                        propertyTaxRate: Math.round(numValue * 100) / 100
                      }))
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Rate (%)</Label>
                  <Input
                    id="insurance"
                    type="text"
                    placeholder="0"
                    value={housing.insuranceRate === 0 ? '' : housing.insuranceRate.toFixed(2)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '')
                      const numValue = parseFloat(value) || 0
                      setHousing(prev => ({
                        ...prev,
                        insuranceRate: Math.round(numValue * 100) / 100
                      }))
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Planning</CardTitle>
              <CardDescription>
                Compare different retirement scenarios and what-if analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-900 mb-2">Conservative Scenario</h4>
                  <p className="text-sm text-blue-700">
                    Based on 25% of income for housing (more conservative than the 28% rule)
                  </p>
                  <div className="mt-2 text-lg font-semibold text-blue-900">
                    Affordable House: ${(calculations.affordableHousePrice * 0.89).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-900 mb-2">Aggressive Scenario</h4>
                  <p className="text-sm text-green-700">
                    Based on 32% of income for housing (higher risk but more buying power)
                  </p>
                  <div className="mt-2 text-lg font-semibold text-green-900">
                    Affordable House: ${(calculations.affordableHousePrice * 1.14).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-yellow-50">
                  <h4 className="font-semibold text-yellow-900 mb-2">Current vs Expected Income</h4>
                  <p className="text-sm text-yellow-700">
                    Compare your current Social Security benefits with expected retirement benefits
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-yellow-600">Current Total SS</div>
                      <div className="font-semibold text-yellow-900">
                        ${(socialSecurity.currentMonthlyBenefit + socialSecurity.spouseCurrentMonthlyBenefit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-yellow-600">Expected Total SS</div>
                      <div className="font-semibold text-yellow-900">
                        ${(socialSecurity.expectedMonthlyBenefit + socialSecurity.spouseExpectedMonthlyBenefit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-purple-50">
                  <h4 className="font-semibold text-purple-900 mb-2">Current Home Equity Impact</h4>
                  <p className="text-sm text-purple-700">
                    How your current home equity could affect retirement housing decisions
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-purple-600">Available Equity</div>
                      <div className="font-semibold text-purple-900">
                        ${calculations.currentHomeEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-purple-600">Monthly Payment Change</div>
                      <div className={`font-semibold ${calculations.netHousingChange >= 0 ? 'text-red-900' : 'text-green-900'}`}>
                        ${Math.abs(calculations.netHousingChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {calculations.netHousingChange >= 0 ? ' more' : ' less'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-indigo-50">
                  <h4 className="font-semibold text-indigo-900 mb-2">Stay vs Move Analysis</h4>
                  <p className="text-sm text-indigo-700">
                    Financial comparison of staying in current home vs moving to retirement location
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-indigo-600">Stay Current Home</div>
                      <div className="font-semibold text-indigo-900">
                        ${calculations.currentHomePayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-indigo-600">Move to Retirement Location</div>
                      <div className="font-semibold text-indigo-900">
                        ${calculations.monthlyHousingPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
