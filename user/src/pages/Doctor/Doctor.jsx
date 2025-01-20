import React,{useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';


const Doctor = () => {
  const location=useLocation();
  const department=location.state?.department || "Unknown";
  const [array, setArray]=useState([]);
  useEffect(()=>{
    const fetchDoctors=async ()=>{
      try{
        const result=await fetch('/Data/Doctors.json');
        if(!result){
          return console.log("Error with fetching");
        }
        const data=await result.json();
        const filteredDoctors = data[`${department}`] || [];
        setArray(filteredDoctors);

      }catch(error){
        console.log("Something went wrong, Please try again");
      }
    }
    fetchDoctors();

  },[])
  console.log("My fetched result", array);
  const generateStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };
  
  return (
    <div>
      <h1 className="flex justify-center text-2xl font-extrabold text-mygreen pt-7 pb-3">{department}</h1>
       <div className="md:flex gap-7 overflow-hidden flex-wrap mx-0 justify-center border-2 border-black md:px-80">
       {array.map((dep)=>(
        <div className="mt-14">
         <div className="cursor-pointer w-[350px] mx-auto border rounded-2xl shadow-lg overflow-hidden bg-white transition-transform duration-300 hover:scale-105" onClick={() => handleDoctor(dep.name)}>
         <div className="overflow-hidden">
             <img className="w-full h-[300px] object-cover" src={dep.profile_image} alt="Internal Medicine" />
         </div>
         <div className="p-4 text-center text-myblack">
             <h1 className="font-extrabold text-2xl text-mycolor">{dep.name}</h1>
             <h1 className="font-extrabold text-2xl text-mycolor">{dep.specialization}</h1>
             <div className="flex justify-center mt-2 ">
              <h1 className="pl-3 pr-3 font-bold">{dep.rating}</h1>
                  {generateStars(dep.rating)}
                </div>
             <p className="mt-2 text-gray-600 text-sm">Dr. {dep.name} specializes in {dep.specialization} with {dep.years_of_experience} years of experience. They have a rating of {dep.rating} and can be contacted at <span className="font-bold">{dep.contact}</span>.</p>
             <p className="mt-2 text-gray-600 text-sm">{dep.history}</p>
         </div>
     </div>
     </div>
      ))}
       </div>
      
    </div>
  )
}

export default Doctor;
