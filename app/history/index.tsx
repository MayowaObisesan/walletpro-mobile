import {View} from "react-native";
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {Text} from "@src/components/ui/text";

export default function HistoryScreen() {
  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Transaction History</PageHeading>
      </PageHeader>
      <PageBody>
        <View>
          <Text>This is the Transaction History page</Text>
        </View>
      </PageBody>
    </PageContainer>
  )
}
