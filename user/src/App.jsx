import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./pages/Home/Home";
import Department from "./pages/Department/Department";
import Contact from "./pages/Contact/Contact";
import About from "./pages/About/About";
import Auth from "./pages/Auth/Auth";
import Patient from "./pages/Patient/Patient";
import Doctor from "./pages/Doctor/Doctor";
import Doctors from "./pages/Doctors/Doctors";
import Nurse from "./pages/Nurse/Nurse";
import Laboratorist from "./pages/Laboratorist/Laboratorist";
import Triage from "./pages/Triage/Triage";
import Admin from "./pages/Admin/Admin";
import Form from "./pages/Form/Form";
import Booking from "./pages/Form/Booking";

function App() {
  return (
    
      <Routes>
        {/* Routes with Navbar and Footer */}
        <Route path="/" element={<Layout> <Home /> </Layout>}/>
        <Route path="/department" element={<Layout> <Department /></Layout>}/>
        <Route path="/about" element={<Layout> <About /> </Layout>}/>
        <Route path="/contact" element={<Layout> <Contact /> </Layout>}/>
        <Route path="/showDoctor" element={<Layout><Doctor/></Layout>}/>

        {/* Routes without Navbar and Footer */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/patient" element={<Patient />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/nurse" element={<Nurse />} />
        <Route path="/laboratorist" element={<Laboratorist />} />
        <Route path="/triage" element={<Triage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/form" element={<Form />} />
        <Route path="/book" element={<Booking />} />
      </Routes>
    
  );
}

export default App;
