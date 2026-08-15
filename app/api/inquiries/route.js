import { NextResponse } from 'next/server';
import { checkAuth } from '../../../lib/auth-helper';
import { readInquiries, writeInquiries } from '../../../lib/db-helper';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

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

    // Send instant email notification if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safePhone = escapeHtml(phone || 'N/A');
        const safeVehicleName = escapeHtml(vehicleName);
        const safeDate = escapeHtml(date);
        const safeTime = escapeHtml(time);
        const safeMessage = escapeHtml(message || 'Aucun message particulier.');

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Auto Maestro <onboarding@resend.dev>',
            to: [process.env.ADMIN_EMAIL || 'contact@automaestro.com'],
            subject: `🚘 Demande de contact : ${safeName} (${vehicleName !== 'N/A' ? safeVehicleName : 'Général'})`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #0f172a;">
                <div style="background-color: #1d61e7; padding: 20px; text-align: center; color: #ffffff;">
                  <h2 style="margin: 0; font-size: 20px;">AUTO MAESTRO LLC</h2>
                  <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Nouvelle demande d'information client</p>
                </div>
                <div style="padding: 24px; background-color: #ffffff;">
                  <p style="font-size: 16px;"><strong>Bonjour,</strong></p>
                  <p>Un prospect a rempli le formulaire de contact sur le site Auto Maestro :</p>

                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                      <td style="padding: 8px 12px; background: #f8fafc; font-weight: bold; width: 140px;">Nom complet :</td>
                      <td style="padding: 8px 12px; background: #f8fafc;">${safeName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 12px; font-weight: bold;">Email :</td>
                      <td style="padding: 8px 12px;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 12px; background: #f8fafc; font-weight: bold;">Téléphone :</td>
                      <td style="padding: 8px 12px; background: #f8fafc;">${safePhone}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 12px; font-weight: bold;">Véhicule :</td>
                      <td style="padding: 8px 12px; color: #1d61e7; font-weight: bold;">${safeVehicleName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 12px; background: #f8fafc; font-weight: bold;">Date & Heure :</td>
                      <td style="padding: 8px 12px; background: #f8fafc;">${safeDate} à ${safeTime}</td>
                    </tr>
                  </table>

                  <p style="font-weight: bold; margin-bottom: 8px;">Message du client :</p>
                  <div style="background-color: #f1f5f9; padding: 16px; border-left: 4px solid #1d61e7; border-radius: 4px; font-style: italic;">
                    "${safeMessage}"
                  </div>
                </div>
              </div>
            `
          })
        });
      } catch (emailErr) {
        console.error('Failed to send email notification:', emailErr);
      }
    }

    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    console.error('Error posting inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry.' }, { status: 500 });
  }
}
