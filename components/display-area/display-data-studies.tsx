import { useActiveStudies } from "../v2/hooks/v2-data.hook";
import { DisplayDataStudy } from "./display-data-study";

export const DisplayDataStudies = () => {
  const { studies } = useActiveStudies();
  return (
    <>
      {studies.map((study) => (
        <DisplayDataStudy key={study?.id} study={study} />
      ))}
    </>
  );
};
