import { Flex, Image, Text } from '@chakra-ui/react';
import Layout from '../components/Layout';

const Index = () => {
   return (
      <Layout>
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
            <Text fontSize="xl" maxW="900px" textAlign="center">
               App description placeholder
            </Text>
         </Flex>
      </Layout>
   );
};


Index.auth = true;

export default Index;
