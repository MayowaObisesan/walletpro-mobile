import {useSmartAccountClient} from "@account-kit/react-native";

export const { client, isLoadingClient } = useSmartAccountClient({
  type: "ModularAccountV2",
  // policyId: '1b26fa3c-8e1e-46c7-b96c-0fd876a23b2a',
});
