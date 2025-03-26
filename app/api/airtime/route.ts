// File: app/api/airtime/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import mongoose, { Schema, model, models } from 'mongoose';

// Define a Mongoose schema and model for transactions
const transactionSchema = new Schema({
  phoneNumber: { type: String, required: true },
  network: { type: String, required: true },
  amount: { type: Number, required: true },
  apiResponse: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Prevent model overwrite in watch mode.
const Transaction = models.Transaction || model('Transaction', transactionSchema);

export async function GET(request: NextRequest) {
  try {
    // GET response.
    const sampleData = { message: 'Response from Airtime API' };
    return NextResponse.json(sampleData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, network, amount } = body;

    // Forward the data to the external Airtime API.
    const response = await fetch('https://iabconcept.com/api/airtimeapi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRTIME_API_KEY}`,
      },
      body: JSON.stringify({
        phone: phoneNumber,
        network,
        amount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Purchase failed' },
        { status: response.status }
      );
    }

    // Connect to MongoDB and store the transaction details.
    await dbConnect();
    await Transaction.create({
      phoneNumber,
      network,
      amount,
      apiResponse: data,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
