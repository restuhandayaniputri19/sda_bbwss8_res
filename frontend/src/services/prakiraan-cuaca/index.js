export const getPrakiraanCuaca = async () => {
  const API2_BASE_URL = import.meta.env.VITE_API2_BASE_URL || '/balai/bbwssumatera8/api2';
  
  const response = await fetch(`${API2_BASE_URL}/prakiraan`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log("Data yang diterima dari API:", data); // Debug log untuk melihat data yang diterima
  
  // Kita bungkus dalam object 'data' agar konsisten 
  // dengan ekspektasi 'response.data' di komponen React Anda
  return { data }; 
};
