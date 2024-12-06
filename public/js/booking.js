// Function to fetch booking details and display them
const fetchBookingDetails = async () => {
  try {
    // Make an HTTP GET request to the backend API
    const response = await axios.get("http://localhost:8080/api/booking");

    // Assuming the response contains the booking data
    const bookingData = response.data.data.bookings;
    console.log(bookingData);

    bookingData.map((booking) => {
      document.getElementById("name").innerText = booking.name;
      document.getElementById("phone").innerText = booking.phone;
      document.getElementById("date").innerText = new Date(
        booking.date
      ).toLocaleDateString();
      document.getElementById("start-time").innerText = booking.startTime;
      document.getElementById("end-time").innerText = booking.endTime;
      document.getElementById("branch").innerText = booking.branch;
      document.getElementById("persons").innerText = booking.persons;
    });

    // Display the booking details in the HTML
  } catch (error) {
    console.error("Error fetching booking data:", error);
  }
};

// Call the function when the page loads
fetchBookingDetails();
