const axios = require('axios');

async function fetchData(search, keyword, page) {
  try {
    // Prepare the URL with query parameters
    const url = `https://sofa-essay-niger-prison.trycloudflare.com/?search=${search}&column=${keyword}&page=${page}`;
    // const url = `http://localhost:8000/?search=${search}&column=${keyword}&page=${page}`;

    // Send a GET request
    const response = await axios.get(url);
    // Log and return the response data
    // console.log("Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error; // Optionally rethrow the error if needed
  }
}
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const keyword = searchParams.get("keyword") || "";
    const page = searchParams.get("page") || 0;
    let results = [];
    if (search.length > 2) {
      results = await fetchData(search, keyword, page)
    }
    // Process results in batches of 5
    for (let i = 0; i < results.length; i += 5) {
      const batchPromises = [];
      const batchSize = Math.min(5, results.length - i);

      // Create promises for current batch
      for (let j = 0; j < batchSize; j++) {
        const hotel = results[i + j];
        batchPromises.push((async () => {
          let resultss = [];
          let days = 1;

          const checkin = getDateWithAddedDays(0);
          const checkout = getDateWithAddedDays(1);

          const promise = await makeRequest(
            hotel.hotel_id,
            hotel.property_id,
            hotel.regional_id,
            checkin,
            checkout
          ).catch(error => {
            console.error('Error in batch request:', error);
            return []; // Return empty array on error
          });

          const total_room = hotel.total_room;
          let tempavail = total_room < 100 ? 10 : Math.ceil(total_room * 0.1);

          let temp = 0;
          let totalrates = 0;
          let allavailability = 0;
          for (let ii = 0; ii < promise.length; ii++) {
            let pricenow = 0;
            const ele = promise[ii];
            // Check if rates array exists and has elements
            if (ele.rates?.length > 0 && isNaN(ele.rates[0].currentPrice)) {
              if (temp == 0) {
                temp = ele.rates[0].totalPrice;
                pricenow = temp;
              } else if (ele.rates[0].totalPrice < temp) {
                temp = ele.rates[0].totalPrice;
                pricenow = temp;
              }
              totalrates += ele.rates[0].totalPrice;
            } else if (ele.rates?.length > 0 && ele.rates[0].currentPrice) {
              if (ele.rates[0].currentPrice > 0) {
                if (temp == 0) {
                  temp = ele.rates[0].currentPrice;
                  pricenow = temp;
                } else if (ele.rates[0].currentPrice < temp) {
                  temp = ele.rates[0].currentPrice;
                  pricenow = temp;
                }
                totalrates += ele.rates[0].currentPrice;
              }
            }

            const eleav = ele.maxAvailability;
            let av;
            try {
              av = parseInt(eleav.match(/\d+/)) || 0;
            } catch (error) {
              av = eleav;
            }
            if (av == 0 && ele.rates?.length > 0) {
              av = tempavail;
            }
            allavailability = allavailability + av;
          }

          const occupiedRooms = total_room - allavailability;
          const occupancyPercentage = total_room > 0 ? (occupiedRooms / total_room) * 100 : 0;

          hotel.price = temp == 0 ? "Sold Out" : `$${temp}`;
          hotel.occupancy = temp == 0 ? "-" : `${occupancyPercentage.toFixed(2)}%`;
          hotel.adr = temp == 0 ? "-" : `${(totalrates / occupiedRooms).toFixed(2)}`;
          hotel.revpar = temp == 0 ? "-" : `${(totalrates / total_room).toFixed(2)}`;
          hotel.rates = promise;

          return hotel;
        })());
      }

      // Wait for current batch to complete before moving to next batch
      await Promise.all(batchPromises);
    }
    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching data ", err.message);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


function scrape(hotel_id, checkin, checkout, data) {
  const allRates = [];
  for (const element of data[0].data.propertyOffers.categorizedListings) {

    const header = element?.header?.text || '';
    const rating = element?.lodgingReview?.rating?.badge?.text || '';

    let reviews = '';
    try {
      for (const phrase of element?.lodgingReview?.rating?.phrases || []) {
        if (phrase?.phraseParts?.[0]?.text?.includes('reviews')) {
          reviews = phrase.phraseParts[0].text.replace('reviews', '');
          break;
        }
      }
    } catch {
      // continue
    }

    const optionList = {};
    try {
      for (const i of element.primarySelections[0].secondarySelections) {
        const secondaryDesc = i.secondarySelection ? i.secondarySelection.description : '';
        for (const ii of i.tertiarySelections) {
          if (ii.optionId !== null) {
            optionList[ii.optionId] = [ii.description, secondaryDesc];
          }
        }
      }
    } catch {
      // continue
    }

    const rates = [];
    let maxAvailability = 0;

    for (const i of element.primarySelections[0].propertyUnit?.ratePlans || []) {
      try {
        let currentPrice = '';
        let totalPrice = '';
        let availability = '';

        // Get price details safely
        const priceDetails = i?.priceDetails?.[0] || {};
        const priceMessages = priceDetails?.price?.displayMessages || [];

        for (const ii of priceMessages) {
          try {
            const lineItems = ii?.lineItems?.[0] || {};

            if ('value' in lineItems) {
              try {
                currentPrice = parseFloat(lineItems.value.replace(/[^\d.]/g, ''));
              } catch {
                currentPrice = '';
              }
            }

            if ('price' in lineItems) {
              try {
                totalPrice = parseFloat(lineItems.price?.formatted?.replace(/[^\d.]/g, ''));
              } catch {
                totalPrice = '';
              }
            }
          } catch {
            continue;
          }
        }

        // Handle availability safely
        try {
          const scarcityMessage = priceDetails?.availability?.scarcityMessage;
          if (scarcityMessage === null && currentPrice !== '') {
            availability = 0;
          } else if (scarcityMessage) {
            availability = parseFloat(scarcityMessage.replace(/[^\d.]/g, ''));
            if (availability > maxAvailability) {
              maxAvailability = availability;
            }
          } else {
            availability = '';
          }
        } catch {
          availability = '';
        }

        // Get rate type and extras safely
        const rateId = i?.id || '';
        const rateType = optionList[rateId]?.[1] || '';
        const rateExtras = optionList[rateId]?.[0] || '';

        rates.push({
          type: rateType,
          extras: rateExtras,
          currentPrice,
          totalPrice,
          availability
        });

      } catch {
        continue;
      }
    }

    allRates.push({
      hotel_id,
      header,
      rating,
      reviews,
      rates,
      maxAvailability,
      checkin,
      checkout
    });
  }
  return allRates;
}
const axiosInstance = axios.create({
  baseURL: 'https://www.hotels.com/graphql',
  headers: {
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Client-Info': 'shopping-pwa,d4abe2b5ece307fd35bdb32a2d91c434505979cf,us-west-2',
    'Content-Type': 'application/json',
    'Origin': 'https://www.hotels.com'
  },
  timeout: 120000 // timeout in milliseconds (120 seconds)
});

// // Add new axios instance for your API
// const apiInstance = axios.create({
//   baseURL: 'http://localhost:8000', // Replace with your actual API endpoint
//   headers: {
//       'Content-Type': 'application/json'
//   },
//   timeout: 5000
// });

const makeRequest = async (hotel_id, property_id, region_id, week_checkin, week_checkout) => {
  const payload = [
    {
      operationName: 'RoomsAndRatesPropertyOffersQuery',
      variables: {
        propertyId: property_id,
        searchCriteria: {
          primary: {
            dateRange: {
              checkInDate: week_checkin,
              checkOutDate: week_checkout
            },
            destination: {
              regionId: region_id
            },
            rooms: [
              {
                adults: 2,
                children: []
              }
            ]
          }
        },
        referrer: 'HSR',
        context: {
          siteId: 300000034,
          locale: 'en_AS',
          eapid: 34,
          tpid: 3200,
          currency: 'USD',
          device: {
            type: 'DESKTOP'
          }
        }
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: 'd511d3a622b4c844208cce495fd91895297116fcce21b509b8f848bb8f23f97d'
        }
      }
    }
  ];

  try {
    const response = await axiosInstance.post('', payload);
    const scrapedInfo = scrape(hotel_id, formatToSQLDate(week_checkin), formatToSQLDate(week_checkout), response.data) // scrapeRoomInfo(hotel_id, response.data);
    return scrapedInfo;
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}
function getDateWithAddedDays(daysToAdd = 0) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + daysToAdd);

  return {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1, // Months are zero-indexed
    year: currentDate.getFullYear(),
  };
}
function formatToSQLDate(dateObj) {
  // Pad month and day with leading zeros if needed
  const month = String(dateObj.month).padStart(2, '0');
  const day = String(dateObj.day).padStart(2, '0');
  // Return in YYYY-MM-DD format
  return `${dateObj.year}-${month}-${day}`;
}