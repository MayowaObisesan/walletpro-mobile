import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";
import {Alert, View} from "react-native";
import {useAddPasskey, useUser} from "@account-kit/react-native";
import {Button} from "@src/components/ui/button";
import {router} from "expo-router";
import {Text} from "@src/components/ui/text";
import {Card} from "@src/components/ui/card";

export default function PasskeySettingsScreen() {
  const user = useUser();
  const { addPasskey, isAddingPasskey, error } = useAddPasskey({
    // these are optional
    onSuccess: () => {
      // do something on success
      Alert.alert("Success", "Passkey added successfully");
    },
    onError: (error) => console.error("[PassKey Screen] Error Setting Passkey - ", error),
  });

  const handleAddPasskey = () => {
    addPasskey()
  }

  if (!user?.address) {
    return (
      <View>
        You Need to be Authenticated to Access this Page
        <Button
          onPress={() => router.push('/sign-in')}
        >
          <Text>
            Go to Sign in
          </Text>
        </Button>
      </View>
    )
  }

  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Add Biometrics Login</PageHeading>
      </PageHeader>
      <PageBody>
        <View className={'p-4 gap-4 flex flex-col items-center justify-center'}>
          <Card className={'bg-transparent border-0'}>
            <View className={'items-center'}>
              <Text>You are authenticated. Add your passkey</Text>
            </View>
          </Card>
          <Button
            onPress={handleAddPasskey}
            disabled={isAddingPasskey}
            className={'w-full'}
          >
            <Text>
              Add Passkey to you Account
            </Text>
          </Button>
        </View>
      </PageBody>
    </PageContainer>
  )
}
