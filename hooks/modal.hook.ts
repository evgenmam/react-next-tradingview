import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type IModalContext = {
  type?: "prompt";
  title?: string;
  label?: string;
  value?: string;
  onSubmit?: (v: string) => void;
  onCancel?: () => void;
};

export const ModalContext = createContext<
  [IModalContext | null, Dispatch<SetStateAction<IModalContext | null>>]
>([null, () => {}]);

export const useModalContext = () => useContext(ModalContext);
export const useModal = () => {
  const [modal, setModal] = useContext(ModalContext);

  const openModal = (modal: IModalContext) => {
    setModal(modal);
  };

  const closeModal = () => {
    setModal({});
  };

  return { modal, openModal, closeModal };
};

export const useModalAsync = (props: { title?: string; label?: string }) => {
  const modal = useModal();
  const [v, setV] = useState<string | undefined>("");
  console.log(v);
  return (initial?: string) => {
    return new Promise((resolve, reject) => {
      setV(initial);
      modal.openModal({
        ...props,
        type: "prompt",
        value: initial || "",
        onSubmit: (v) => {
          resolve(v);
          setV(undefined);
        },
        onCancel: () => {
          reject();
          setV(undefined);
        },
      });
    });
  };
};
