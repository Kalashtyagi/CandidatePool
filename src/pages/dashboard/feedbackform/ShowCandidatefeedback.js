import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import CustomNoDataComponent from "../../../components/TableMessage";

export default function ShowCandidateFeedback() {
  const [selectedOption, setSelectedOption] = useState('inhouse');
  const [filterText, setFilterText] = useState('');
  const [allMrfData, setAllMrfData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [candidateData, setCandidateData] = useState([]);
  const [pidOptions, setPidOptions] = useState([]);
  const [selectedPid, setSelectedPid] = useState("");
  const [selectedMRF, setSelectedMRF] = useState("");
  const [searchFilterData, setSearchFilterData] = useState([]);
  const [defaultMRF, setDefaultMRF] = useState("");

  const navigate = useNavigate();

  const jsonData = JSON.parse(localStorage.getItem("data"));
  const accessToken = jsonData?.access_token;
  const authorize = "Bearer " + accessToken;

  const getAllMrf = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}jobs/erf`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authorize}`
        }
      });
      if (response?.status === 200) {
        const MrfData = response?.data?.data;
        setAllMrfData(MrfData);
        setFilterData(MrfData.filter((item) => item?.job?.recruitment_type === selectedOption));
        setDefaultMRF(filterData[0]?.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMrf();
  }, []);

  const getFilterData = () => {
    const filter = allMrfData.filter((item) => item?.job?.recruitment_type === selectedOption);
    setFilterData(filter);
  };

  useEffect(() => {
    getFilterData();
  }, [selectedOption]);

  const searchInput = () => {
    const filter = candidateData.filter((item) => item.Name && item.Name.toLowerCase().includes(filterText.toLowerCase()));
    setSearchFilterData(filter);
  };


  const getPid = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}erf-list/onsite`, {
        headers: {
          Authorization: `${authorize}`,
          "Content-Type": "application/json"
        }
      });

      if (response?.status === 200) {
        const filterPid = response?.data?.data.filter(item => item.recruitment_type === "onsite");
        setPidOptions(filterPid);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedOption === "onsite") {
      getPid();
    }
  }, [selectedOption]);

  const transformCandidateData = (data) => {
    const transformedData = [];
    data?.forEach(candidate => {
      candidate?.Feedback?.forEach(feedback => {
        transformedData.push({
          ...candidate,
          FeedbackStatus: feedback?.FeedbackStatus,
          FeedbackRemarks: feedback?.FeedbackRemarks
        });
      });
    });
    return transformedData;
  };

  const searchCandidates = async () => {
    try {
      let apiUrl = `${process.env.REACT_APP_API_URL}feedback/mrf`;
      const mrfId = selectedMRF || defaultMRF;

      if (mrfId) {
        apiUrl += `/${mrfId}`;
      }
      const searchApiData = await axios.get(apiUrl, {
        headers: {
          Authorization: `${authorize}`
        }
      });

      if (searchApiData?.status === 200) {
        const apiResponse = searchApiData?.data?.data;
        const transformedData = transformCandidateData(apiResponse);
        setCandidateData(transformedData);
        setSearchFilterData(transformedData);
      } else {
        setCandidateData([]);
      }
    } catch (error) {
      console.log(error);
      setCandidateData([]);
    }
  };

  useEffect(() => {
    if (defaultMRF || selectedMRF) {
      searchCandidates();
    }
  }, [selectedMRF]);

  const tableHeading = [
    {
      name: "S. No.",
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: "Name",
      selector: (row) => (
        <button
          className="text-blue-700 hover:text-blue-900"
          onClick={() => navigate(`/admin/candidateProfile/${row.Id}`)}
        >
          {row?.JobApplicationName}
        </button>
      ),
      sortable: true,
    },
    {
      name: "Stage",
      selector: (row) => row?.FeedbackStatus,
      sortable: true,
    },
    {
      name: "FeedbackRemarks",
      selector: (row) => row?.FeedbackRemarks,
      sortable: true,
    },
  ];

  useEffect(() => {
    document.title = "CIPLCRM | Feedback";
  }, []);

  const handleSelectedMRF = (e) => {
    setSelectedMRF(e.target.value);
  };

  return (
    <div>
      <ToastContainer position="top-right" />
      <div className="min-h-screen p-6 bg-gradient-to-r from-blue-100 to-blue-200">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Candidate Feedback</h1>
        </div>
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow-lg">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="inhouse"
                checked={selectedOption === 'inhouse'}
                onChange={() => setSelectedOption('inhouse')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="text-lg font-semibold text-gray-700">Inhouse</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="onsite"
                checked={selectedOption === 'onsite'}
                onChange={() => setSelectedOption('onsite')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="text-lg font-semibold text-gray-700">Onsite</span>
            </label>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search..."
                className="p-2 border border-gray-300 rounded shadow-sm"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
              />
              <button
                onClick={searchInput}
                className="p-2 bg-[#103f59] text-white rounded shadow"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        {selectedOption === "inhouse" && (
          <div>
            <select
              className="mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
              onChange={handleSelectedMRF}
            >
              <option value="">Please select MRF</option>
              {filterData.map((item) => (
                <option key={item.id} value={item.id}>{item.M_id ?? item.id}</option>
              ))}
            </select>
          </div>
        )}
        {selectedOption === 'onsite' && (
          <div>
            <select
              className="mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
              onChange={(e) => setSelectedPid(e.target.value)}
            >
              <option value="">Please select PId</option>
              {pidOptions.map((item) => (
                <option key={item.pid} value={item.pid}>{item.pid}</option>
              ))}
            </select>
            <select
              className="mb-2 ml-10 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
              onChange={handleSelectedMRF}
            >
              <option value="">Please select MRF</option>
              {filterData.filter((item) => item?.job?.pid === selectedPid).map((item) => (
                <option value={item.id} key={item.id}>
                  {item.M_id ?? item.id}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <DataTable
            columns={tableHeading}
            data={searchFilterData}
            pagination
            highlightOnHover
            className="w-full"
            noDataComponent={<CustomNoDataComponent data={"There's no Candidate Feedback Found"} />}
          />
        </div>
      </div>
    </div>
  );
}
