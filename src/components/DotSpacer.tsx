import {cn} from "@src/lib/utils";
import {View} from "react-native";

export function DotSpacer({ className }: { className?: string }) {
  return (
    <>
      <View className={cn("size-1.5 mx-1 bg-muted-foreground", className)}></View>
    </>
  );
}

export function DotSpacerSmall({ className }: { className?: string }) {
  return (
    <>
      <View className={cn("size-1 mx-1 bg-muted-foreground rounded-full", className)}></View>
    </>
  );
}
