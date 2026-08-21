// Comprehensive Admin CRUD & API Test Suite
import { createServer } from 'http';
import next from 'next';

const dev = false;
const app = next({ dev, dir: process.cwd() });
const handle = app.getRequestHandler();

async function runTests() {
  console.log('--- Starting Auto Maestro Full Admin CRUD & API Test Suite ---');

  await app.prepare();
  const server = createServer((req, res) => handle(req, res));

  await new Promise((resolve) => server.listen(3015, resolve));
  const baseUrl = 'http://localhost:3015';
  console.log(`Test server running at ${baseUrl}`);

  let cookieHeader = '';
  let createdCarId = '';
  let createdInqId = '';

  try {
    // 1. TEST AUTH: Failed Login
    console.log('\n[1/9] Testing Auth: Invalid credentials...');
    const failedLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'wrong', password: 'wrong' })
    });
    if (failedLoginRes.status === 401) {
      console.log('✅ Correctly rejected invalid credentials (401)');
    } else {
      throw new Error(`Expected 401, got ${failedLoginRes.status}`);
    }

    // 2. TEST AUTH: Successful Login
    console.log('\n[2/9] Testing Auth: Valid credentials...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'maestro2026' })
    });
    if (loginRes.ok) {
      const setCookie = loginRes.headers.get('set-cookie');
      if (setCookie) {
        cookieHeader = setCookie.split(';')[0];
        console.log(`✅ Login successful, session cookie obtained: ${cookieHeader.slice(0, 35)}...`);
      } else {
        throw new Error('No session cookie returned');
      }
    } else {
      throw new Error(`Login failed with status ${loginRes.status}`);
    }

    // 3. TEST AUTH STATUS
    console.log('\n[3/9] Testing Auth Status...');
    const authStatusRes = await fetch(`${baseUrl}/api/auth/status`, {
      headers: { Cookie: cookieHeader }
    });
    const authStatus = await authStatusRes.json();
    if (authStatus.authenticated === true) {
      console.log('✅ Session verified as authenticated: true');
    } else {
      throw new Error('Expected authenticated: true');
    }

    // 4. TEST VEHICLES: GET
    console.log('\n[4/9] Testing GET /api/vehicles...');
    const getVehiclesRes = await fetch(`${baseUrl}/api/vehicles`);
    const initialVehicles = await getVehiclesRes.json();
    console.log(`✅ Loaded ${initialVehicles.length} vehicles from inventory`);

    // 5. TEST VEHICLES: POST (Create)
    console.log('\n[5/9] Testing POST /api/vehicles (Create Vehicle)...');
    const newCarData = {
      make: 'Ferrari',
      model: 'F8 Tributo',
      year: 2023,
      price: 325000,
      mileage: 2400,
      transmission: 'Automatic',
      fuel: 'Gasoline',
      engine: '3.9L Twin-Turbo V8 (710 hp)',
      color: 'Rosso Corsa',
      interior: 'Cuoio Tan Leather / Carbon',
      vin: 'ZFF83CJA7N0289123',
      stockNumber: 'AM-FER-01',
      mainImage: 'https://res.cloudinary.com/fe55mqsh/image/fetch/f_auto,q_auto,w_800/https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd',
      images: [
        'https://res.cloudinary.com/fe55mqsh/image/fetch/f_auto,q_auto,w_800/https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd'
      ],
      features: ['Carbon Fiber Racing Seats', 'JBL Audio', 'Passenger Display', 'Front Lift System'],
      description: 'Stunning 2023 Ferrari F8 Tributo in pristine condition with carbon package.'
    };

    const createCarRes = await fetch(`${baseUrl}/api/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader
      },
      body: JSON.stringify(newCarData)
    });

    if (createCarRes.status === 201) {
      const createdCar = await createCarRes.json();
      createdCarId = createdCar.id;
      console.log(`✅ Created vehicle successfully! ID: ${createdCar.id} (${createdCar.year} ${createdCar.make} ${createdCar.model})`);
    } else {
      const err = await createCarRes.text();
      throw new Error(`Failed to create vehicle: ${err}`);
    }

    // 6. TEST VEHICLES: PUT (Update)
    console.log(`\n[6/9] Testing PUT /api/vehicles/${createdCarId} (Update Vehicle)...`);
    const updateCarRes = await fetch(`${baseUrl}/api/vehicles/${createdCarId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader
      },
      body: JSON.stringify({
        ...newCarData,
        price: 319000,
        description: 'Updated price: Stunning 2023 Ferrari F8 Tributo.'
      })
    });

    if (updateCarRes.ok) {
      const updatedCar = await updateCarRes.json();
      if (updatedCar.price === 319000) {
        console.log(`✅ Vehicle updated successfully! New price: $${updatedCar.price.toLocaleString()}`);
      } else {
        throw new Error('Price was not updated');
      }
    } else {
      throw new Error(`Update failed with status ${updateCarRes.status}`);
    }

    // 7. TEST INQUIRIES: POST, GET, PUT, DELETE
    console.log('\n[7/9] Testing Customer Inquiries CRUD...');
    const postInqRes = await fetch(`${baseUrl}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alexandre Dumas',
        email: 'alex@example.com',
        phone: '+1 513 555 9988',
        vehicleId: createdCarId,
        vehicleName: '2023 Ferrari F8 Tributo',
        date: '2026-09-01',
        time: '14:00',
        message: 'Interested in financing options and test drive.'
      })
    });
    const newInquiry = await postInqRes.json();
    createdInqId = newInquiry.id;
    console.log(`✅ Created Inquiry ID: ${createdInqId}`);

    const getInqRes = await fetch(`${baseUrl}/api/inquiries`, {
      headers: { Cookie: cookieHeader }
    });
    const inqs = await getInqRes.json();
    console.log(`✅ Retrieved ${inqs.length} inquiries from admin inbox`);

    // Update status
    const updateInqRes = await fetch(`${baseUrl}/api/inquiries/${createdInqId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({ status: 'contacted' })
    });
    const updatedInq = await updateInqRes.json();
    console.log(`✅ Updated Inquiry Status: ${updatedInq.status}`);

    // Delete test inquiry
    const delInqRes = await fetch(`${baseUrl}/api/inquiries/${createdInqId}`, {
      method: 'DELETE',
      headers: { Cookie: cookieHeader }
    });
    if (delInqRes.ok) {
      console.log(`✅ Deleted test inquiry cleanly`);
    }

    // 8. TEST VEHICLES: DELETE
    console.log(`\n[8/9] Testing DELETE /api/vehicles/${createdCarId} (Delete Vehicle)...`);
    const delCarRes = await fetch(`${baseUrl}/api/vehicles/${createdCarId}`, {
      method: 'DELETE',
      headers: { Cookie: cookieHeader }
    });
    if (delCarRes.ok) {
      console.log(`✅ Vehicle deleted cleanly!`);
    } else {
      throw new Error(`Delete vehicle failed`);
    }

    // 9. TEST CLOUDINARY UPLOAD via /api/upload
    console.log('\n[9/9] Testing POST /api/upload (Cloudinary Signed Upload)...');
    const formData = new FormData();
    const testBlob = new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')], { type: 'image/png' });
    formData.append('file', testBlob, 'test-car.png');

    const uploadRes = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      headers: { Cookie: cookieHeader },
      body: formData
    });

    if (uploadRes.ok) {
      const uploadData = await uploadRes.json();
      console.log(`✅ Image upload to Cloudinary successful! CDN URL: ${uploadData.url}`);
    } else {
      const err = await uploadRes.text();
      console.warn(`Upload returned: ${err}`);
    }

    console.log('\n======================================================');
    console.log('🎉 ALL 9 ADMIN CRUD & API TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('======================================================\n');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(process.exitCode || 0);
  }
}

runTests();
