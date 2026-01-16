import { useExportAccount } from "@account-kit/react-native";
import { useState } from "react";
import { View, Alert } from "react-native";
import {Button} from "@src/components/ui/button";
import {Text} from "@src/components/ui/text";

export const SeedPhraseExport = () => {
  const [showExport, setShowExport] = useState(false);

  const {
    exportAccount,
    isExporting,
    isExported,
    error,
    ExportAccountComponent,
  } = useExportAccount({
    params: {
      iframeContainerId: "seed-phrase-iframe-container",
    },
  });

  const handleExport = async () => {
    try {
      await exportAccount();
      setShowExport(true);
    } catch (err) {
      Alert.alert("Export Failed", "Unable to export seed phrase");
    }
  };

  return (
    <View>
      {!showExport ? (
        <Button
          onPress={handleExport}
          disabled={isExporting}
        >
          <Text>
            {isExporting ? "Exporting..." : "Export Seed Phrase"}
          </Text>
        </Button>
      ) : (
        <View>
          <Text>Recovery Details:</Text>
          {/* This iframe contains the actual seed phrase */}
          {/*<ExportAccountComponent isExported={isExported} />*/}
        </View>
      )}

      {error && <Text>Error: {error.message}</Text>}
    </View>
  );
};
