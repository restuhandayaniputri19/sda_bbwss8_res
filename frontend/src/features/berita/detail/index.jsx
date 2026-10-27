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
          <div className="flex flex-col w-full px-6 py-8 lg:px-12 bg-gray-50 rounded-lg">
            <div className="w-full">
              {/* Title */}
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {beritaDetail.title}
              </h1>

              {/* Article Meta */}
              <div className="flex justify-between items-center text-gray-600 text-sm mb-6">
                <span>{beritaDetail.location}</span>
                <span>
                  {new Date(beritaDetail.createdAt).toLocaleDateString(
                    "id-ID",
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
                  className="w-full object-cover rounded-md"
                />
              </div>

              {/* Article Content */}
              <article className="leading-relaxed text-gray-800">
                <div
                  dangerouslySetInnerHTML={{
                    __html: beritaDetail.description,
                  }}
                />
              </article>

              {/* ========================================================= */}
              {/* GALERI FOTO TERKAIT BERITA (Ditampilkan jika ada data)   */}
              {/* ========================================================= */}
              {beritaDetail.galleries && beritaDetail.galleries.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span>Galeri Foto</span>
                    <span className="text-sm font-normal text-gray-500">
                      ({beritaDetail.galleries.length} Foto)
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {beritaDetail.galleries.map((galleryItem, idx) => (
                      <div
                        key={galleryItem.id || idx}
                        className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={galleryItem.url}
                          alt={galleryItem.description || `Galeri Foto ${idx + 1}`}
                          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {galleryItem.description && (
                          <div className="p-3 text-xs text-gray-600 bg-white border-t border-gray-100">
                            {galleryItem.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sidebar Berita Terkini */}
        <div className="flex flex-col space-y-5 border border-indigo rounded-sm mx-auto lg:w-1/3 w-full h-fit">
          <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">
            Berita Terkini
          </h1>
          <div className="flex flex-col">
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