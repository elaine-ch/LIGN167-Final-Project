
import { Box, Spinner } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Spinner size="xl" color="blue.500" />
    </Box>
  );
};

export default Loading;
