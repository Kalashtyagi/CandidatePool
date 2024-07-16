import React from "react";
import { useNavigate } from "react-router";


const BackButton = ({route}) =>{
    const navigate = useNavigate();
    return(
        <>
        <button onClick={()=>navigate(route)}
            type="button"
            className="top-4 right-4 flex items-center justify-center px-5 py-2 text-sm text-white transition-colors duration-200 bg-[#103f59] border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-[#103f59] dark:bg-[#103f59] cursor-pointer">    
            <svg className="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Go back</span>  
        </button>
        </>
    )
}


export default BackButton;