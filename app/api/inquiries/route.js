import { NextResponse } from 'next/server';
import { checkAuth } from '../../../lib/auth-helper';
import { readInquiries, writeInquiries } from '../../../lib/db-helper';

// Fetch all inquiries (Admin view)
export async function GET() {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const inquiries = readInquiries();
  // Sort by date (newest first)
  inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json(inquiries);
}

// Create new inquiry (Lead capture)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, vehicleId, vehicleName, date, time, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required fields.' }, { status: 400 });
    }

    const inquiries = readInquiries();
    const newInquiry = {
      id: 'INQ-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name,
      email,
      phone: phone || 'N/A',
      vehicleId: vehicleId || 'General Inquiry',
      vehicleName: vehicleName || 'N/A',
      date: date || 'N/A',
      time: time || 'N/A',
      message: message || '',
      createdAt: new Date().toISOString(),
      status: 'new' // 'new', 'contacted', 'archived'
    };

    inquiries.push(newInquiry);
    writeInquiries(inquiries);

    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    console.error('Error posting inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry.' }, { status: 500 });
  }
}
