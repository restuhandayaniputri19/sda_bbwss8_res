
export const getPrakiraanCuaca = async () => {
  const BASE_URL = 'http://localhost:3000/balai/bbwssumatera8';
  
  const response = await fetch(`${BASE_URL}/api2/prakiraan`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log("Data yang diterima dari API:", data); // Debug log untuk melihat data yang diterima
  
  // Kita bungkus dalam object 'data' agar konsisten 
  // dengan ekspektasi 'response.data' di komponen React Anda
  return { data }; 
};

