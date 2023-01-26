import { Button, ButtonProps } from "@mui/joy";
type Props = {} & ButtonProps;
export const SymbolListButton = ({ onClick }: Props) => {
  return <Button onClick={onClick} variant="plain">Symbol List</Button>;
};
