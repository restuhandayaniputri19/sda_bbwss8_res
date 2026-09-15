export const getPrakiraanCuaca = async () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/balai/bbwssumatera8/api';
  
  const response = await fetch(`${API_BASE_URL}/api/prakiraan`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log("Data yang diterima dari API:", data); // Debug log untuk melihat data yang diterima
  
  // Kita bungkus dalam object 'data' agar konsisten 
  // dengan ekspektasi 'response.data' di komponen React Anda
  return { data }; 
};
