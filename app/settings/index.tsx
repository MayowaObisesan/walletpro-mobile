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
      <View className={'flex flex-row items-center gap-x-4 p-4'}>
        <Button className={'flex-1'}>
          <Text className={'font-medium'}>Add New Address</Text>
        </Button>
        <Button className={'bg-secondary'} variant={'secondary'}>
          <Text>
            <Ionicons name={'download'} size={16} />
          </Text>
          <Text>
            Import Wallet
          </Text>
        </Button>
      </View>
    </PageContainer>
  )
}
