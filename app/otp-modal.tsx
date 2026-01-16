import {useCallback, useEffect, useState} from "react";
import {Alert, Dimensions, Pressable, StyleSheet, TextInput, View,} from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {Redirect, useRouter} from "expo-router";
import {useAuthenticate, useSignerStatus} from "@account-kit/react-native";
import {Text} from "@src/components/ui/text";
import {Button} from "@src/components/ui/button";
import {PageBody, PageContainer, PageHeader, PageHeading} from "@src/components/PageSection";

const windowHeight = Dimensions.get("window").height;

// OTP Input Component
interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  disabled: boolean;
  length: number;
}

const OTPInput: React.FC<OTPInputProps> = (
  {
    value,
    onChange,
    onComplete,
    isLoading,
    error,
    disabled,
    length
  }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleTextChange = (text: string) => {
    // Only allow digits
    const digits = text.replace(/\D/g, '');

    if (digits.length <= length) {
      onChange(digits);

      if (digits.length === length) {
        onComplete(digits);
      }

      setFocusedIndex(Math.min(digits.length, length - 1));
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && value[index - 1] === '' && index > 0) {
      setFocusedIndex(index - 1);
    }
  };

  const renderInputBoxes = () => {
    const boxes = [];
    for (let i = 0; i < length; i++) {
      boxes.push(
        <View
          className={'focus:bg-background bg-card border-hairline border-muted-foreground/20 dark:border-muted'}
          key={i}
          style={[
            styles.otpBox,
            focusedIndex === i && styles.otpBoxFocused,
            value[i] && styles.otpBoxFilled,
            error && styles.otpBoxError
          ]}
        >
          <Text style={[
            styles.otpText,
            value[i] && styles.otpTextFilled,
            error && styles.otpTextError
          ]}>
            {value[i] || ''}
          </Text>
        </View>
      );
    }
    return boxes;
  };

  return (
    <View style={styles.otpContainer}>
      <View style={styles.otpBoxesContainer}>
        {renderInputBoxes()}
      </View>

      {/* Hidden TextInput for actual input */}
      <TextInput
        style={styles.hiddenInput}
        value={value}
        onChangeText={handleTextChange}
        onKeyPress={(event) => handleKeyPress(event, focusedIndex)}
        keyboardType="numeric"
        maxLength={length}
        autoFocus={!disabled}
        editable={!disabled && !isLoading}
      />

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

export default function ModalScreen() {
  const [otpCode, setOtpCode] = useState<string>("");
  const [localOTP, setLocalOTP] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const {authenticate} = useAuthenticate();
  const {isConnected} = useSignerStatus();
  const router = useRouter();

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (localOTP.length === 6 && !isVerifying) {
      handleOTPComplete(otpCode);
    }
  }, [localOTP]);

  const handleOTPComplete = async (otp: string) => {
    if (otp.length === 6) {
      setIsVerifying(true);
      try {
        authenticate({
          otpCode,
          type: "otp",
        });

        router.replace("/");
      } catch (error) {
        console.error('OTP verification error:', error);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleUserOtp = useCallback(() => {
    if (otpCode.length === 6) {
      setIsVerifying(true);
      try {
        authenticate({
          otpCode,
          type: "otp",
        });

        router.replace("/");
      } catch (error) {
        setError("Error sending OTP Code.");
        console.error('OTP verification error:', error);
        Alert.alert("Error sending OTP Code. Check logs for more details.");
      } finally {
        setIsVerifying(false);
      }
    }
    /*try {
      authenticate({
        otpCode,
        type: "otp",
      });

      router.replace("/");
    } catch (e) {


      console.log("Error seding OTP CODE: ", e);
    }*/
  }, [otpCode]);

  if (isConnected) {
    return <Redirect href={"/"}/>;
  }

  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Verify OTP</PageHeading>
      </PageHeader>
      <PageBody>
        <View style={styles.formContainer}>
          {/* Close Button */}
          {/*<Pressable onPress={() => router.back()}>
            {({pressed}) => (
              <View
                style={[
                  styles.closeButtonWrapper,
                  {opacity: pressed ? 0.5 : 1},
                ]}
              >
                <Ionicons name="close" size={24} color={"red"}/>
              </View>
            )}
          </Pressable>*/}

          <Text
            style={[styles.titleText, {fontSize: 18, marginBottom: 5}]}
          >
            Check your mail for an OTP
          </Text>
          <Text
            style={styles.titleText}
          >
            Enter the One-Time Password sent to your email address below
          </Text>
          <View style={styles.textInputContainer}>
            {/*<TextInput
              style={styles.textInput}
              value={otpCode}
              onChangeText={(val) => setOtpCode(val.toLowerCase())}
              placeholder="123456"
            />*/}

            {/* OTP Input */}
            <View>
              <OTPInput
                value={otpCode}
                onChange={setOtpCode}
                onComplete={handleUserOtp}
                isLoading={isVerifying}
                error={error}
                disabled={false}
                length={6}
              />
            </View>

            <Button
              className={'h-14 rounded-2xl'}
              size={'lg'}
              onPress={handleUserOtp}
            >
              <Text className={'text-lg'}>Verify OTP</Text>
            </Button>

            {/*<Pressable onPress={handleUserOtp}>
              {({pressed}) => (
                <View
                  style={[
                    styles.signInButton,
                    {
                      opacity: pressed ? 0.5 : 1,
                      transform: [
                        {
                          scale: pressed ? 0.98 : 1,
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={[styles.signInText]}>Verify OTP</Text>
                </View>
              )}
            </Pressable>*/}
          </View>
        </View>
      </PageBody>
    </PageContainer>
  );
}
const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    height: windowHeight,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  titleText: {
    // fontFamily: "SpaceMono",
  },
  textInputContainer: {
    marginTop: 32,
    width: "100%",
    gap: 16,
  },

  closeButtonWrapper: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
    width: 40,
    height: 40,
    marginBottom: 30,
  },

  textInput: {
    width: "100%",
    height: 40,
    borderColor: "rgba(0,0,0,0.095)",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.025)",
    marginBottom: 10,
    borderRadius: 10,
  },

  signInButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(0, 0, 0)",
  },

  signInText: {
    color: "white",
    // fontFamily: "SpaceMono",
  },
  // OTP Input Styles
  otpContainer: {
    alignItems: 'center',
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  otpBox: {
    width: 50,
    height: 60,
    borderWidth: 2,
    // borderColor: '#E5E7EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    // backgroundColor: '#FFFFFF',
  },
  otpBoxFocused: {
    borderColor: 'rgba(40,122,206,0.88)',
    // borderColor: '#8B5CF6',
    // backgroundColor: '#F3F4F6',
  },
  otpBoxFilled: {
    borderColor: 'rgba(37,204,84,0.56)',
    // borderColor: '#8B5CF6',
    // backgroundColor: '#F3F0FF',
  },
  otpBoxError: {
    borderColor: '#EF4444',
    // backgroundColor: '#FEF2F2',
  },
  otpText: {
    fontSize: 24,
    fontWeight: 'bold',
    // color: '#6B7280',
  },
  otpTextFilled: {
    // color: '#8B5CF6',
  },
  otpTextError: {
    color: '#EF4444',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
