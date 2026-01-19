import {Flex, VStack, Container, Heading, Grid, Text, HStack} from '@src/components/ui/layout';
import {Card} from "@/src/components/ui/card";
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";

export default function MyComponent() {
  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Testing Layout Page</PageHeading>
      </PageHeader>
      <PageBody>
        <Container maxWidth="md">
          <HStack align={'stretch'} justify={'center'} className={''} space={8}>
            <Text>Left content</Text>
            <Text>Center content</Text>
            <Text>Right content</Text>
          </HStack>
          <VStack align={'stretch'} className={''} space={8}>
            <Heading level={1}>Level 1 (text-xs - Smallest)</Heading>
            <Heading level={3}>Level 3 (text-base - Default)</Heading>
            <Heading>Default Heading</Heading>
            <Heading level={6}>Level 6 (text-2xl)</Heading>
            <Heading level={9}>Level 9 (text-5xl - Largest)</Heading>
            <Text level={1}>Text Level 1 (text-xs - Smallest)</Text>
            <Text level={3}>Text Level 3 (text-base - Default)</Text>
            <Text level={5}>Text Level 5 (text-xl)</Text>
            <Text level={9}>Text Level 9 (text-5xl - Largest)</Text>
            <Flex direction={'row'} justify="between" align="center">
              <Text>Left content</Text>
              <Text>Center content</Text>
              <Text>Right content</Text>
            </Flex>
            <Grid className={''} columns={3} rows={2}>
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
