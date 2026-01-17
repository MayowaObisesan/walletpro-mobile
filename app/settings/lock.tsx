import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {View} from "react-native";

export default function LockSettingsScreen() {
  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Change Auto-Lock Time</PageHeading>
      </PageHeader>
      <PageBody>
        <View></View>
      </PageBody>
    </PageContainer>
  )
}
