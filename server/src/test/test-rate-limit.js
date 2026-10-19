
const BASE_URL = "http://localhost:5000/api/v1/auth";

async function testRoute(
  route,
  total = 10,
  method = "GET",
  body = null
) {
  console.log(`\nTesting ${method} ${route}`);

  const results = {};

  for (let i = 1; i <= total; i++) {
    try {
      const response = await fetch(`${BASE_URL}${route}`, {
        method,
        headers: body
          ? { "Content-Type": "application/json" }
          : {},
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      results[response.status] =
        (results[response.status] || 0) + 1;

      console.log(`Request ${i}: HTTP ${response.status}`);
    } catch (error) {
      console.error("Request failed:", error.message);
      break;
    }
  }

  console.log("Summary:", results);
}

await testRoute("/login", 12, "POST", {
  email: "invalid-test@example.com",
  password: "WrongPassword123!",
});

await testRoute("/logout", 5, "POST");


// await testRoute("/register", 12, "POST");

// await testRoute("/public-key", 5, "POST");
// await testRoute("/login-devices", 5, "GET");
// await testRoute("/public-key/test-user-id", 5, "GET");

// await testRoute("/refresh", 40, "GET");
// await testRoute("/accesstoken", 110, "GET");

// await testRoute("/checkUsername/testuser", 10, "GET");

// await testRoute("/send-verification", 7, "POST");
// await testRoute("/verify-email", 12, "POST");
// await testRoute("/resend-verification", 7, "POST");
