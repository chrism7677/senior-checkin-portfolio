/*
 * Christopher Miller - Website for the Senior Check-In App 
 * app.test.js: start temporary in-memory MongoDB -> connect mongoose -> run tests -> destroy DB
 */


const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

jest.setTimeout(30000);

const app = require("../app");
const SeniorProfile = require("../models/SeniorProfile");
const CheckIn = require("../models/CheckIn");

let mongoServer;
let testUser;

//Mock external API calls to email validation service
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes("10minutemail.com")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          format: true,
          disposable: true,
          dns: true
        })
      });
    }

    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        format: true,
        disposable: false,
        dns: true
      })
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await SeniorProfile.init();
});

/*
Test Notes:
Some tests intentionally depend on records created by earlier tests.

Example: Create senior profile, then authenticate login

This project prioritizes demonstrating full-stack integration over isolated unit testing.

This necessitates omitting the afterEach cleanup to preserve test data across dependent tests.
afterEach(async () => {
  await SeniorProfile.deleteMany({});
  await CheckIn.deleteMany({});
});
*/

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});


// Test cases are not exhaustive, just general demonstartion.
test("GET / returns the home page", async () => {
  const res = await request(app).get("/");

  expect(res.statusCode).toBe(200);
  expect(res.text).toContain("Senior");
});


test("POST /signup creates a senior profile", async () => {
  const res = await request(app)
    .post("/signup")
    .type("form")
    .send({
      name: "Test Successful",
      email: "test@gmail.com",
      password: "testsuccessful",
      phone: "555-555-5555",
      careCircleName: "Successful Contact",
      careCircleEmail: "contact@example.com",
      delivery: "email"
    });

  expect(res.statusCode).toBe(201);

  const user = await SeniorProfile.findOne({ email: "test@gmail.com" });
  expect(user).not.toBeNull();
  expect(user.name).toBe("Test Successful");
  testUser = user; 
});


test("POST /signup with disposable email is rejected", async () => {
  const res = await request(app)
    .post("/signup")
    .type("form")
    .send({
      name: "Test Failed",
      email: "test@10minutemail.com",
      password: "test",
      phone: "555-555-5555",
      careCircleName: "Test Contact",
      careCircleEmail: "contact@example.com",
      delivery: "email"
    });

  expect(res.statusCode).toBe(400);

  const user = await SeniorProfile.findOne({ email: "test@10minutemail.com" });
  expect(user).toBeNull();// Store for later tests
});


// Depends on senior profile created in previous test
test("POST /login authenticates", async () => {
  const res = await request(app)
    .post("/login")
    .type("form")
    .send({
      email: "test@gmail.com",
      password: "testsuccessful",
      loginaction: "editprofile"
    });

  expect(res.statusCode).toBe(200);
  expect(res.text).toContain("Edit Profile");  
});


test("POST /login with wrong password fails", async () => {
  const res = await request(app)
    .post("/login")
    .type("form")
    .send({
      email: "test@gmail.com",
      password: "wrongpassword",
      loginaction: "editprofile"
    });

  expect(res.statusCode).toBe(401);
  expect(res.text).toContain("Invalid login attempt");
});


// Depends on senior profile created in previous test
test("POST /alternateCheckIn creates a check-in", async () => {
  const res = await request(app)
    .post("/alternateCheckIn")
    .type("form")
    .send({
      originalId: testUser._id.toString(),
      checkintype: "emergency",
      checkInInformation: "Test check-in notes"
    });

  expect(res.statusCode).toBe(200);
  const checkIn = await CheckIn.findOne({ seniorId: testUser._id });
  expect(checkIn).not.toBeNull();
  expect(checkIn.status).toBe("emergency");
  expect(checkIn.notes).toBe("Test check-in notes");
});


// Depends on senior profile created in previous test
test("GET /admin returns admin page", async () => {
  const res = await request(app).get("/admin");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Admin Page for the Senior Check-In App");
    expect(res.text).toContain("Successful Contact");
    expect(res.text).toContain("Test check-in notes");
});

