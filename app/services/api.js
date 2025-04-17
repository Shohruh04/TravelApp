import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: 'https://booking-com15.p.rapidapi.com/api/v1',
  headers: {
    'X-RapidAPI-Key': '6d03a54ca8msh1e24b8d17bfcec4p1fe0a1jsn250a8f59f9a5',
    'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com',
  },
});

// Add a request interceptor for logging or additional headers
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors based on status codes
    if (error.response) {
      // Server responded with a status code that falls out of the range of 2xx
      console.error(
        'API Error Response:',
        error.response.status,
        error.response.data
      );

      // You can handle specific error status codes
      if (error.response.status === 429) {
        // Rate limit exceeded
        console.error('API Rate limit exceeded');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Hotel API functions
export const hotelApi = {
  // Search for locations (cities, areas, etc)
  searchLocations: async (searchQuery) => {
    try {
      const response = await apiClient.get('/hotels/searchDestination', {
        params: {
          query: searchQuery,
          languagecode: 'en-us',
        },
      });

      // Ensure we have a valid response with data array
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return {
          data: response.data.data.map((item) => ({
            dest_id: item.dest_id,
            dest_type: item.dest_type,
            name: item.name,
            city_name: item.city_name || '',
            country: item.country || '',
            region: item.region || '',
            label: item.label || `${item.name}, ${item.country}`,
            image_url: item.image_url || '',
            latitude: item.latitude,
            longitude: item.longitude,
            search_type: item.search_type,
            hotels_count: item.nr_hotels || item.hotels || 0,
          })),
        };
      } else {
        console.error('Unexpected response format:', response.data);
        return { data: [] };
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  },

  // Search for hotels in a specific destination
  searchHotels: (params) => {
    return apiClient.get('/hotels/searchHotels', {
      params: {
        dest_id: params.dest_id || '-2092174', // Default to Mumbai if none provided
        search_type: params.search_type || 'CITY',
        adults: params.adults || '1',
        children_age: params.children_age || '0,17',
        room_qty: params.room_qty || '1',
        page_number: params.page_number || '1',
        units: 'metric',
        temperature_unit: 'c',
        languagecode: 'en-us',
        currency_code: params.currency_code || 'USD',
        location: params.location || 'US',
      },
    });
  },

  // Get detailed information about a specific hotel
  getHotelDetails: (hotelId, params = {}) => {
    // Format dates if provided, otherwise use default dates (7 days from now)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split('T')[0]; // returns YYYY-MM-DD
    };

    const arrival_date = params.arrival_date || formatDate(today);
    const departure_date = params.departure_date || formatDate(nextWeek);

    return apiClient.get('/hotels/getHotelDetails', {
      params: {
        hotel_id: hotelId,
        arrival_date: '2025-04-17',
        departure_date: '2025-04-24',
        adults: params.adults || '1',
        children_age: params.children_age || '0,17',
        room_qty: params.room_qty || '1',
        units: 'metric',
        temperature_unit: 'c',
        languagecode: 'en-us',
        currency_code: params.currency_code || 'USD',
      },
    });
  },

  // Get hotel reviews
  getHotelReviews: (hotelId) => {
    return apiClient.get('/hotels/getHotelReviews', {
      params: {
        hotel_id: hotelId,
        languagecode: 'en-us',
        sort_by: 'relevance_desc',
      },
    });
  },

  // Get hotel room availability
  getRoomAvailability: (hotelId, checkin, checkout, adults) => {
    return apiClient.get('/hotels/getRoomAvailability', {
      params: {
        hotel_id: hotelId,
        arrival_date: checkin,
        departure_date: checkout,
        adults: adults || 1,
        children_age: '0,17',
        room_qty: 1,
        languagecode: 'en-us',
        currency_code: 'USD',
      },
    });
  },
};

export default apiClient;
