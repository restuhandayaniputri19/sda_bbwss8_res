import { Button } from "../../../components/button";
import Card from "../../../components/card";
import CustomPagination from "../../../components/pagination";
import { Hash } from "../../../constants";
import { Input } from "../../../components/input";
import { isPDF } from "../../../utils/isPdf";
import { truncateText } from "../../../utils/truncate-text";
import { useBeritaData } from "../../home/hooks/useBeritaData";
import { useInformasiData } from "../hooks/useInformasiData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const BeritaTerkini = () => {
  const navigate = useNavigate();
  const { beritaData } = useBeritaData();
  const { informasiData, setParams, params, paginationInfo } =
    useInformasiData();
  const [keyword, setKeyword] = useState("");

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

  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[400px] object-cover"
        src="https://mediabbwssviii.sgp1.cdn.digitaloceanspaces.com/image/bendung%20perjaya.jpg"
        alt="bendungan perjaya"
      />

      <section className="p-10">
        <h1 className="text-2xl text-indigo font-bold">Informasi</h1>
      </section>

      <div className="flex w-full gap-4 items-center px-10 pb-5">
        <Input
          variant={"default"}
          fieldSize={"default"}
          type={"text"}
          placeholder={"Cari Informasi"}
          onChange={handleChangeKeyword}
        />
        <Button
          onClick={handleSearch}
          className="bg-indigo text-white rounded-lg px-6 py-3 hover:bg-blue-950"
        >
          Cari
        </Button>
      </div>

      <section className="flex flex-col lg:flex-row gap-10 px-10 mb-10">
        <div className="container mx-auto py-8 w-full lg:w-3/4">
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {informasiData.map((item, index) => (
              <Card
                key={index}
                shadow={true}
                rounded={true}
                className="transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                {isPDF(item.url) ? (
                  <iframe
                    src={item.url}
                    title="PDF Viewer"
                    className="w-full h-[200px] object-cover rounded-t-md"
                    style={{ border: "none" }}
                  />
                ) : (
                  <img
                    src={item.url}
                    alt="photo"
                    className="w-full h-[200px] object-cover rounded-t-md"
                  />
                )}
                <div className="p-4 space-y-2">
                  <h1 className="text-xl text-indigo">
                    {truncateText(item.title, 60)}
                  </h1>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: truncateText(item.description, 220),
                    }}
                    className="text-sm text-justify"
                  ></p>
                  <div className="flex justify-end">
                    <Button
                      className="bg-indigo text-white rounded-lg px-6 py-3 hover:bg-blue-950"
                      onClick={() =>
                        navigate(`/informasi?id=${item.id}${Hash.DETAIL}`)
                      }
                    >
                      Selengkapnya
                    </Button>
                  </div>
                </div>
              </Card>
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

        <div className="flex flex-col space-y-5 border border-indigo rounded-sm mx-auto lg:w-1/3 w-full h-fit">
          <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">
            Berita Terkini
          </h1>
          <div className="flex flex-col gap-5">
            {beritaData.map((item, index) => (
              <Card
                key={index}
                shadow={true}
                rounded={true}
                className="transition-transform transform hover:scale-95 hover:shadow-lg cursor-pointer"
                onClick={() => navigate(`/berita?id=${item.id}${Hash.DETAIL}`)}
              >
                <div className="flex p-2">
                  <img
                    src={item.img}
                    alt="photo"
                    className="h-36 w-36 object-cover rounded-md"
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
      </section>
    </div>
  );
};

export default BeritaTerkini;