import React, { useState, useEffect } from "react";
import axios from "../../service/api";

export default function NurseDashboard() {
  const [activeTab, setActiveTab] = useState("Patients");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:7001/api/nurse/patients");
      setPatients(response.data.patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:7001/api/nurse/doctors");
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle appointment creation
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:7001/api/nurse/appointments',  appointmentData, {
  withCredentials: true,  // This ensures cookies are sent
});
      alert(response.data.message);
      setAppointmentData({ patientId: "", doctorId: "", date: "", time: "" });
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment.");
    }
  };

  useEffect(() => {
    if (activeTab === "Patients") fetchPatients();
    if (activeTab === "Appointments") fetchDoctors();
  }, [activeTab]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <aside className="bg-[#5AC5C8] text-white w-full md:w-64 p-4">
        <h2 className="text-2xl font-bold mb-6">Nurse Dashboard</h2>
        <button
          className={`block w-full text-left py-2 px-4 rounded-md mb-2 ${
            activeTab === "Patients"
              ? "bg-white text-[#5AC5C8]"
              : "hover:bg-[#4CA7AA]"
          }`}
          onClick={() => setActiveTab("Patients")}
        >
          Patients
        </button>
        <button
          className={`block w-full text-left py-2 px-4 rounded-md ${
            activeTab === "Appointments"
              ? "bg-white text-[#5AC5C8]"
              : "hover:bg-[#4CA7AA]"
          }`}
          onClick={() => setActiveTab("Appointments")}
        >
          Appointments
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {/* Patients Tab */}
        {activeTab === "Patients" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Assigned Patients</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.map((patient) => (
                <div
                  key={patient._id}
                  className="bg-white p-4 shadow-md rounded-md"
                >
                  <h3 className="font-bold text-lg">{patient.fullName}</h3>
                  <p>Email: {patient.email}</p>
                  <p>Age: {patient.age}</p>
                  <p>City: {patient.city}</p>
                  <p>Blood Type: {patient.bloodType}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "Appointments" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Create Appointment</h2>
            <form
              className="bg-white p-6 shadow-md rounded-md"
              onSubmit={handleCreateAppointment}
            >
              {/* Select Patient */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Patient</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={appointmentData.patientId}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      patientId: e.target.value,
                    })
                  }
                >
                  <option value="">Choose a Patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Doctor */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Doctor</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={appointmentData.doctorId}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      doctorId: e.target.value,
                    })
                  }
                >
                  <option value="">Choose a Doctor</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={appointmentData.date}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      date: e.target.value,
                    })
                  }
                />
              </div>

              {/* Time */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={appointmentData.time}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      time: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="bg-[#5AC5C8] text-white py-2 px-4 rounded-md hover:bg-[#4CA7AA]"
              >
                Create Appointment
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
