import { ExternalLink } from "lucide-react";
import { usePrakiraanCuacaData } from "../../hooks/usePrakiraanCuacaData";

const PrakiraanCuaca = () => {
  // Ambil semua yang dibutuhkan dari hook.
  // Tidak perlu lagi membuat state atau useEffect fetch manual di sini.
  const { prakiraanCuaca, loading } = usePrakiraanCuacaData();

  const sortedItems = [...(prakiraanCuaca?.items ?? [])].sort((a, b) => {
    const aIsKota = a.lokasi.startsWith("Kota");
    const bIsKota = b.lokasi.startsWith("Kota");

    // Jika satu adalah "Kota" dan yang lain bukan, utamakan "Kota"
    if (aIsKota && !bIsKota) return -1;
    if (!aIsKota && bIsKota) return 1;

    // Jika keduanya sama-sama "Kota" atau sama-sama bukan, urutkan alfabetis biasa
    return a.lokasi.localeCompare(b.lokasi);
  });

  const formatRelativeTime = (isoString) => {
    const updatedDate = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - updatedDate.getTime()) / 1000,
    );

    if (diffInSeconds < 60) return "baru saja";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari lalu`;
  };

  return (
    <div className="flex min-h-screen flex-col p-10 gap-8">
      {/* Header */}
      <header className="w-full">
        <h1 className="text-2xl font-semibold text-indigo">Prakiraan Cuaca</h1>
        <p className="text-sm opacity-75">
          Terakhir diperbarui:{" "}
          <b>{prakiraanCuaca?.updated_at ? formatRelativeTime(prakiraanCuaca.updated_at) : "-"}</b>{" "}
          <span className="text-indigo-600 text-xs">
            (
            {prakiraanCuaca?.updated_at ? (
              <>
                {new Date(prakiraanCuaca.updated_at).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
              </>
            ) : (
              "-"
            )}
            )
          </span>
          | Sumber:{" "}
          <a
            href="https://www.bmkg.go.id/cuaca/prakiraan-cuaca/16"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            BMKG (Sumatera Selatan)
          </a>
        </p>
        <div className="border-t mt-4 border-slate-200" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Seksi Kiri: Daftar Kabupaten */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-medium opacity-80 text-slate-700">
            Wilayah Sumatera Selatan <b>{new Date(prakiraanCuaca?.updated_at).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric"})}</b>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            {loading
              ? // Skeleton sederhana saat loading
                [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-32 w-full bg-slate-100 animate-pulse rounded-lg border border-slate-200"
                  ></div>
                ))
              : sortedItems?.map((item, index) => (
                  <div
                    key={index}
                    className="card card-bordered border-rounded bg-base-100 shadow-sm border-slate-300 hover:border-indigo-400 transition-all duration-300 border-[1.5px]"
                  >
                    <div className="card-body p-4">
                      <h3 className="card-title border-b items-center border-rounded pb-2 mb-2 text-indigo-700 font-bold group">
                        <a
                          href={item.url_detail}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-indigo-900 transition-colors underline"
                        >
                          {item.lokasi}
                          <ExternalLink
                            size={14}
                            className="opacity-50 group-hover:opacity-100"
                          />
                        </a>
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        {/* Hari Ini */}
                        <div className="flex flex-col gap-1 justify-between">
                          <p className="text-xs uppercase opacity-50">
                            Hari Ini
                          </p>

                          {item.hari_ini.ikon ? (
                            <div className="flex flex-col justify-center items-center mt-1">
                              <div
                                className="w-16 h-16" // Atur ukuran container di sini
                                dangerouslySetInnerHTML={{
                                  __html: item.hari_ini.ikon,
                                }}
                                title={`${item.hari_ini.kondisi.kondisi}`}
                              />
                              <span className="text-sm">
                                {item.hari_ini.kondisi.kondisi}
                              </span>
                            </div>
                          ) : null}
                          <div className="text-xs text-slate-700">
                          <span className="">
                            {item.hari_ini.kondisi.suhu}
                          </span>
                          <span className="ms-3">
                            {item.hari_ini.kondisi.kelembapan}
                          </span>
                          </div>
                        </div>

                        {/* Besok */}
                        <div className="border-l border-slate-100 flex flex-col gap-1 justify-between">
                          <p className="text-xs uppercase opacity-50">Besok</p>

                          {item.besok.ikon ? (
                            <div className="flex flex-col justify-center items-center mt-1">
                              <div
                                className="w-16 h-16" // Atur ukuran container di sini
                                dangerouslySetInnerHTML={{
                                  __html: item.besok.ikon,
                                }}
                                title={`${item.besok.kondisi.kondisi}`}
                              />
                                <span className="text-sm">
                              {item.besok.kondisi.kondisi}</span>
                            </div>
                            
                          ) : null}
                            <div className="text-xs text-slate-700">
                          <span className="">
                            {item.besok.kondisi.suhu}
                          </span>
                          <span className="ms-3">
                            {item.besok.kondisi.kelembapan}
                          </span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </section>

        {/* Seksi Kanan: Satelit */}
        <section className="flex flex-col gap-4 sticky top-10">
          <div className="flex justify-between items-end">
            <h2 className="text-lg font-medium opacity-80 text-slate-700">
              Potensi Hujan dari Citra Satelit Himawari-9 <br />
              <span className="text-sm opacity-60 font-normal italic">
                UTC + 7 = WIB
              </span>
            </h2>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-black">
            <img
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
              src="https://inderaja.bmkg.go.id/IMAGE/HIMA/H08_RP_Region1.png"
              alt="Visualisasi Potensi Hujan"
              loading="lazy"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrakiraanCuaca;
