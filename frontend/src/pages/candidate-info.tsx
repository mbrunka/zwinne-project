import { Flex, Heading, Image, Text } from "@chakra-ui/react";
import Layout from "../components/Layout";

const CandidateInfoPage = () => {
  return (
    <Layout hideSideBar>
      <Flex
        direction="column"
        width="100%"
        alignItems="center"
        gap={5}
        mt="15vh"
      >
        <Image
          height="300px"
          objectFit="contain"
          src={`/logo.png`}
          alt="Logo"
        />
        <Heading>Account not validated yet</Heading>
        <Text fontSize="xl" maxW="900px" textAlign="center">
          Yout teacher account must be validated by any other teacher first
        </Text>
      </Flex>
    </Layout>
  );
};

CandidateInfoPage.auth = true;
CandidateInfoPage.roles = ["KANDYDAT_N"];

export default CandidateInfoPage;
