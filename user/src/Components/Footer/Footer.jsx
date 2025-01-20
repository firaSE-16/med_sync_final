import React from 'react'
import logo from '../../assets/logo.png'
const Footer = () => {
  return (
    <div className='font-outfit flex flex-col items-center mt-20 bottom-4 mx-[10%]'>
      <div className="flex justify-between   sm:mx-[5%] ">
        <div className="w-[40%] ">
          <h1>
            <div className="flex items-center gap-2">
              <img className="w-10 h-10 " src={logo} alt="logo" />
              <p className=" text-[20px] font-medium text-[#5AC5C8]">
                <span className="text-[25px] font-bold text-[#04353D]">
                  Med
                </span>
                Sync
              </p>
            </div>
          </h1>
          <p>
            MedSync enhances doctor-patient communication by simplifying
            appointment scheduling, medical history tracking, and secure online
            follow-ups. Patients can easily access lab reports, receive
            feedback, and contact doctors directly, improving efficiency and
            care while ensuring privacy.
          </p>
        </div>
        <div className="w-[20%] ">
          <h1 className="font-semibold text-2xl mb-4 ">Company</h1>
          <li>Home</li>
          <li>About Us</li>
          <li>Home</li>
           <li>Delivery</li>
          <li>Privacy policy</li>
        </div>
        <div className="w-[20%] ">
          <h1 className="font-semibold text-2xl mb-4 ">GET IN TOUCH</h1>
          <p>+0-000-000-000</p>
          <p>webdev5@gmail.com</p>
        </div>
      </div>
      <div className='w-full'>
       <hr className="mx-[10%] h-[1.5px] mt-4 bg-[#909293]" />
    </div>
      <div className='mt-5 font-medium'>Copyright 2025 @ webdev5 - All Right Reserved.</div>
    </div>
  );
}

export default Footer