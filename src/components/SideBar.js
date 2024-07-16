import React, { useState } from "react";
import { NavLink,Link, useLocation } from "react-router-dom";
import { BiCircle } from "react-icons/bi";
import { SlSpeedometer } from "react-icons/sl";
import { AiTwotoneSetting, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import {
  DASHBOARD_SIDEBAR_DATACENTER,
  DASHBOARD_SIDEBAR_EXAM_LINKS,
  DASHBOARD_SIDEBAR_LINKS,
  DASHBOARD_SIDEBAR_SETTING_LINKS,
} from "../lib/consts/Navigation";
import logo from "../assets/logo.png";
import { BsListCheck } from "react-icons/bs";
import { FaDatabase } from "react-icons/fa";
import { HiOutlineDocument, HiUsers } from "react-icons/hi";
import bg from "../assets/bg_sidebar.jpg";


const SideBar = ({ showSideBar, setShowSideBar }) => {
  const [showSetting, setShowSetting] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [showDataCenter, setShowDataCenter] = useState(false);
  const { pathname } = useLocation();
  const localData = JSON?.parse(localStorage.getItem("data"));
  const [showProcess, setShowProcess] = useState(false);
  const roles = localData?.data?.roles[0].name;
 

  const handleProcess=()=>{
    setShowProcess(!showProcess);
    setShowSetting(false);
  }
  const handleSetting=()=>{
    setShowSetting(!showSetting);
    setShowProcess(false)
  }

  const hasPermission = (permission)=>{
    return localData?.data?.userPermissions.includes(permission);
  }
  const requiredPermissions = ["view_schedule", "view_onboard", "view_offerletter", "view_salary", "view_feedback"];

const hasRequiredPermissions = requiredPermissions.some(permission => localData?.data?.userPermissions.includes(permission));

  return (
    <div
      className={`flex flex-col transition-all overflow-y-scroll no-scrollbar delay-150 duration-150 z-50 bg-primary ${
        showSideBar
          ? " translate-x-0 w-60 p-3 transition-all duration-100 delay-100  "
          : " -translate-x-60 transition-all p-0 duration-100 w-0 delay-100"
      } inset-y-0 left-0 absolute lg:relative text-white`}
      style={{
        backgroundImage: `url(${bg})`, 
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="flex items-center justify-center gap-2 px-1 lg:py-3 py-2">
        <Link to="/admin" className="cursor-pointer">
          <img src={logo} alt="CIPL Logo" className="h-8" />
        </Link>
      </div>
      <hr className={`${showSideBar ? "py-1" : "hidden"}py-1`} />
      <div className={`flex-1 ${showSideBar ? "py-1" : "hidden"} py-1`}>
        {/* {roles=="admin" && ( */}
           <Link
           to={"/admin"}
           className={`flex items-center cursor-pointer my-1 px-2 py-1 rounded-lg ${
             pathname.replace("/admin/", "") === "/admin"
               ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black"
               : "bg-transparent hover:bg-[#22769b]"
           } `}
         >
           <span className="text-xl px-2">
             <SlSpeedometer />
           </span>
           <span className="text-md px-2 font-light">Dashboard</span>
         </Link>

        {/* )} */}
       
        {/*{DASHBOARD_SIDEBAR_LINKS?.filter(
          (navigate) =>
            localData &&
            localData?.data?.userPermissions?.some(
              (item) => item === navigate.key
            )
        )*/}
        {DASHBOARD_SIDEBAR_LINKS?.filter(
          (navigate) =>
            localData &&
            localData?.data?.userPermissions?.some(
              (item) => item === navigate.key
            )
        ).map((item) => (
          <Link
            key={item.id}
            to={item?.link}
            className={`flex items-center cursor-pointer my-1 px-2 py-1 rounded-lg ${
              pathname.replace("/admin/", "") === item.link
                ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black"
                : "bg-transparent hover:bg-[#22769b]"
            } `}
          >
            <span className="text-xl px-2">{item.icon}</span>
            <span className="text-md px-2 font-light">{item.name}</span>
          </Link>
        ))}



        <div className="w-full">
       {   
        hasRequiredPermissions && (
          <button
          onClick={handleProcess}
          className="px-2 py-1 w-full items-center flex justify-between rounded-lg duration-75 delay-75 hover:bg-[#22769b]"
        >
          <div className="flex items-center">
            <span>
              <HiOutlineDocument className="text-xl mx-2" />
            </span>
            <span className="text-md mx-2">Process</span>
          </div>
          <span>{showProcess ? <AiOutlineUp /> : <AiOutlineDown />}</span>
        </button>
        )
      }     
          {showProcess ? (
            <div>
              {hasPermission("view_schedule") &&
              <NavLink
            to="interviewschedule"
            className={({ isActive }) =>
              `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
                isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
              }`
            }
          >  
                  <span className="px-2">
                    <BiCircle />
                  </span>
                  <span className="px-1">Interview Schedule</span>
               
              </NavLink>
}
{hasPermission("view_feedback") &&
                <NavLink to={"showCandidateFeedback"}
               className={({ isActive }) =>
                `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
                  isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
                }`
              }>
                  <span className="px-2">
                    <BiCircle />
                  </span>
                  <span className="px-1">Interview Feedback</span>  
              </NavLink>
}
<NavLink to={"candidateDocumentation"}
               className={({ isActive }) =>
                `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
                  isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
                }`
              }>
                  <span className="px-2">
                    <BiCircle />
                  </span>
                  <span className="px-1">Documentation</span>  
              </NavLink>
              <NavLink to={"candidatePCC"}
               className={({ isActive }) =>
                `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
                  isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
                }`
              }>
                  <span className="px-2">
                    <BiCircle />
                  </span>
                  <span className="px-1">Candidate PCC</span>  
              </NavLink>
{hasPermission("view_salary") &&  
              <NavLink to={"salary"}
              className={({ isActive }) =>
                `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
                  isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
                }`
              }>
               
                  <span className="px-2">
                    <BiCircle />
                  </span>
                  <span className="px-1">Offered Salary</span>
               
              </NavLink>
}
              {hasPermission("view_offerletter") && 
              <NavLink to={"candidateOfferLetter"}
             className={({ isActive }) =>
              `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
                isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
              }`
            }>
               
                  <span className="px-2">
                    <BiCircle />
                  </span>
                  <span className="px-1"> Offer letter</span>
               
              </NavLink>
}
{hasPermission("view_onboard") && 
 <NavLink to={"onboard"}
 className={({ isActive }) =>
  `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
    isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
  }`
}>
  
    <span className="px-2">
      <BiCircle />
    </span>
    <span className="px-1">Onboard</span>
  
</NavLink>}
             
            </div>
          ) : null}
        </div>

   <div className="w-full">
   <button
     onClick={handleSetting}
     className="px-2 py-1 w-full items-center flex justify-between rounded-lg duration-75 delay-75  hover:bg-[#22769b]"
   >
     <div className="flex items-center">
       <span>
         <AiTwotoneSetting className=" text-xl mx-2" />
       </span>
       <span className="text-md mx-2">Setting</span>
     </div>
     <span>{showSetting ? <AiOutlineUp /> : <AiOutlineDown />}</span>
   </button>
   {showSetting ? (
     <div>
       
       <div>
        {hasPermission("view_category") && (
          <NavLink to={"jobcategory"}  className={({ isActive }) =>
            `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
              isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
            }`
          }>
                  
                    <span className="px-2">
                      <BiCircle />
                    </span>
                    <span className="px-1">Job Category</span>
                 
                </NavLink>

        )}
   
   </div>
   <div>
   {hasPermission("view_jd") && (
   <NavLink to={"jd"}  className={({ isActive }) =>
       `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
         isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
       }`
     }>
            
               <span className="px-2">
                 <BiCircle />
               </span>
               <span className="px-1">Job Description</span>
            
           </NavLink>
   )}
   </div>
   <div>
    {hasPermission("view_title") && (
       <NavLink to={"projectTitle"} className={({ isActive }) =>
        `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
          isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
        }`
      }>
              
                <span className="px-2">
                  <BiCircle />
                </span>
                <span className="px-1">Job Title</span>
              
            </NavLink>

    )}
  
   </div>
   <div>
    {hasPermission("view_skills") && (
       <NavLink to={"jobskill"}  className={({ isActive }) =>
        `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
          isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
        }`
      }>
             
                <span className="px-2">
                  <BiCircle />
                </span>
                <span className="px-1">Skills</span> 
            </NavLink>
    )}
  
   </div>
       <div>
        {hasPermission("view_certification") && (
           <NavLink to={"certification"}  className={({ isActive }) =>
       `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
         isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
       }`
     }>
             
               <span className="px-2">
                 <BiCircle />
               </span>
               <span className="px-1">Certification</span>
           
           </NavLink>

        )}
  
   </div>
   <div>
    {hasPermission("view_department") && (
      <NavLink to={"department"}  className={({ isActive }) =>
        `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
          isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
        }`
      }>
              
                <span className="px-2">
                  <BiCircle />
                </span>
                <span className="px-1">Department</span>
             
            </NavLink>

    )}
   
   </div>
  
   <div>
    {
      hasPermission("view_qualification") && (
        <NavLink to={"qualification"}  className={({ isActive }) =>
          `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
            isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
          }`
        }>
               
                  <span className="px-2">
                    <BiCircle />
                  </span>
                  <span className="px-1">Qualification</span>
              </NavLink>
      )
    }
  
   </div>
   <div>
    {hasPermission("view_qualification") && (
       <NavLink to={"subqualification"} className={({ isActive }) =>
        `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
          isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
        }`
      }>
             
                <span className="px-2">
                  <BiCircle />
                </span>
                <span className="px-1">Specialization</span>
            
            </NavLink>

    )}
  
   </div>
   {
    hasPermission("add_offerletter") && (
      <NavLink to={"offerletter"}  className={({ isActive }) =>
        `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
          isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
        }`
      }>
        
            <span className="px-2">
              <BiCircle />
            </span>
            <span className="px-1"> Create Offer Letter</span>
         
        </NavLink>

    )
   }
  
   <div>
    {hasPermission("view_team")&& (
      <NavLink to={"team"}  className={({ isActive }) =>
        `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
          isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
        }`
      }>
             
                <span className="px-2">
                  <BiCircle />
                </span>
                <span className="px-1">Team</span>
             
            </NavLink>

    )}
   
   </div>
   <NavLink to={"myprofile"}  className={({ isActive }) =>
       `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
         isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
       }`
     }>
         
           <span className="px-2">
             <BiCircle />
           </span>
           <span className="px-1">My Profile</span>
         
       </NavLink>
       <div>
        {(roles == "admin" || roles == "Admin") && (
          <NavLink to={"rolesandpermission"}  className={({ isActive }) =>
            `px-2 m-1 ml-6 flex  py-[2px] rounded-lg delay-100 duration-100 items-center ${
              isActive ? "bg-gradient-to-r from-blue-100 to-blue-200 text-black" : "hover:bg-[#22769b]"
            }`
          }>
           
              <span className="px-2">
                <BiCircle />
              </span>
              <span className="px-1">Roles & Permission</span>
           
          </NavLink>

        )}
         
           
        
       </div>

     </div>

   ) : null}
  
 </div>

       
      </div>
    </div>
  );
};

export default SideBar;