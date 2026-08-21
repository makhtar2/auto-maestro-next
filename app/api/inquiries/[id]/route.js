import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth-helper';
import { getInquiriesAsync, writeInquiriesAsync } from '../../../../lib/db-helper';

// Update Inquiry Status (PUT)
export async function PUT(request, { params }) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { status } = body; // 'new', 'contacted', 'archived'

    const inquiries = await getInquiriesAsync();
    const idx = inquiries.findIndex(q => q.id === params.id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    inquiries[idx].status = status || inquiries[idx].status;
    await writeInquiriesAsync(inquiries);

    return NextResponse.json(inquiries[idx]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inquiry.' }, { status: 500 });
  }
}

// Delete Inquiry (DELETE)
export async function DELETE(request, { params }) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const inquiries = await getInquiriesAsync();
    const filtered = inquiries.filter(q => q.id !== params.id);

    if (inquiries.length === filtered.length) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    await writeInquiriesAsync(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete inquiry.' }, { status: 500 });
  }
}

