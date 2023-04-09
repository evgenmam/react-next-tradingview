import dynamic from "next/dynamic";

const TVBuilder = dynamic(() => import("../components/builder"), {
  ssr: false,
});

const BuilderPage = () => {
  return <TVBuilder />;
};
export default BuilderPage;
