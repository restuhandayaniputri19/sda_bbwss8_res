    import { Button } from "../../components/button";
import callCenter from "../../assets/CallCenter.png";
import { truncateText } from "../../utils/truncate-text";
import { useTkpsda } from "./hooks/useTkpsdaData";

const Tkpsda = () => {
  const { tkpsda } = useTkpsda();
  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[400px] object-cover"
        src={callCenter}
        alt="Call center picture"
      />

      <section className="p-10">
        <h1 className="text-2xl text-indigo font-bold">TKPSDA</h1>
        <div className="flex flex-row justify-end items-center gap-4 mt-5">
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Cari TKPSDA..."
              className="block w-full px-4 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex">
            <Button className="bg-indigo text-white rounded-lg px-6 py-3 hover:bg-blue-950">
              Cari
            </Button>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-10 px-20 pb-20 pt-10">
        {tkpsda.map((item) => (
          <div className="flex flex-row bg-white shadow-md rounded-md">
            <div className="flex-1">
              <img
                src={item.img}
                alt={"photo"}
                className="w-full h-auto object-cover rounded-l-md"
              />
            </div>
            <div className="p-6 space-y-2 flex-1">
              <h1 className="text-xl text-indigo text-justify">{item.title}</h1>
              <div className="flex justify-between">
                <p>{item.location}</p>
                <p>{item.date}</p>
              </div>
              <p className="text-sm text-justify">
                {truncateText(item.description, 300)}
              </p>
              <div className="flex justify-end">
                <Button className="bg-indigo text-white rounded-lg px-6 py-3 hover:bg-blue-950">
                  Selengkapnya
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Tkpsda;
