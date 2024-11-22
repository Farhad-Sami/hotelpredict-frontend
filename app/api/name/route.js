// import fs from "fs";
// import path from "path";

// // Load the JSON data once when the server starts
// const filePath = path.join(process.cwd(), "public", "hotel_names.json");
// const names = JSON.parse(fs.readFileSync(filePath, "utf8"));

// export async function GET(request) {
//   // Extract search query from the URL
//   const { searchParams } = new URL(request.url);
//   const search = searchParams.get("search") || "";

//   // Only filter if input is longer than 2 characters
//   const filtered =
//     search.length > 2
//       ? names.filter((nm) =>
//           nm.name.toLowerCase().includes(search.toLowerCase())
//         )
//       : [];

//   return new Response(JSON.stringify({ results: filtered }), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }


// import { Surreal } from "surrealdb";

// // Define a function to create a connection to SurrealDB
// async function getDb() {
//   const db = new Surreal();

//   try {
//     // Connect to the SurrealDB instance
//     await db.connect("https://receiving-hawk-pmid-universities.trycloudflare.com/rpc", {
//       auth: {
//         username: "root",
//         password: "Kp123@$@***",
//       },
//     });

//     // Select the namespace and database
//     await db.use({ namespace: "hotel_predict", database: "hotels" });

//     return db;
//   } catch (err) {
//     console.error("Failed to connect to SurrealDB:", err.message);
//     throw err;
//   }
// }
import { getDb } from "../../../components/db"

const db = await getDb();
export async function GET(request) {
  try {
    // Extract search query from the URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    let results = [];
    if (search.length > 2) {
      // Query SurrealDB to find matching rows
      const query = `
        SELECT * FROM names WHERE keyword CONTAINS $search;
      `;
      // console.log(query);
      results = (await db.query(query, { search }))[0];
      // console.log(results);
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching data from SurrealDB:", err.message);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  // finally {
  //   await db.close();
  // }
}
