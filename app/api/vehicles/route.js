import { NextResponse } from 'next/server';
import { checkAuth } from '../../../lib/auth-helper';
import { getVehiclesAsync, writeVehiclesAsync } from '../../../lib/db-helper';

export async function GET() {
  try {
    const vehicles = await getVehiclesAsync();
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
    const vehicles = await getVehiclesAsync();
    
    const newVehicle = {
      id: 'v' + Date.now(),
      make: body.make || '',
      model: body.model || '',
      year: parseInt(body.year) || new Date().getFullYear(),
      price: parseInt(body.price) || 0,
      mileage: parseInt(body.mileage) || 0,
      transmission: body.transmission || 'Automatic',
      fuel: body.fuel || 'Gasoline',
      engine: body.engine || '',
      color: body.color || '',
      interior: body.interior || '',
      vin: body.vin || '',
      stockNumber: body.stockNumber || '',
      mainImage: body.mainImage || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [body.mainImage || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'],
      features: Array.isArray(body.features) ? body.features : [],
      description: body.description || ''
    };
    
    vehicles.unshift(newVehicle); // Add to the top
    await writeVehiclesAsync(vehicles);
    
    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

