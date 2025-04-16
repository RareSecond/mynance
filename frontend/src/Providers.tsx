import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const theme = createTheme({
  colors: {
    danger: [
      "#ffe9e9",
      "#ffd1d2",
      "#f9a2a2",
      "#f47070",
      "#ef4545",
      "#ed2a2a",
      "#ec1a1c",
      "#d20b10",
      "#bc020c",
      "#a50007",
    ],
    primary: [
      "#f4e9ff",
      "#e1cfff",
      "#bf9cff",
      "#9c65fe",
      "#7f37fd",
      "#6c1afd",
      "#620bfe",
      "#5200e3",
      "#4800cb",
      "#3d00b3",
    ],
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MantineProvider>
  );
};
