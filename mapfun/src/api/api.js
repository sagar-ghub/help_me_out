import axios from "axios";
// http://localhost:5000/api";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

export const register = (payload) => api.post(`/register`, payload);
export const addTask = (payload) => api.post("/addTask", payload);

// export const register = async (username, email, password) => {
//   return await fetch(`${baseUrl}/register`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ username, email, password }),
//   }).then((res) => res.json());
// };

// export const addTask=async (task)=>{
//   return await fetch(`${baseUrl}/addTask`,{
//     method:"POST",
//     headers:{
//       "Content-Type":"application/json",
//     },
//     body:JSON.stringify({task}),
//   }).then((res)=>res.json());
// }

const apis = {
  register,
  addTask,
};

export default apis;
