import Card from "../../../components/card";
import { Hash } from "../../../constants";
import { isPDF } from "../../../utils/isPdf";
import { truncateText } from "../../../utils/truncate-text";
import { useBeritaData } from "../../home/hooks/useBeritaData";
import { useInformasiDetail } from "../hooks/useInformasiDetail";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../hooks/useQuery";
import gedungBbwss8 from "../../../assets/Gedungbws.jpeg";

const DetailInformasi = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");
  const { beritaData } = useBeritaData();
  const informasiDetail = useInformasiDetail(id);

  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[400px] object-cover"
        src={gedungBbwss8}
        alt="Gedung BBWS Sumatera 8"
      />

      <section className="flex flex-col lg:flex-row p-10">
        {informasiDetail ? (
          <div className="flex flex-col lg:flex-col w-full justify-center mx-6  lg:mx-12 ">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {informasiDetail.title}
            </h1>

            <div className="flex justify-between items-center text-gray-600 text-sm mb-6">
              <span>{informasiDetail.location}</span>
              <span>
                {new Date(informasiDetail.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>

            {isPDF(informasiDetail.url) ? (
              <iframe
                src={informasiDetail.url}
                title="PDF Viewer"
                width="100%"
                className="h-screen max-h-[600px]"
                style={{ border: "none" }}
              />
            ) : (
              <img
                src={informasiDetail.url}
                alt={"photo"}
                className="w-full max-h-[600px] object-cover rounded-t-md"
              />
            )}

            <article className="leading-relaxed mt-5">
              <div
                dangerouslySetInnerHTML={{
                  __html: informasiDetail.description,
                }}
              />
            </article>
          </div>
        ) : (
          <p>Loading peraturan data...</p>
        )}

        {beritaData.length >= 1 && (
          <div className="flex flex-col space-y-5 border border-indigo rounded-sm mx-auto lg:w-1/3 w-full h-fit">
            <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">
              Berita Terkini
            </h1>
            <div className="flex flex-col ">
              {beritaData.map((item) => (
                <Card
                  key={item.id}
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
                      alt={"berita"}
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
    </div>
  );
};

export default DetailInformasi;
