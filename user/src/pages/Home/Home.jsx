import React from "react";
import doctorsicon from "../../assets/doctorsicon.png";
import doc1 from "../../assets/doc1.jpg";
import doc2 from "../../assets/doc2.jpg";
import doc3 from "../../assets/doc3.jpg";

const Home = () => {
  return (
    <div className="flex flex-col gap-16 items-center font-outfit px-4">
      <div className="flex flex-col lg:flex-row justify-around w-full max-w-screen-xl h-auto lg:h-[500px] mt-8 pt-8 lg:pt-20 rounded-lg bg-[#5AC5C8] w-full">
        <div className="lg:w-[60%] w-full px-6 lg:pl-10 text-white flex flex-col gap-4">
          <p className="text-4xl lg:text-6xl font-semibold mt-4 lg:mt-10">
            Book Appointment with Trusted Doctors
          </p>
          <div className="flex flex-col sm:flex-row mt-4 gap-4 items-center">
            <div className="flex space-x-[-8px]">
              <img
                className="w-10 h-10 lg:w-14 lg:h-14 rounded-full"
                src={doc1}
                alt="Doctor 1"
              />
              <img
                className="w-10 h-10 lg:w-14 lg:h-14 rounded-full"
                src={doc2}
                alt="Doctor 2"
              />
              <img
                className="w-10 h-10 lg:w-14 lg:h-14 rounded-full"
                src={doc3}
                alt="Doctor 3"
              />
            </div>

            <div className="text-sm lg:text-base text-center lg:text-left">
              Find trusted Ethiopian doctors and book appointments easily for
              efficient communication.
            </div>
          </div>

          <div>
            <button className="z-[1] h-10 lg:h-12 w-40 lg:w-48 text-sm lg:text-base rounded-full bg-white mt-5 text-[#5f6666] transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95 ">
              Book Appointment
            </button>
          </div>
        </div>
        <div className="flex items-end justify-center lg:justify-end w-full lg:w-[40%] mt-6 lg:mt-0">
          <img
            className="w-[80%] lg:w-[90%] h-auto"
            src={doctorsicon}
            alt="Doctors Icon"
          />
        </div>
      </div>

      <div className="w-full max-w-screen-xl">
        <h1>Departments</h1>
        <p>
          We provide a wide array of medical services tailored to meet the
          diverse healthcare needs of our patients. With a team of highly
          skilled medical professionals, we deliver expert care across the
          following specialties:
        </p>
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default Home;
