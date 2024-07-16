import React, { useEffect, useState } from "react";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import DashBoardModal from "../../components/element/DashBoardModal";
// import { DASHBOARD_LINKS } from "../../lib/consts/Dashboard";
import axios from "axios";
import { BsFiles,BsBookmarkCheck } from 'react-icons/bs'
import {FaUserPlus,FaChartPie, FaUsers, FaDatabase,FaHandshake,FaUsersSlash} from 'react-icons/fa'
import {IoMdCloseCircle, IoMdSearch, IoMdCheckmarkCircleOutline, IoMdVideocam} from 'react-icons/io'
import { Form, useNavigate } from "react-router-dom";
import { DashboardInsights } from "../../Services/CandidateServices";

const Dashboard = () => {
    const [showModal,setShowModal] = useState(false)
    const [data,setData] = useState('')

const navigate = useNavigate()

const localData = JSON.parse(localStorage.getItem('data'))


const getDashboardInsights = async () =>{
  const res = await  DashboardInsights();
  setData(res?.data?.data);
}



useEffect(()=>{
  document.title="CIPLCRM | Dashboard"
  getDashboardInsights();
},[])

const DASHBOARD_LINKS = [
  {
    number:data?.TotalProject?data?.TotalProject:0,
    title:"Total Project",
    key:'view_jobs',
    icon:<FaDatabase className="lg:text-6xl text-gray-500"/>,
    cardBackgroundColor:'bg-white ',
    buttonColor:'bg-sky-600 delay-100 duration-100',
    buttonHoverColor:'hover:bg-cyan-500',
    link:'/admin/newerf'
  },
  {
    number:data?.TotalCandidate?data?.TotalCandidate:0,
    title:"Total Candidates",
    key:'add_candidate',
    icon:<FaUserPlus className="lg:text-7xl text-[#ec4899]"/>,
    cardBackgroundColor:'bg-white hover:bg-cyan-800 duration-100 delay-100',
    buttonColor:'bg-sky-600 delay-100 duration-100',
    buttonHoverColor:'hover:bg-cyan-500',
    link:'/admin/candidatePool'
  },

    {
      number:data?.ShortlistedCandidate?data?.ShortlistedCandidate:0,
      title:"Shortlisted Candidate",
      key:'view_candidate',
      icon:<BsBookmarkCheck className="lg:text-6xl text-[#0d9488]"/>,
      cardBackgroundColor:'bg-white',
      buttonColor:'bg-sky-600',
      buttonHoverColor:'hover:bg-[#a67f0a]',
      link:'/admin/candidatePool',
      data:'total'
    },
    {
      number:data?.TotalHired?data?.TotalHired:0,
      title:"Total Hired",
      key:'add_candidate',
      icon:<FaHandshake className="lg:text-7xl text-[#fbbf24]"/>,
      cardBackgroundColor:'bg-white',
      buttonColor:'bg-sky-600',
      buttonHoverColor:'hover:bg-[#147d5e]',
      link:'/admin/onboard',
      data:'hired'
    },
    {
      number:data?.RejectedCandidate?data?.RejectedCandidate:0,
      title:"Rejected Candidate",
      key:'add_candidate',
      icon:<FaUsersSlash className="lg:text-7xl text-red-500"/>,
      cardBackgroundColor:'bg-white',
      buttonColor:'bg-sky-600',
      buttonHoverColor:'hover:bg-[#8f252f]',
      link:'/admin/candidatePool',
      data:'rejected'
    },

    {
      number:data?.["Interview 1"],
      title:"Interview Round 1",
      key:'view_schedule',
      icon:<IoMdVideocam className="lg:text-7xl text-[#2dd4bf]"/>,
      cardBackgroundColor:'bg-white',
      buttonColor:'bg-sky-600',
      buttonHoverColor:'hover:bg-[#500fba]',
      link:'/admin/interviewschedule',
      data:'interview round 1'
    },
    {
      number:data?.["Interview 1 Clear"],
      title:"Interview Round 1 Clear",
      key:'view_schedule',
      icon:<IoMdCheckmarkCircleOutline className="lg:text-7xl text-[#4d7c0f]"/>,
      cardBackgroundColor:'bg-white',
      buttonColor:'bg-sky-600',
      buttonHoverColor:'hover:bg-[#500fba]',
      link:'/admin/interviewschedule',
      data:'interview round 1 Clear'
    },
    {
      number:data?.["Interview 1 Rejected"],
      title:"Interview Round 1 Rejected",
      key:'view_schedule',
      icon:<IoMdCloseCircle className="lg:text-7xl text-[#f87171]"/>,
      cardBackgroundColor:'bg-white',
      buttonColor:'bg-sky-600',
      buttonHoverColor:'hover:bg-[#500fba]',
      link:'/admin/candidatePool',
      data:'interview round 1 Rejected'
    },
    {
      number:data?.["Interview 2"],
      title:"Interview Round 2",
      key:'view_schedule',
      icon:<IoMdVideocam className="lg:text-7xl text-[#2dd4bf]"/>,
      cardBackgroundColor:'bg-white',
      buttonColor:'bg-sky-600',
      buttonHoverColor:'hover:bg-[#b05910]',
      link:'/admin/interviewschedule',
      data:'interview round 2'
    },
    {
      number:data?.["Interview 2 Clear"],
      title:"Interview Round 2 Clear",
      key:'view_schedule',
      icon:<IoMdCheckmarkCircleOutline className="lg:text-7xl text-[#4d7c0f]"/>,
      cardBackgroundColor:'bg-white',
      buttonColor:'bg-sky-600',
      buttonHoverColor:'hover:bg-[#b05910]',
      link:'/admin/candidatePool',
      data:'interview round 2'
    },
    {
      number:data?.["Interview 2 Rejected"],
      title:"Interview Round 2 Rejected",
      key:'view_schedule',
      icon:<IoMdCloseCircle className="lg:text-7xl text-[#f87171]"/>,
      cardBackgroundColor:'bg-white',
      buttonColor:'bg-sky-600',
      buttonHoverColor:'hover:bg-[#b05910]',
      link:'/admin/candidatePool',
      data:'interview round 2',
    },
    
]
  return (
    <>
    {
        showModal? <DashBoardModal showModal={showModal} setShowModal={setShowModal}/>: null
    }
      <div className="lg:px-4 mt-4 lg:py-0 py-2 px-2 w-full ">
        <div className="grid  grid-cols-2 lg:gap-4 gap-2 lg:grid-cols-4 ">
          {/* {DASHBOARD_LINKS &&
            DASHBOARD_LINKS.filter((x)=>localData?.data?.userPermissions?.find(y=>y?.includes(x?.key))).map((dashboard, index) => ( */}
            {DASHBOARD_LINKS?.map((dashboard,index)=>(
               <div
               key={index}
               className={`w-full flex shadow flex-col h-36 bg-white group  rounded-lg`}
             >
               <div className="lg:p-4 p-2 flex-1 items-center group-hover:bg-sky-200 group-hover:opacity-300 justify-between rounded-lg">
                 <div className="lg:flex items-center justify-between">
                   <div className="text-black group-hover:text-sky-900 lg:text-left text-center h-24">
                     <span className="block lg:text-4xl lg:text-left text-center text-4xl font-bold py-1">
                       {dashboard.number}
                     </span>
                     <span className="text-sm text- groublackp-hover:text-sky-800 lg:py-1 py-0 lg:text-left text-center">{dashboard.title}</span>
                   </div>
                   <div className="lg:block hidden cursor-pointer ">{dashboard.icon}</div>
                 </div>
               </div>
               <button
               onClick={()=>navigate(dashboard?.link,{state:dashboard?.data})}
                 className={`flex rounded-b-lg text-white justify-center bg-sky-600 hover:bg-sky-700  w-full items-center`}
               >
                 <span className="px-2">More info </span>
                 <span>
                   <BsArrowRightCircleFill />
                 </span>
               </button>
             </div>

            ))}
             
            {/* ))} */}
        </div>
      </div>
    </>
  );
};
export default Dashboard;

