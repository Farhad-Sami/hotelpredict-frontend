import { Surreal } from "surrealdb";

// Define a function to create a connection to SurrealDB
export async function getDb() {
  const db = new Surreal();

  try {
    // Connect to the SurrealDB instance
    await db.connect("https://receiving-hawk-pmid-universities.trycloudflare.com/rpc", {
      auth: {
        username: "root",
        password: "Kp123@$@***",
      },
    });

    // Select the namespace and database
    await db.use({ namespace: "hotel_predict", database: "hotels" });

    return db;
  } catch (err) {
    console.error("Failed to connect to SurrealDB:", err.message);
    throw err;
  }
}