import { Flex, VStack, Container, Heading, Grid } from '@src/components/ui/layout';
import {Card} from "@/src/components/ui/card";
import {Text} from "@/src/components/ui/text";
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";

export default function MyComponent() {
  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Testing Layout Page</PageHeading>
      </PageHeader>
      <PageBody>
        <Container center={false} className={'flex-1'} maxWidth="md">
          <VStack align={'stretch'} className={'bg-green-600'} space={8}>
            <Heading as={'h1'} level={6}>Welcome</Heading>
            <Flex direction={'row'} justify="between" align="center">
              <Text>Left content</Text>
              <Text>Center content</Text>
              <Text>Right content</Text>
            </Flex>
            <Grid className={'bg-green-600'} columns={4} gap={2} rows={2}>
              <Card>
                <Text>Item 1</Text>
              </Card>
              <Card>
                <Text>Item 2</Text>
              </Card>
              <Card>
                <Text>Item 3</Text>
              </Card>
            </Grid>
          </VStack>
        </Container>
      </PageBody>
    </PageContainer>
  );
}
