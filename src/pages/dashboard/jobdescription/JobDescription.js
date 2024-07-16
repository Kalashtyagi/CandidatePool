import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillPlusCircle } from "react-icons/ai";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Circles } from "react-loader-spinner";
import { hasPermission } from "../../../components/HasPermission";

const JobDescription = () => {
  const datatoken = localStorage.getItem("data");
  const [loading, setLoading] = useState(false);
  const jsonData = JSON.parse(datatoken);
  const accessToken = jsonData?.access_token;
  const authorize = "Bearer" + " " + accessToken;

  const tableHeading = [
    {
      name: "Designation",
      selector: (row) => (
        <strong style={{ cursor: "pointer" }}>
          <Link to={`/admin/jd/${row.id}`}>{row.designation}</Link>
        </strong>
      ),
    },
    {
      name: "Job Type",
      selector: (row) => row.job_type,
    },
  ];

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [databack, setDataback] = useState([]);

  useEffect(() => {
    setLoading(true);
    document.title = "CIPLCRM | Job Description";

    axios
      .get(
        `${process.env.REACT_APP_API_URL}jd`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authorize}`,
          },
        }
      )
      .then((res) => {
        setData(res.data.data);
        setDataback(res.data.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      }     
      );
  },
  
  []);

  const handleSearch = (e) => {
    setData(
      databack.filter((ele) =>
        ele.designation.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );

    if (e.target.value.length <= 1) {
      setData(databack);
    } 
   
  };

  return (
    <>
        <div className='overflow-y-auto h-screen scrollbar-custom'>  

      <section>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        {hasPermission("add_jd") && (
          <button className="px-2 flex justify-end bg-gray-800 hover:bg-slate-700 text-white m-2 py-2 items-center ml-4 rounded">
          <span className="px-1">
            <AiFillPlusCircle />
          </span>
          <Link to={"/admin/AddJobDescription"}>Add Job Description</Link>
        </button>

        )}
        

        </div>


        <div className="mt-4 px-4 border border-gray-800 border-t-4 bg-white mx-4">
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="py-3 flex justify-end pr-2">            

                <div className="relative max-w-xs flex items-center justify-end">
                  <label htmlFor="hs-table-search" className="px-2">
                    Search:
                  </label>
                  <input
                    type="text"
                    className="block w-full p-3 border text-sm border-gray-300 rounded-md "
                    placeholder="Search..."
                    onChange={handleSearch}
                  />
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Circles color="#00BFFF" height={80} width={80} />
                </div>
              ) : (
                <div className="lg:p-1.5 mb-4 pt-2 w-full inline-block align-middle">
                  <div className="overflow-hidden border rounded-lg">
                    <DataTable columns={tableHeading} data={data} pagination />
                  </div>
                </div>  
              )}
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default JobDescription;
