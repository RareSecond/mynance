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
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MantineProvider>
  );
};
