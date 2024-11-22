function extractAllHotelDetails(data) {
  const { checkInDate, checkOutDate } = separateDates(findFirstTravelDates(data));
  let hotelDetails = [];
  function recursiveSearch(jsonData) {
    if (!jsonData || typeof jsonData !== "object") return;

    // Check for categorizedListings and process its data
    if (
      jsonData.categorizedListings &&
      Array.isArray(jsonData.categorizedListings)
    ) {
      scraperoom(jsonData.categorizedListings).forEach((element) => {
        if (!hotelDetails.includes(element)) {
          hotelDetails.push(element);
        }
      });
    }

    // Continue recursively searching through nested objects in case categorizedListings are deeply nested
    for (let key in jsonData) {
      if (typeof jsonData[key] === "object") {
        recursiveSearch(jsonData[key]);
      }
    }
  }
  recursiveSearch(data);
  function scraperoom(data) {
    const output = [];

    data.forEach((d) => {
      const roomDetails = {};

      // Collect room heading
      roomDetails.heading = d.header.text;

      // Collect rating, review, availability, and prices
      roomDetails.rating = findNestedValue(d, "badge", "text") || "";
      roomDetails.review = findReview(d, "reviews") || "";
      if (roomDetails.review == "LodgingReviewSection") {
        roomDetails.review = "";
      }
      roomDetails.availability = findAvailability(d, "left") || 0;

      // Collect normal and total price
      let { normalPrice } = findPrices(d);
      roomDetails.normalPrice = normalPrice;

      roomDetails.hasNoExtras = checkForNoExtras(d, "No extras");
      roomDetails.checkInDate = checkInDate
      roomDetails.checkOutDate = checkOutDate
      output.push(roomDetails);
    });

    return output;
  }

  function findNestedValue(obj, key, subkey = null) {
    if (!obj || typeof obj !== "object") return null;

    if (obj[key]) {
      return subkey ? obj[key][subkey] : obj[key];
    }

    for (let k in obj) {
      if (obj.hasOwnProperty(k)) {
        const result = findNestedValue(obj[k], key, subkey);
        if (result) return result;
      }
    }
    return null;
  }

  function findReview(obj, keyword) {
    if (!obj || typeof obj !== "object") return null;

    for (let k in obj) {
      if (typeof obj[k] === "string" && obj[k].toLowerCase().includes(keyword)) {
        return obj[k];
      }
      if (typeof obj[k] === "object") {
        const result = findReview(obj[k], keyword);
        if (result) return result;
      }
    }
    return null;
  }

  function findAvailability(obj, keyword) {
    if (!obj || typeof obj !== "object") return null;

    for (let k in obj) {
      if (typeof obj[k] === "string" && obj[k].toLowerCase().includes(keyword)) {
        return obj[k];
      }
      if (typeof obj[k] === "object") {
        const result = findAvailability(obj[k], keyword);
        if (result) return result;
      }
    }
    return null;
  }

  function findPrices(obj) {
    let normalPrice = null;

    if (!obj || typeof obj !== "object") return { normalPrice };

    for (let k in obj) {
      // Check for strings with prices like "$123" or "USD 123"
      if (typeof obj[k] === "string" && obj[k].match(/\$\d+/)) {
        const priceValue = parseFloat(obj[k].replace(/[^\d.]/g, "")); // Extract numeric part and convert to float
        if (!normalPrice) {
          normalPrice = priceValue;
        }
      }

      // Check for structured price format (price.formatted or lineItems.value)
      if (obj[k] && typeof obj[k] === "object") {
        // Normal price in price.formatted
        if (obj[k].role === "LEAD" && obj[k].price && obj[k].price.formatted) {
          normalPrice = parseFloat(obj[k].price.formatted.replace(/[^\d.]/g, ""));
        }

        const result = findPrices(obj[k]);
        if (result.normalPrice && !normalPrice) normalPrice = result.normalPrice;
      }
    }

    return { normalPrice };
  }
  function checkForNoExtras(obj, keyword) {
    if (!obj || typeof obj !== "object") return false;

    for (let k in obj) {
      if (
        typeof obj[k] === "string" &&
        obj[k].toLowerCase() === keyword.toLowerCase()
      ) {
        return true;
      }
      if (typeof obj[k] === "object") {
        const result = checkForNoExtras(obj[k], keyword);
        if (result) return result;
      }
    }
    return false;
  }
  function findFirstTravelDates(obj) {
    if (typeof obj !== 'object' || obj === null) return null;

    // Check if the current level has `travel_dates`
    if (obj.hasOwnProperty('travel_dates')) {
      return obj.travel_dates;
    }

    // Recursively check each nested property
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const result = findFirstTravelDates(obj[key]);
        if (result !== null) {
          return result; // Stop at the first found occurrence
        }
      }
    }

    return null; // Return null if no `travel_dates` key was found
  }

  function separateDates(datesString) {
    let [checkInDate, checkOutDate] = datesString.split('|');
    return { checkInDate, checkOutDate };
  }
  return hotelDetails;
}
const axios = require('axios');

const makeRequest = async (pp, ss, ee, rr) => {
  const payload = [
    {
      "operationName": "RoomsAndRatesPropertyOffersQuery",
      "variables": {
        "propertyId": pp,
        "searchCriteria": {
          "primary": {
            "dateRange": {
              "checkInDate": ss,
              "checkOutDate": ee
            },
            "destination": {
              "regionId": rr
            },
            "rooms": [
              {
                "adults": 2,
                "children": []
              }
            ]
          }
        },
        "context": {
          "siteId": 300000034,
          "locale": "en_AS",
          "currency": "USD",
          "device": {
            "type": "DESKTOP"
          }
        }
      },
      "extensions": {
        "persistedQuery": {
          "version": 1,
          "sha256Hash": "493f03dbb61efa420c0871958ec67b1e93b0df776746ee207b00c3800d645e67"
        }
      }
    }
  ];
  const session = axios.create({
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'client-info': 'shopping-pwa,3c52dc6698397d772624395beca3453450c5c096,us-west-2',
      'content-type': 'application/json',
      origin: 'https://www.hotels.com',
    }
  });

  try {
    const response = await session.post("https://www.hotels.com/graphql", payload);
    return extractAllHotelDetails(response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
function getDateWithAddedDays(daysToAdd = 0) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + daysToAdd);

  return {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1, // Months are zero-indexed
    year: currentDate.getFullYear(),
  };
}

import { getDb } from "../../../components/db"
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

const db = await getDb();
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    let results = [];
    if (search.length > 2) {
      const query = `
        SELECT * FROM details WHERE location CONTAINS $search;
      `;
      console.log(search);
      results = (await db.query(query, { search }))[0];
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        if (i < 5) {
          const prp = element.property_id;
          const regionId = new URL(element.url).searchParams.get('regionId') || '3073';
          const req = await makeRequest(prp, getDateWithAddedDays(), getDateWithAddedDays(1), regionId)
          element.prices = req

          const total_room = element.total_room;
          let tempavail;
          if (total_room < 100) {
            tempavail = 10;
          } else {
            tempavail = Math.ceil(total_room * 0.1); // 10% of total_room
          }

          let temp = 0
          let totalrates = 0
          let allavailability = 0
          for (let ii = 0; ii < req.length; ii++) {
            const ele = await req[ii];
            if (temp < ele.normalPrice) {
              temp = ele.normalPrice
            }
            totalrates = totalrates + ele.normalPrice
            const eleav = ele.availability
            let av;
            try {
              av = parseInt(eleav.match(/\d+/)) || 0
            } catch (error) {
              av = eleav
            }
            if (av == 0) {
              av = tempavail
            }
            allavailability = allavailability + av
          }


          const occupancyPercentage = ((total_room - allavailability) / total_room) * 100;
          element.occupancy = occupancyPercentage.toFixed(2);
          element.adr = (totalrates / total_room).toFixed(2);
          element.rev = (element.adr * (element.occupancy / 100)).toFixed(2)

          element.price = temp
        }
      }
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


// {
//   heading: 'Room, 2 Queen Beds, City View',
//   rating: '8.8',
//   review: '51 reviews',
//   availability: 'We have 1 left',
//   normalPrice: 326,
//   hasNoExtras: true,
//   checkInDate: '2024-11-22',
//   checkOutDate: '2024-11-23'
// }