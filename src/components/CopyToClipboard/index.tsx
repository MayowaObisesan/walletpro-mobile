import { type ReactNode, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

interface CopyTextComponentProps {
  textToCopy: string;
  feedbackMessage?: string;
  clearClipboard?: boolean;
  icon?: ReactNode;
  successIcon?: ReactNode;
  children?: ReactNode;
}

const CopyTextComponent = ({
  textToCopy,
  feedbackMessage,
  clearClipboard = false,
  icon,
  successIcon,
  children,
}: CopyTextComponentProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // await Clipboard.setStringAsync(textToCopy);
      setCopied(true);
      // toast(feedbackMessage || 'Address copied to clipboard', { duration: 1000 });

      // Reset copied state after duration
      setTimeout(() => setCopied(false), 2400);

      // TODO: Implement clearing clipboard functionality if needed
      if (clearClipboard) {
        setTimeout(() => {
          // Clipboard.setStringAsync('');
        }, 5000);
      }
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error);
      // toast('Failed to copy to clipboard', { duration: 2000 });
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleCopy} disabled={copied}>
        {icon ? (
          <View className="flex flex-row items-center gap-2">
            {copied ? successIcon : icon}
          </View>
        ) : children}
      </TouchableOpacity>
    </View>
  );
};

export default CopyTextComponent;
