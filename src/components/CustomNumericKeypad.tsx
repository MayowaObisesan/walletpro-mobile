import React from "react"
import { LucideArrowLeft, LucideArrowRightLeft } from "lucide-react-native";
import {View} from "react-native";
import {Text} from "@src/components/ui/text";
import {Button} from "@src/components/ui/button";
import {Icon} from "@src/components/ui/icon";

interface NumericKeypadProps {
    maxValue: string
    inputValue: string
    setInputValue: React.Dispatch<React.SetStateAction<string>>
    onSubmit?: (value: string) => void
    allowDecimal?: boolean
    maxLength?: number
    tokenSymbol: string
    onEthValueChange?: (ethValue: string) => void // Callback to notify parent of ETH value changes
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({
    maxValue,
    inputValue,
    setInputValue,
    onSubmit,
    allowDecimal = true,
    maxLength = 10,
    tokenSymbol,
    onEthValueChange
}) => {
    // Input mode state: "ETH" or "USD"
    const [inputMode, setInputMode] = React.useState<"ETH" | "USD">("ETH")

    // ETH price in USD (matching the price used in send.tsx)
    const ETH_PRICE_USD = 3000

    // Convert between ETH and USD
    const convertEthToUsd = (ethAmount: string): string => {
        const ethValue = parseFloat(ethAmount) || 0
        return (ethValue * ETH_PRICE_USD).toFixed(2)
    }

    const convertUsdToEth = (usdAmount: string): string => {
        const usdValue = parseFloat(usdAmount) || 0
        return (usdValue / ETH_PRICE_USD).toFixed(6)
    }

    // Get display values based on current mode
    const getDisplayValues = () => {
        if (inputMode === "ETH") {
            const ethAmount = inputValue || "0"
            const usdAmount = convertEthToUsd(ethAmount)
            return { primary: ethAmount, secondary: usdAmount, primarySymbol: tokenSymbol, secondarySymbol: "$" }
        } else {
            const usdAmount = inputValue || "0"
            const ethAmount = convertUsdToEth(usdAmount)
            return { primary: usdAmount, secondary: ethAmount, primarySymbol: "$", secondarySymbol: tokenSymbol }
        }
    }

    // Notify parent component of ETH value changes
    React.useEffect(() => {
        if (onEthValueChange) {
            const ethValue = inputMode === "ETH"
                ? inputValue || "0"
                : convertUsdToEth(inputValue || "0")
            onEthValueChange(ethValue)
        }
    }, [inputValue, inputMode, onEthValueChange])

    const handleKeyPress = (key: string) => {
        if (key === "clear") {
            setInputValue("")
        } else if (key === "max") {
            if (inputMode === "ETH") {
                setInputValue(maxValue) // Set max ETH value
            } else {
                // Set max USD value based on max ETH balance
                const maxUsdValue = convertEthToUsd(maxValue)
                setInputValue(maxUsdValue)
            }
        } else if (key === "backspace") {
            setInputValue((prev) => prev.slice(0, -1))
        } else if (key === "submit") {
            onSubmit?.(inputValue)
        } else {
            if (inputValue.length < maxLength) {
                if (key === "." && allowDecimal && !inputValue.includes(".")) {
                    setInputValue((prev) => prev + key)
                } else if (!isNaN(Number(key))) {
                    setInputValue((prev) => prev + key)
                }
            }
        }
    }

    const toggleInputMode = () => {
        const currentEthValue = inputMode === "ETH"
            ? inputValue || "0"
            : convertUsdToEth(inputValue || "0")

        setInputMode(prev => prev === "ETH" ? "USD" : "ETH")

        if (inputValue) {
            if (inputMode === "ETH") {
                // Convert current ETH to USD for display
                const usdValue = convertEthToUsd(inputValue)
                setInputValue(usdValue)
            } else {
                // Convert current USD to ETH for display
                const ethValue = convertUsdToEth(inputValue)
                setInputValue(ethValue)
            }
        }
    }

    const keypadButtons = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        allowDecimal ? "." : "",
        "0",
        inputValue === "" ? "max" : "backspace",
    ].filter(Boolean)

    const displayValues = getDisplayValues()
    const fontSize = Math.max(12, 50 - inputValue.length * 2)

    return (
        <View
          className={'gap-6 justify-end'}
        // style={{
        //   display: "flex",
        //   flexDirection: "column",
        //   alignItems: "center",
        //   gap: "10px",
        // }}
        >
            {/* Display */}

            <View
              className={'relative flex-row items-center justify-between gap-3 px-3 py-1'}
            >
                <View className={"absolute -bottom-4 left-0 right-0"}>
                    <View className={'items-center justify-center gap-1'}>
                        <Text className={'font-bold text-xl text-center text-muted-foreground'} style={{ opacity: 0.8 }}>
                            (<Text className={'text-muted-foreground text-xl'}>
                                {displayValues.secondarySymbol}
                            </Text>
                            {displayValues.secondary})
                        </Text>
                    </View>
                </View>

                <Button
                  size={'icon'}
                  variant={"secondary"}
                  onPress={toggleInputMode}
                  // className={"relative rounded-large bg-[var(--gray-2)] hover:bg-[var(--gray-3)]"}
                  style={{ borderRadius: 12, minWidth: 48, minHeight: 48 }}
                >
                    <Text>
                        <Icon as={LucideArrowRightLeft} className={'text-muted-foreground'} size={20} strokeWidth={3} />
                    </Text>
                </Button>

                <Text
                    // size={"9"}
                    className={"overflow-auto whitespace-nowrap text-center font-bold text-8xl h-24"}
                    style={{
                        fontSize: fontSize,
                        // paddingBlock: 0.5,
                        lineHeight: 96,
                    }}
                >
                    {displayValues.primary || "0"}
                </Text>

                <Text className={"font-bold text-muted-foreground text-center text-2xl w-16 truncate text-ellipsis"}>
                    {displayValues.primarySymbol}
                </Text>
            </View>

            {/* Keypad */}
            <View
              className={'flex-wrap flex-row items-center gap-y-3 p-1'}
                // columns={"3"}
                // gap={"1"}
                // rows={"repeat(1, 1fr)"}
                // width={"100%"}
                // p={"1"}
                style={
                    {
                        // display: "grid",
                        // gridTemplateColumns: "repeat(3, 1fr)",
                        // gap: "10px",
                        // background: "orange",
                    }
                }
            >
                {keypadButtons.map((key) => (
                    <Button
                      className={'w-4/12'}
                        key={key}
                        variant={"ghost"}
                        size={"lg"}
                        onPress={() => handleKeyPress(key)}
                        style={{
                            cursor: "pointer",
                            userSelect: "none",
                            height: 88,
                            // fontSize: "22px",
                            // fontWeight: "bold",
                        }}
                    >
                        <Text className={'font-semibold text-2xl'}>
                            {key === "clear" ? "C" : key === "max" ? "Max" : key === "backspace" ? <LucideArrowLeft color={'#D8D8D8'} size={24} strokeWidth={3} /> : key}
                        </Text>
                    </Button>
                ))}
            </View>

            {/* Submit Button */}
            {/*<button
        onClick={() => handleKeyPress("submit")}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>*/}
        </View>
    )
}

export default NumericKeypad
