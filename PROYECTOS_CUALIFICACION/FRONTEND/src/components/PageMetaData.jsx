import { Helmet } from "react-helmet-async";
const PageMetaData = ({
  title
}) => {
  return <Helmet>
      <title> {title} | Nautiagro </title>
    </Helmet>;
};
export default PageMetaData;