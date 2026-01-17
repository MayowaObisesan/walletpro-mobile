import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {View} from "react-native";

export default function ThemeSettingsScreen() {
  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Change Wallet Theme</PageHeading>
      </PageHeader>
      <PageBody>
        <View></View>
      </PageBody>
    </PageContainer>
  )
}
