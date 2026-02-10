// Test script to verify authentication is working

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  const baseUrl = 'http://localhost:3000';
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!',
  };

  try {
    // Test 1: Signup
    console.log('📝 Test 1: Signup new user');
    const signupRes = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    if (signupRes.ok) {
      console.log('✅ Signup successful');
      const signupData = await signupRes.json();
      console.log('   User:', signupData.user);
    } else {
      console.log('❌ Signup failed');
      console.log('   Error:', await signupRes.text());
      return;
    }

    // Test 2: Login with correct credentials
    console.log('\n🔐 Test 2: Login with correct credentials');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
      credentials: 'include',
    });

    let sessionCookie;
    if (loginRes.ok) {
      console.log('✅ Login successful');
      const loginData = await loginRes.json();
      console.log('   User:', loginData.user);
      
      // Extract session cookie
      const setCookie = loginRes.headers.get('set-cookie');
      if (setCookie) {
        sessionCookie = setCookie.split(';')[0];
        console.log('   Session cookie set');
      }
    } else {
      console.log('❌ Login failed');
      console.log('   Error:', await loginRes.text());
      return;
    }

    // Test 3: Login with wrong password
    console.log('\n🔐 Test 3: Login with wrong password');
    const wrongLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: 'WrongPassword',
      }),
    });

    if (!wrongLoginRes.ok) {
      console.log('✅ Wrong password correctly rejected');
    } else {
      console.log('❌ Wrong password should have been rejected');
    }

    // Test 4: Logout
    console.log('\n🚪 Test 4: Logout');
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Cookie': sessionCookie || '',
      },
    });

    if (logoutRes.ok) {
      console.log('✅ Logout successful');
    } else {
      console.log('❌ Logout failed');
    }

    console.log('\n✨ All tests completed!\n');
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run tests
testAuth();
