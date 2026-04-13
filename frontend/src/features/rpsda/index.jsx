import DetailPage from "./detail";
import { Hash } from "../../constants";
import ListPage from "./list";
import { useLocation } from "react-router-dom";

const DipaPage = ({ hideBanner }) => {
  const { hash } = useLocation();

  if (hash === Hash.DETAIL) {
    return <DetailPage />;
  }

  return <ListPage hideBanner={hideBanner} />;
};

export default DipaPage;
