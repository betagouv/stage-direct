import { Toaster as BaseToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <BaseToaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{ duration: 10_000 }}
    />
  );
}
