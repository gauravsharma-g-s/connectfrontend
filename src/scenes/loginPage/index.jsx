import React from 'react'
import { Box, useTheme, Typography, useMediaQuery } from '@mui/material';
import Form from './Form';
const LoginPage= () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  return(
  <Box>
    <Box width="100%"
      backgroundColor={theme.palette.background.alt}
      p="1rem 6%"
      textAlign="center">
      <Typography
        fontWeight="bold"
        fontSize="32px"
        color="primary">
       CONNECT
      </Typography>
    </Box>

    <Box
      width={isNonMobileScreens ? "50%" : "93%"}
      p="2rem"
      m="2rem auto"
      borderRadius="1.5rem"
      backgroundColor={theme.palette.background.alt}
    >
      <Typography
        fontWeight="500"
        variant="h5"
        sx={{
          mb: "1.5rem"
        }}>
        Step into the world of CONNECT, where meeting new faces is just a click away!
      </Typography>
      <Form />
    </Box>

  </Box>);
};

export default LoginPage;
