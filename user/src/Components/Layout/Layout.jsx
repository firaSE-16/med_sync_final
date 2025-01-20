import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import Sidemenu from '../Navbar/Sidemenu';
const Layout = ({children}) => {
  return (
    <>
      <div className="lg:hidden">
        <Sidemenu />
      </div>

      <div className="hidden lg:block">
        <Navbar />
      </div>
     
        {children}
       

      <Footer />
    </>
  );
}

export default Layout