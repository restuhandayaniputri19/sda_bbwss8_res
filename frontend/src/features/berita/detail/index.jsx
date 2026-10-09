import Card from "../../../components/card";
import { Hash } from "../../../constants";
import bendungan from "../../../assets/bendungan-DpmE5Nca.jpeg";
import { truncateText } from "../../../utils/truncate-text";
import { useBeritaData } from "../../home/hooks/useBeritaData";
import { useBeritaDetail } from "../hooks/useBeritaDetail";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../hooks/useQuery";

const DetailBerita = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");
  const { beritaData } = useBeritaData();
  const beritaDetail = useBeritaDetail(id);

  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[400px] object-cover"
        src={bendungan}
        alt="Bendungan"
      />

      <section className="flex flex-col lg:flex-row p-10 gap-6">
        {beritaDetail && (
          <div className="flex flex-col lg:flex-row w-full justify-center px-6 py-8 lg:px-12 bg-gray-50">
            <div className="lg:w-3/4 w-full">
              {/* Title */}
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {beritaDetail.title}
              </h1>

              {/* Article Meta */}
              <div className="flex justify-between items-center text-gray-600 text-sm mb-6">
                <span>{beritaDetail.location}</span>
                <span>
                  {new Date(beritaDetail.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>

              {/* Main Image */}
              <div className="mb-10">
                <img
                  src={beritaDetail.img}
                  alt="article visual"
                  className="w-full h-[450px] lg:h-[550px] object-cover rounded-md"
                />
              </div>

              {/* Article Content */}
              <article className="leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{
                    __html: beritaDetail.description,
                  }}
                />
              </article>
            </div>
          </div>
        )}

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
                onClick={() => navigate(`/berita?id=${item.id}${Hash.DETAIL}`)}
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
      </section>
    </div>
  );
};

export default DetailBerita;
