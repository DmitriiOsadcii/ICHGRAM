import axios from "axios"


const backendInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`
    
})



// export default backendInstance;


// import axios from "axios";

// const backendInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
//   withCredentials: false, // ⬅️ ОБЯЗАТЕЛЬНО false, раз не используем cookie
//   timeout: 15000,
// });

backendInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // или из redux
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default backendInstance;
