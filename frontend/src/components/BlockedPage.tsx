import { Button, VStack, Heading, Text, Center } from '@chakra-ui/react';

interface BlockedPageProps {
  onSignOut: () => Promise<void>;
}

export const BlockedPage = ({ onSignOut }: BlockedPageProps) => {
  return (
    <Center minH="100vh" p={5}>
      <VStack gap={8} maxW="lg" textAlign="center">
        <Heading size="3xl" color="red.600">
          Access Blocked
        </Heading>
        <Text fontSize="lg" color="fg.muted">
          Your account has been blocked from accessing this application.
          Please contact the administrator if you believe this is an error.
        </Text>

        <Button
          onClick={onSignOut}
          variant="surface"
          size="lg"
        >
          Sign Out
        </Button>
      </VStack>
    </Center>
  );
};
