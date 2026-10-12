async function runTest() {
  console.log("1. Creating a new user...");
  
  try {
    const createResponse = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Umair Ahmad",
        email: "umair@example.com",
        password: "testpassword123",
        role: "ADMIN"
      })
    });
    
    const newUser = await createResponse.json();
    console.log("✅ User Created:", newUser);

    console.log("\n2. Fetching all users from database...");
    const getResponse = await fetch("http://localhost:5000/api/users");
    const allUsers = await getResponse.json();
    
    console.log("✅ All Users in DB:", allUsers);
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

runTest();