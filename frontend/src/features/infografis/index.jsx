import { useEffect, useState } from "react";

import DropdownSelect from "../../components/select";
import PhotoCard from "../../components/photo-card";
import { getInfoGrafis } from "../../services/infografis/api";
import bendungPerjaya from "../../assets/11.png";


const InfografisPage = () => {
  const [data, setData] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [infografisMonths, setInfografisMonths] = useState([]);

  // Extract unique months for infographics dropdown
  const getUniqueMonths = (infografis) => {
    const months = infografis.map((item) => {
      const date = new Date(item.createdAt);
      return date.toLocaleString("default", { month: "long", year: "numeric" });
    });
    return Array.from(new Set(months));
  };

  useEffect(() => {
    const fetchInfografis = async () => {
      try {
        const response = await getInfoGrafis(); // Wait for the API call to resolve

        if (response && Array.isArray(response.data)) {
          setData(response.data); // Extract the data field
          setInfografisMonths(getUniqueMonths(response.data));
        } else {
          console.error("Expected an array but got:", response);
        }
      } catch (error) {
        console.error("Error fetching infografis data:", error);
      }
    };

    fetchInfografis();
  }, []);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Filter infographics by selected month, if a month is selected
  const filteredInfografis = selectedMonth
    ? data.filter((item) => {
        const itemDate = new Date(item.createdAt);
        const monthYear = itemDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        return selectedMonth === "all" || monthYear === selectedMonth;
      })
    : data;

  const handleImageClick = (src) => {
    setFullScreenImage(src);
  };

  const handleFullScreenClose = () => {
    setFullScreenImage(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[50vh] md:h-[60vh] object-cover"
        src={bendungPerjaya}
        alt="Call center picture"
      />
      <section className="p-10">
        <h1 className="text-2xl font-bold text-indigo mb-6">Infografis</h1>

        {/* Month Dropdown */}
        <DropdownSelect
          className="w-[200px] p-2 border rounded-md mb-5"
          data={[
            { value: "all", label: "All Months" },
            ...infografisMonths.map((month) => ({
              value: month,
              label: month,
            })),
          ]}
          defaultValue="all"
          name="monthSelect"
          placeholder="Select a month"
          emptyState="No months available"
          onChange={handleMonthChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInfografis.map((item, index) => (
            <PhotoCard
              key={index}
              src={item.url}
              onImageClick={handleImageClick}
              description={item.description}
              date={item.date}
            />
          ))}
        </div>

        {fullScreenImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={handleFullScreenClose}
          >
            <img
              src={fullScreenImage}
              className="max-w-full max-h-full"
              alt="Full Screen"
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default InfografisPage;
