import {View} from "react-native";
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {Button} from "@src/components/ui/button";
import {Text} from "@src/components/ui/text";
import {Ionicons} from "@expo/vector-icons";
import {Alert, AlertTitle} from "@src/components/ui/alert";
import { AlertCircleIcon, CheckCircle2Icon, Terminal } from 'lucide-react-native';
import {useChain} from "@account-kit/react-native";

export default function AccountScreen() {
  const { chain } = useChain();

  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Your Accounts</PageHeading>
      </PageHeader>
      <PageBody>
        <Alert className={'bg-emerald-800/40'} icon={Terminal}>
          <AlertTitle className={'bg-transparent text-green-600 text-lg'}>You are on {chain.name}</AlertTitle>
        </Alert>
        <View>
          <Text>This is the Account page</Text>
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
