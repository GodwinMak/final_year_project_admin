import axios from "axios";
import { faker } from "@faker-js/faker";

function createRandomUser() {
  return {
    first_name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.person.jobType(),
  };
}

const USERS = faker.helpers.multiple(createRandomUser, {
  count: 30,
});

const endpoint = "http://localhost:8080/api/users/register";

async function bulkCreateUsers() {
  try {
    const response = await axios.post(endpoint, USERS);
    console.log("Bulk create successful:", response.data);
  } catch (error) {
    console.error("Error during bulk create:", error.message);
  }
}

// Call the function to initiate the bulk create process
bulkCreateUsers();
