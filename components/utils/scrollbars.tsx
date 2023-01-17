import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar, { ScrollBarProps } from "react-perfect-scrollbar";

type Props = ScrollBarProps;

const XScrollbar: React.FC<Props> = (props) => <PerfectScrollbar {...props} />;

export default XScrollbar;
