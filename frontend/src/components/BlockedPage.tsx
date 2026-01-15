import { Button, VStack, Heading, Text, Center } from '@chakra-ui/react';
import { useLocale } from '../hooks/useLocale';

interface BlockedPageProps {
  onSignOut: () => Promise<void>;
}

export const BlockedPage = ({ onSignOut }: BlockedPageProps) => {
  const { t } = useLocale();

  return (
    <Center minH="100vh" p={5}>
      <VStack gap={8} maxW="lg" textAlign="center">
        <Heading size="3xl" color="red.600">
          {t('accessBlocked')}
        </Heading>
        <Text fontSize="lg" color="fg.muted">
          {t('accessBlockedMessage')}
        </Text>

        <Button
          onClick={onSignOut}
          variant="surface"
          size="lg"
        >
          {t('signOut')}
        </Button>
      </VStack>
    </Center>
  );
};
