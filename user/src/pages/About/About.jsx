import React from 'react';
import image from '../../assets/about.png';

const About = () => {
  return (
    <div className="font-outfit">
      <h1 className="flex justify-center text-2xl font-extrabold mt-3">About Us</h1>
      <div className="flex flex-col gap-5 mx-7 mt-7">
        
        <div className="md:flex md:gap-7 md:items-start md:space-y-0">
        <img src={image} className="rounded-2xl float" alt="About Us" />
            <div>
            
          <p className="font-outfit text-xl leading-relaxed mb-0">
          Welcome to Med-Sync, your reliable solution for seamless and efficient doctor-patient communication.  
At Med-Sync, we aim to transform the healthcare experience by simplifying appointment scheduling, enhancing real-time communication, and providing secure access to health records. Our platform ensures that patients and healthcare providers stay connected, informed, and empowered, making healthcare more accessible and efficient for everyone.
            <br /><br />
            Med-Sync is committed to excellence in healthcare communication. We continuously strive to enhance our platform by integrating the latest technologies to improve user experience and deliver superior service. Whether you're booking your first appointment, managing ongoing care, or communicating with your healthcare provider, Med-Sync is here to support you every step of the way. Our goal is to ensure that both patients and doctors have access to the tools and resources needed for efficient, reliable, and personalized healthcare management.
          </p>
          <h1 className="flex justify-center font-bold mt-3 text-xl">Our Vision</h1>
          <p className="font-sans text-xl">Our vision at Med-Sync is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>

            </div>
         
        </div>

      
       
      </div>
    </div>
  );
};

export default About;
