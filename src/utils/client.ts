import {useSmartAccountClient} from "@account-kit/react-native";

export const { client, isLoadingClient } = useSmartAccountClient({
  type: "ModularAccountV2",
});
