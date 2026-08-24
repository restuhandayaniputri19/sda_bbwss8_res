import { Button } from "../../../components/button";
import Card from "../../../components/card";
import CustomPagination from "../../../components/pagination";
import { Hash } from "../../../constants";
import { Input } from "../../../components/input";
import { truncateText } from "../../../utils/truncate-text";
import { useBeritaData } from "../../home/hooks/useBeritaData";
import { useNavigate } from "react-router-dom";
import { usePetaGeospasialData } from "../hooks/usePetaGeospasialData";
import { useState } from "react";
import SpatialMap from "../../../components/spatial-map";
import bannerGeoportal from "../../../assets/5.png";

const PetaGeospasial = () => {
  const navigate = useNavigate();
  const { beritaData } = useBeritaData();
  const { petaGeospasialData, setParams, params, paginationInfo } =
    usePetaGeospasialData();

  const [keyword, setKeyword] = useState("");
  const [geoportalDialog, setGeoportalDialog] = useState(false);

  const handlePageChange = (page) => {
    setParams({
      ...params,
      page: page,
    });
  };

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = () => {
    setParams({
      ...params,
      search: keyword,
    });
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop(); // Set filename from URL
    link.target = "_blank"; // Ensure it opens in a new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the link
  };

  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[400px] object-cover"
        src={bannerGeoportal}
        alt="embung konservasi kayu agung geoportal"
      />

      <section className="p-10">
        <h1 className="text-2xl text-indigo font-bold">Peta Geoportal</h1>
      </section>

      <div className="flex w-full gap-4 items-center px-10 pb-5">
        <Input
          variant={"default"}
          fieldSize={"default"}
          type={"text"}
          placeholder={"Cari Peta Geoportal"}
          onChange={handleChangeKeyword}
        />
        <Button
          onClick={handleSearch}
          className="bg-indigo text-white rounded-lg px-6 py-3 hover:bg-blue-950"
        >
          Cari
        </Button>
      </div>

      <section className="flex flex-col lg:flex-row gap-10 px-10 pb-10">
        <div
          className={`container mx-auto py-8 ${
            beritaData >= 1 ? "lg:w-3/4" : " w-full "
          }`}
        >
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {petaGeospasialData?.map((item, index) => (
              <div
                key={index}
                className="flex justify-center md:basis-1/3 lg:basis-1/4 px-2 py-7"
              >
                <div className="max-w-xs rounded-lg shadow-md border border-gray-300">
                  {/* Card Header */}
                  <div className="relative bg-gray-200 rounded-t-lg h-64">
                    {/* Icon Buttons (example placeholders) */}
                    <div className="absolute top-2 right-2 flex space-x-2 z-10">
                      {/* Info Button */}
                      <button className="bg-white p-1 rounded-full shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                          />
                        </svg>
                      </button>
                      {/* Download Button */}
                      <button
                        className="bg-white p-1 rounded-full shadow-md"
                        onClick={() => handleDownload(item.url)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                          />
                        </svg>
                      </button>
                    </div>
                    <div onClick={() => setGeoportalDialog(item.url)}>
                      <SpatialMap
                        zipData={item.url}
                        width="300px"
                        height="256px"
                        dragging={false} // Disable dragging
                        scrollWheelZoom={false} // Disable scroll wheel zoom
                        doubleClickZoom={false} // Disable double-click zoom
                        zoomControl={false} // Hide zoom control buttons
                      />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div
                    className="p-4"
                    onClick={() => setGeoportalDialog(item.url)}
                  >
                    <p className="text-sm text-gray-500">{item.location}</p>
                    <p
                      className="text-lg font-semibold text-gray-900"
                      dangerouslySetInnerHTML={{
                        __html: truncateText(item.title, 100),
                      }}
                    ></p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {paginationInfo.totalPages > 1 && (
            <CustomPagination
              currentPage={paginationInfo.currentPage}
              totalPageCount={paginationInfo.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {beritaData.length >= 1 && (
          <div className="flex flex-col space-y-5 border border-indigo rounded-sm mx-auto lg:w-1/3 w-full h-fit">
            <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">
              Berita Terkini
            </h1>
            <div className="flex flex-col ">
              {beritaData.map((item, index) => (
                <Card
                  key={index}
                  shadow={true}
                  rounded={true}
                  className="transition-transform transform hover:scale-95 hover:shadow-lg cursor-pointer"
                  onClick={() =>
                    navigate(`/berita?id=${item.id}${Hash.DETAIL}`)
                  }
                >
                  <div className="flex p-2">
                    <img
                      src={item.img}
                      alt={"photo"}
                      className="h-36 w-36 object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <h1 className="text-md text-indigo">
                        {truncateText(item.title, 100)}
                      </h1>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>

      {geoportalDialog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setGeoportalDialog(null)}
        >
          <div className="flex w-full justify-center bg-white p-10 m-10 rounded-md">
            <SpatialMap zipData={geoportalDialog} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PetaGeospasial;
