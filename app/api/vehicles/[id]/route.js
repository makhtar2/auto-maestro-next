import { NextResponse } from 'next/server';
import { checkAuth } from '../../../../lib/auth-helper';
import { getVehiclesAsync, writeVehiclesAsync } from '../../../../lib/db-helper';

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const vehicles = await getVehiclesAsync();
    const vehicle = vehicles.find(v => v.id === id);
    
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('API GET ID Error:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const id = params.id;
    const body = await request.json();
    const vehicles = await getVehiclesAsync();
    const index = vehicles.findIndex(v => v.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    vehicles[index] = {
      ...vehicles[index],
      make: body.make || vehicles[index].make,
      model: body.model || vehicles[index].model,
      year: parseInt(body.year) || vehicles[index].year,
      price: parseInt(body.price) || vehicles[index].price,
      mileage: parseInt(body.mileage) || vehicles[index].mileage,
      transmission: body.transmission || vehicles[index].transmission,
      fuel: body.fuel || vehicles[index].fuel,
      engine: body.engine || vehicles[index].engine,
      color: body.color || vehicles[index].color,
      interior: body.interior || vehicles[index].interior,
      vin: body.vin !== undefined ? body.vin : (vehicles[index].vin || ''),
      stockNumber: body.stockNumber !== undefined ? body.stockNumber : (vehicles[index].stockNumber || ''),
      mainImage: body.mainImage || vehicles[index].mainImage,
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : (vehicles[index].images || [body.mainImage || vehicles[index].mainImage]),
      features: Array.isArray(body.features) ? body.features : vehicles[index].features,
      description: body.description || vehicles[index].description,
      id // Keep original ID
    };
    
    await writeVehiclesAsync(vehicles);
    
    return NextResponse.json(vehicles[index]);
  } catch (error) {
    console.error('API PUT ID Error:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!checkAuth()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const id = params.id;
    let vehicles = await getVehiclesAsync();
    
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    vehicles = vehicles.filter(v => v.id !== id);
    await writeVehiclesAsync(vehicles);
    
    return NextResponse.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('API DELETE ID Error:', error);
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}

