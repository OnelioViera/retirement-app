import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('retirement-app')
    
    // Get all retirement data
    const socialSecurity = await db.collection('socialSecurity').findOne({})
    const annuities = await db.collection('annuities').find({}).toArray()
    const housing = await db.collection('housing').findOne({})
    const currentHome = await db.collection('currentHome').findOne({})
    
    return NextResponse.json({
      socialSecurity: socialSecurity || {
        currentMonthlyBenefit: 0,
        expectedRetirementAge: 67,
        expectedMonthlyBenefit: 0,
        spouseCurrentMonthlyBenefit: 0,
        spouseExpectedMonthlyBenefit: 0,
      },
      annuities: annuities.length > 0 ? annuities : [
        { name: '', type: 'fixed', monthlyPayment: 0, initialInvestment: 0 }
      ],
      housing: housing || {
        preferredLocation: '',
        maxMonthlyPayment: 0,
        downPayment: 0,
        interestRate: 7.5,
        loanTerm: 30,
        propertyTaxRate: 1.2,
        insuranceRate: 0.5,
      },
      currentHome: currentHome || {
        currentValue: 0,
        mortgageBalance: 0,
        monthlyPayment: 0,
        interestRate: 0,
        location: '',
        yearsRemaining: 0,
        propertyTaxRate: 0,
        insuranceRate: 0,
      }
    })
  } catch (error) {
    console.error('Error fetching retirement data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('retirement-app')
    const data = await request.json()
    
    const { socialSecurity, annuities, housing, currentHome } = data
    
    // Save Social Security data
    if (socialSecurity) {
      await db.collection('socialSecurity').replaceOne(
        {},
        { ...socialSecurity, updatedAt: new Date() },
        { upsert: true }
      )
    }
    
    // Save Annuities data
    if (annuities) {
      // Clear existing annuities and insert new ones
      await db.collection('annuities').deleteMany({})
      if (annuities.length > 0) {
        await db.collection('annuities').insertMany(
          annuities.map((annuity: any) => ({
            ...annuity,
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        )
      }
    }
    
    // Save Housing data
    if (housing) {
      await db.collection('housing').replaceOne(
        {},
        { ...housing, updatedAt: new Date() },
        { upsert: true }
      )
    }
    
    // Save Current Home data
    if (currentHome) {
      await db.collection('currentHome').replaceOne(
        {},
        { ...currentHome, updatedAt: new Date() },
        { upsert: true }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving retirement data:', error)
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
