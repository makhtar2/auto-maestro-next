import { NextResponse } from 'next/server';
import { checkAuth } from '../../../lib/auth-helper';
import { readVehicles, writeVehicles } from '../../../lib/db-helper';

export async function GET() {
  try {
    const vehicles = readVehicles();
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const vehicles = readVehicles();
    
    const newVehicle = {
      id: 'v' + Date.now(),
      make: body.make || '',
      model: body.model || '',
      year: parseInt(body.year) || new Date().getFullYear(),
      price: parseInt(body.price) || 0,
      mileage: parseInt(body.mileage) || 0,
      transmission: body.transmission || 'Automatique',
      fuel: body.fuel || 'Essence',
      engine: body.engine || '',
      color: body.color || '',
      interior: body.interior || '',
      mainImage: body.mainImage || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      images: Array.isArray(body.images) ? body.images : [body.mainImage || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'],
      features: Array.isArray(body.features) ? body.features : [],
      description: body.description || ''
    };
    
    vehicles.unshift(newVehicle); // Add to the top
    writeVehicles(vehicles);
    
    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
