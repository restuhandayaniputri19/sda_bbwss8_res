import { useEffect, useState } from "react";
import { getPR } from "../../services/pola-rencana/api";

const PolaPdf = () => {
  const [polaRencana, setPolaRencana] = useState(null);

  useEffect(() => {
    const fetchPolaRencana = async () => {
      try {
        const response = await getPR();
        setPolaRencana(response.data);
      } catch (error) {
        console.error("Error fetching Pola Rencana data:", error);
      }
    };

    fetchPolaRencana();
  }, []);

  return (
    <div className="px-10 pb-16">
      {polaRencana ? (
        <iframe
          src={polaRencana.pdf}
          title="PDF Viewer"
          width="100%"
          height="100%"
          className="h-screen"
          style={{ border: "none" }}
        />
      ) : (
        <p>Loading Pola Rencana data...</p>
      )}
    </div>
  );
};

export default PolaPdf;