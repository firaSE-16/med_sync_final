import axios from "axios";
import dashboardIcon from "../../assets/icons/dashboard.png";
import opdIcon from "../../assets/icons/opd.png";
import staffIcon from "../../assets/icons/staff.png";
import addStaffIcon from "../../assets/icons/addStaff.png";
import { useEffect, useState } from "react";

export default function AdminBody() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [staffForm, setStaffForm] = useState({
    email: "",
    fullName: "",
    password: "",
    profilePic: null, // Updated for image upload
    specialization: "",
    experience: 0,
    contactNumber: "",
    opd: "",
    role: "doctor", // Default to "doctor"
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); // Track staff being edited
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("doctor"); // Default role


  const handleTabClick = (tabName) => setActiveTab(tabName);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEdit = (id, role) => {
    const staffToEdit = staffList.find((staff) => staff._id === id);
    setEditingStaff(staffToEdit); // Set the staff data to be edited
  };
  

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const fetchStaff = async (role) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:7001/api/admin/fetch/${role}`);
      setStaffList(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setResponseMessage(error.response?.data?.message || "Failed to fetch staff.");
    }
  };
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);  // Set the selected role
    fetchStaff(e.target.value);  // Fetch staff based on selected role
  };
  
  const handleDelete = async (id, role) => {
    try {
      const response = await axios.delete(`http://localhost:7001/api/admin/delete/${role}/${id}`);
      setResponseMessage(response.data.message || "Staff member deleted successfully.");
      fetchStaff(role);  // Refetch the list after deletion
    } catch (error) {
      setResponseMessage(error.response?.data?.message || "Failed to delete staff.");
    }
  };
  
  const handleUpdate = async (e, id) => {
    e.preventDefault();  // Prevent default form submission
    
    try {
      // Send PUT request to update staff data
      const response = await axios.put(`http://localhost:7001/api/admin/update/${selectedRole}/${id}`, editingStaff);
      setResponseMessage(response.data.message || "Staff updated successfully.");
      
      // Optionally reset the form or close the edit view
      setEditingStaff(null);  // Clear editing state
      fetchStaff(selectedRole);  // Refresh staff list
  
    } catch (error) {
      setResponseMessage(error.response?.data?.message || "Failed to update staff.");
    }
  };
  
  
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setStaffForm((prev) => ({
      ...prev,
      profilePic: file,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(staffForm).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    try {
      setUploading(true);
      const response = await axios.post("http://localhost:7001/api/admin", formData, {
        // Remove Content-Type, Axios will handle it
        withCredentials: true, // If you're using cookies
      });
      setUploading(false);
      setResponseMessage(response.data.message || "Staff added successfully!");
      setStaffForm({
        email: "",
        fullName: "",
        password: "",
        profilePic: null,
        specialization: "",
        experience: 0,
        contactNumber: "",
        opd: "",
        role: "doctor",
      }); // Reset form
    } catch (error) {
      setUploading(false);
      setResponseMessage(error.response?.data?.message || "Failed to add staff.");
    }
  };
  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage(""); // Clear message after 5 seconds
      }, 3000);
  
      // Cleanup timeout if the component is unmounted or responseMessage changes
      return () => clearTimeout(timer);
    }
  }, [responseMessage]); // Trigger the effect whenever responseMessage changes
  
  const renderContent = () => {
    switch (activeTab) {
      case "Staff":
  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
  <h2 className="text-2xl font-semibold mb-6 text-[black]">Staff List</h2>

  {/* Role Selection Dropdown */}
  <div className="mb-6">
    <label htmlFor="role" className="block text-sm font-medium text-[black]">
      Select Role
    </label>
    <select
      id="role"
      name="role"
      value={selectedRole} // Track selected role
      onChange={handleRoleChange} // Fetch staff based on selected role
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#5AC5C8] focus:border-[#5AC5C8] text-[#5AC5C8]"
    >
      {["doctor", "triage", "nurse", "laboratorist"].map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  </div>

  {/* Edit Staff Form */}
  {editingStaff && (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mb-8">
      <h2 className="text-lg font-semibold mb-4 text-[#5AC5C8]">Edit Staff</h2>
      <form onSubmit={(e) => handleUpdate(e, editingStaff._id)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[black]">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editingStaff.email}
              onChange={handleEditInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#5AC5C8] focus:border-[#5AC5C8]"
            />
          </div>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[black]">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={editingStaff.fullName}
              onChange={handleEditInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#5AC5C8] focus:border-[#5AC5C8]"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[black]">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={editingStaff.password}
            onChange={handleEditInputChange}
            required
            minLength="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#5AC5C8] focus:border-[#5AC5C8]"
          />
        </div>
        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-[black]">Specialization</label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={editingStaff.specialization}
            onChange={handleEditInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#5AC5C8] focus:border-[#5AC5C8]"
          />
        </div>
        <div>
          <label htmlFor="contactNumber" className="block text-sm font-medium text-[black]">Contact Number</label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={editingStaff.contactNumber}
            onChange={handleEditInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#5AC5C8] focus:border-[#5AC5C8]"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-[#5AC5C8]">Role</label>
          <select
            id="role"
            name="role"
            value={editingStaff.role}
            onChange={handleEditInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#5AC5C8] focus:border-[#5AC5C8]"
          >
            {["admin", "doctor", "triage", "nurse", "laboratorist"].map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-[#5AC5C8] text-white px-6 py-2 rounded-md hover:bg-[#4DA5A8] transition-colors"
        >
          Update
        </button>
      </form>
    </div>
  )}

  {/* Staff Cards */}
  {loading ? (
    <p>Loading...</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {staffList.map((staff) => (
        <div key={staff._id} className="bg-gray-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
          <img
            src={`${staff.profilePic}`}
            alt="profile"
            className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-[#5AC5C8]">{staff.fullName}</h3>
          <p className="text-sm text-gray-600">{staff.specialization}</p>
          <p className="text-sm">{staff.email}</p>
          <p className="text-sm">{staff.contactNumber}</p>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handleEdit(staff._id, staff.role)} // Open the edit form
              className="bg-[#5AC5C8] text-white px-4 py-2 rounded-md hover:bg-[#4DA5A8] transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(staff._id, staff.role)} // Trigger delete
              className="bg-[#F29C11] text-white px-4 py-2 rounded-md hover:bg-[#F39C11] transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )}

  {responseMessage && (
    <p className="mt-4 text-sm text-[#55b055]">{responseMessage}</p>
  )}
</div>

  );

      case "Add Staff":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto sm:p-8 md:max-w-4xl lg:max-w-6xl">
  <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Add Staff</h2>
  <form onSubmit={handleFormSubmit} className="space-y-6">
    {/* Email and Full Name */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={staffForm.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AC5C8] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={staffForm.fullName}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AC5C8] focus:outline-none"
        />
      </div>
    </div>

    {/* Password and Profile Picture */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={staffForm.password}
          onChange={handleInputChange}
          required
          minLength="6"
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AC5C8] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="profilePic" className="block text-sm font-medium text-gray-600">
          Profile Picture
        </label>
        <input
          type="file"
          id="profilePic"
          name="profilePic"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AC5C8] focus:outline-none"
        />
      </div>
    </div>

    {/* Specialization and Experience */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor="specialization" className="block text-sm font-medium text-gray-600">
          Specialization
        </label>
        <input
          type="text"
          id="specialization"
          name="specialization"
          value={staffForm.specialization}
          onChange={handleInputChange}
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AC5C8] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-600">
          Experience (Years)
        </label>
        <input
          type="number"
          id="experience"
          name="experience"
          value={staffForm.experience}
          onChange={handleInputChange}
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AC5C8] focus:outline-none"
        />
      </div>
    </div>

    {/* Contact Number, OPD, and Role */}
    <div className="space-y-6">
      <div>
        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-600">
          Contact Number
        </label>
        <input
          type="text"
          id="contactNumber"
          name="contactNumber"
          value={staffForm.contactNumber}
          onChange={handleInputChange}
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AC5C8] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="opd" className="block text-sm font-medium text-gray-600">
          OPD
        </label>
        <input
          type="text"
          id="opd"
          name="opd"
          value={staffForm.opd}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AC5C8] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-600">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={staffForm.role}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AC5C8] focus:outline-none"
        >
          {["admin", "doctor", "triage", "nurse", "laboratorist"].map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={uploading}
      className={`w-full px-6 py-3 text-white rounded-lg transition-colors duration-200 ${
        uploading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#5AC5C8] hover:bg-[#4DA5A8]"
      }`}
    >
      {uploading ? "Uploading..." : "Add Staff"}
    </button>

    {/* Response Message */}
    {responseMessage && (
      <div className="mt-6 text-sm text-center text-green-600">{responseMessage}</div>
    )}
  </form>
</div>

        );
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  return (
    <div className="flex h-screen outfit">
      {/* Sidebar */}
      <div className="bg-[#5AC5C8] w-64 flex flex-col p-4 text-white">
        <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex flex-col gap-4">
          {[{ name: "Dashboard", icon: dashboardIcon }, { name: "OPD", icon: opdIcon }, { name: "Staff", icon: staffIcon }, { name: "Add Staff", icon: addStaffIcon }].map((item) => (
            <button
              key={item.name}
              onClick={() => handleTabClick(item.name)}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${activeTab === item.name ? "bg-white text-[#5AC5C8] font-bold" : "hover:bg-[#4DA5A8]"}`}
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}
