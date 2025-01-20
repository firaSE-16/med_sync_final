import React, { useState, useEffect } from "react";
import axios from "axios";

const TriageBody = () => {
  const [patients, setPatients] = useState([]);
  const [selectedOpd, setSelectedOpd] = useState({});
  const [pulseRates, setPulseRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:7001/api/triage/bookings", {
        withCredentials: true,
      });
      setPatients(response.data.bookings || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handlePulseRateChange = (bookingId, value) => {
    setPulseRates((prev) => ({ ...prev, [bookingId]: value }));
  };

  const handleOpdChange = (bookingId, opdName) => {
    setSelectedOpd((prev) => ({ ...prev, [bookingId]: opdName }));
  };

  const assignToOPD = async (bookingId, opdName, pulseRate) => {
    try {
      if (!bookingId || !opdName || !pulseRate) {
        alert("Booking ID, OPD name, and pulse rate are required.");
        return;
      }

      await axios.post(
        "http://localhost:7001/api/triage/assign-opd",
        { bookingId, opdName, pulseRate },
        { withCredentials: true }
      );

      alert(`Booking ID ${bookingId} has been assigned to OPD: ${opdName}`);
      fetchPatientData();
    } catch (error) {
      alert(
        `Failed to assign Booking ID ${bookingId}: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  if (loading) return <p className="text-center text-[#5AC5C8]">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="container mx-auto mt-6 px-4">
      <h1 className="text-3xl font-bold text-[#5AC5C8] mb-6 text-center">
        OPD Assignment
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((booking) => (
          <div
            key={booking._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {booking.userId?.fullName}
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Age:</strong> {booking.userId?.age}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>City:</strong> {booking.userId?.city}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Blood Type:</strong> {booking.userId?.bloodType}
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Pulse Rate
              </label>
              <input
                type="number"
                className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                placeholder="Enter pulse rate"
                onChange={(e) => handlePulseRateChange(booking._id, e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Assign to OPD
              </label>
              <select
                className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-[#5AC5C8]"
                onChange={(e) => handleOpdChange(booking._id, e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Select OPD
                </option>
                <option value="General OPD">General OPD</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
            </div>
            <button
              onClick={() =>
                assignToOPD(
                  booking._id,
                  selectedOpd[booking._id],
                  pulseRates[booking._id]
                )
              }
              className="mt-4 w-full p-2 bg-[#5AC5C8] text-white rounded shadow-md hover:bg-[#49b5b7] focus:ring-2 focus:ring-[#5AC5C8]"
            >
              Send to OPD
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TriageBody;
