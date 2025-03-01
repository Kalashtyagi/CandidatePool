import React from "react";
import { AiFillPlusCircle } from "react-icons/ai";

export const BREADCRUMB_LINKS = [
  {
    name: "Skills",
    showButton: true,
    path: "jobskill",
    key: "add_skills",
    buttonPath: "addskill",
    buttonTitle: "Create Skill",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Add Skills",
    showButton: false,
    path: "addskill",
    key: "add_skills",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Exam",
    showButton: true,
    path: "exam",
    key: "add_exam",
    buttonPath: "addexam",
    buttonTitle: "Add Exam",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Add Exam",
    showButton: false,
    path: "addexam",
    key: "view_exam",
    buttonPath: "addexam",
    buttonTitle: "Add Exam",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Job Category",
    showButton: true,
    path: "jobcategory",
    key: "add_category",
    buttonPath: "addcategory",
    buttonTitle: "Create New",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Add Job Category",
    showButton: false,
    path: "addcategory",
    key: "add_category",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Candidate Pool",
    showButton: true,
    path: "candidatePool",
    key: "add_candidate",
    buttonPath: "addAssignee",
    buttonTitle: "Add New Candidate",
    buttonLogo: <AiFillPlusCircle />,
  },

  // {
  //   name: "Mrf List",
  //   showButton: true,
  //   path: "mrf",
  //   key: "add_category",
  //   buttonPath: "addMrf",
  //   buttonTitle: "Add New Mrf",
  //   buttonLogo: <AiFillPlusCircle />,
  // },

  {
    name: "Job Title",
    showButton: true,
    path: "projectTitle",
    key: "add_title",
    buttonPath: "addTitle",
    buttonTitle: "Create Title",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "HOD",
    showButton: true,
    path: "hod",
    key: "add_skills",
    buttonPath: "addHod",
    buttonTitle: "Create Hod",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Add Job Title",
    showButton: false,
    path: "addTitle",
    key: "add_skills",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Project Form",
    showButton: false,
    path: "erfgenform",
    key: "add_erf",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Project List",
    showButton: false,
    path: "erf-database-archive",
    key: "view_erf",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Qualification",
    showButton: true,
    key: "add_qualification",
    path: "qualification",
    buttonPath: "addqualification",
    buttonTitle: "Add Qualification",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Add Qualification",
    showButton: false,
    path: "addqualification",
    key: "add_qualification",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Specialization",
    showButton: true,
    key: "add_qualification",
    path: "subqualification",
    buttonPath: "addsubqualification",
    buttonTitle: "Add Specialization",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Add Specialization",
    showButton: false,
    path: "addsubqualification",
    key: "add_qualification",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Department",
    showButton: true,
    key: "add_department",
    path: "department",
    buttonPath: "add-department",
    buttonTitle: "Add Deparment",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Add Department",
    showButton: false,
    key: "add_department",
    path: "add-department",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Project",
    showButton: true,
    key: "add_project",
    path: "newerf",
    buttonPath: "addProject",
    buttonTitle: "Add Project",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Add Project",
    showButton: false,
    key: "add_project",
    path: "addProject",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  },
  
  {
    name: "Team",
    showButton: true,
    path: "team",
    key: "add_team",
    buttonPath: "addteam",
    buttonTitle: "Add Team",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Add Team",
    showButton: false,
    key: "add_team",
    path: "addteam",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Question",
    showButton: true,
    path: "questions",
    key: "add_question",
    buttonPath: "addquestion",
    buttonTitle: "Add Question",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Job Applications",
    showButton: false,
    path: "jobapplication",
    key: "view_erf",
    buttonPath: "add_job_applications",
    buttonTitle: "Add Question",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Add Question",
    showButton: false,
    key: "add_team",
    path: "addquestion",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  },
  
  {
    name: "Add Interview Schedule",
    showButton: false,
    key: "add_schedule",
    path: "addinterviewschedule",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Certification",
    showButton: true,
    path: "certification",
    key: "add_certification",
    buttonPath: "addcertification",
    buttonTitle: "Add Certification",
    buttonLogo: <AiFillPlusCircle />,
  },
  {
    name: "Add Certification",
    showButton: false,
    path: "addcertification",
    key: "add_certification",
    buttonPath: "/admin",
    buttonTitle: "Home",
    buttonLogo: <AiFillPlusCircle />,
  }
]

