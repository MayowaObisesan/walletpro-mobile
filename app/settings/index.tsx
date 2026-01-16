import {View} from 'react-native';
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {Button} from "@src/components/ui/button";
import {Text} from "@src/components/ui/text";
import {Ionicons} from "@expo/vector-icons";

export default function SettingScreen() {
  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Settings</PageHeading>
      </PageHeader>
      <PageBody>
        <View>
          <Text>This is the Settings page</Text>
          <Text>All App settings are applied here</Text>
        </View>
      </PageBody>
    </PageContainer>
  )
}
