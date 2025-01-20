import React, { useState, useEffect } from "react";
import axios from "../../service/api"; // Import your centralized Axios instance
import dashboardIcon from "../../assets/icons/dashboard.png";
import appointmentsIcon from "../../assets/icons/appointments.png";
import doctorsIcon from "../../assets/icons/doctors.png";
import prescriptionIcon from "../../assets/icons/prescription.png";
import historyIcon from "../../assets/icons/history.png";
import billingIcon from "../../assets/icons/billing.png";
import bookingIcon from "../../assets/icons/booking.png";

export default function PatientBody() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    console.log(`Fetching data for ${tabName}`);
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/user/booked-appointment");
      setAppointments(response.data.appointments); // Assuming response.data.appointments contains the list
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Booked Appointments") {
      fetchAppointments();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "Booked Appointments":
        return (
          <div>
            {loading ? (
              <div>Loading appointments...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white shadow-lg rounded-2xl p-6 relative overflow-hidden border border-gray-200"
                  >
                    {/* Ticket-like header */}
                    <div className="absolute top-0 left-0 w-full bg-[#5AC5C8] text-white py-3 px-4 flex justify-between items-center rounded-t-2xl">
                      <h3 className="text-lg font-bold">Appointment Ticket</h3>
                      <span className="text-sm bg-white text-[#5AC5C8] px-2 py-1 rounded-full">
                        {appointment.status}
                      </span>
                    </div>

                    {/* Ticket content */}
                    <div className="mt-12">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        Date: {new Date(appointment.appointmentDate).toDateString()}
                      </h4>
                      <p className="text-gray-600 text-lg">
                        Time: <span className="font-semibold">{appointment.appointmentTime}</span>
                      </p>
                      <p className="text-gray-600 text-lg">
                        Appointment ID:{" "}
                        <span className="font-mono bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {appointment._id}
                        </span>
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-dashed border-gray-300">
                      <p className="text-sm text-gray-500">
                        This ticket is valid only for the selected date and time. Please contact support
                        for changes or cancellations.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No appointments found.</div>
            )}
          </div>
        );
      case "Appointments":
        return <div>Appointments Content</div>;
      case "Doctors":
        return <div>Doctors Content</div>;
      case "Prescription":
        return <div>Prescription Content</div>;
      case "Medical History":
        return <div>Medical History Content</div>;
      case "Billing":
        return <div>Billing Content</div>;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="flex h-screen outfit">
      {/* Sidebar */}
      <div className="bg-[#5AC5C8] w-64 flex flex-col p-4 text-white pt-16">
        <div className="flex flex-col gap-4">
          {[
            { name: "Booked Appointments", icon: bookingIcon },
            { name: "Appointments", icon: appointmentsIcon },
            { name: "Doctors", icon: doctorsIcon },
            { name: "Prescription", icon: prescriptionIcon },
            { name: "Medical History", icon: historyIcon },
            { name: "Billing", icon: billingIcon },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => handleTabClick(item.name)}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                activeTab === item.name
                  ? "bg-white text-[#5AC5C8] font-bold"
                  : "hover:bg-[#4DA5A8]"
              }`}
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
        <div className="text-2xl font-semibold mb-4">{activeTab}</div>
        {renderContent()}
      </div>
    </div>
  );
}
