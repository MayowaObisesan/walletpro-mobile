# WalletPro Mobile - Complete Project Rules Guide

This document serves as the definitive guide for LLMs working on the WalletPro Mobile project. It outlines all architectural patterns, coding standards, and operational rules that must be followed.

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Structure Rules](#architecture--structure-rules)
3. [Development Rules](#development-rules)
4. [Blockchain Integration Rules](#blockchain-integration-rules)
5. [UI/UX Rules](#uiux-rules)
6. [State Management Rules](#state-management-rules)
7. [Security Rules](#security-rules)
8. [Build & Deployment Rules](#build--deployment-rules)
9. [Testing Rules](#testing-rules)
10. [Performance Rules](#performance-rules)

---

## 🎯 Project Overview

**WalletPro Mobile** is a React Native cryptocurrency wallet built with Expo and Alchemy's Account Kit. It enables users to manage smart accounts across multiple blockchain networks with a focus on security, usability, and modern mobile UX.

### Core Technologies
- **React Native 0.76.9** + **Expo 52.0.47**
- **TypeScript** for type safety
- **Alchemy Account Kit** for smart account management
- **Zustand** for state management
- **NativeWind** (Tailwind CSS) for styling
- **HeroUI Native** component library

---

## 🏗️ Architecture & Structure Rules

### File Organization
```
walletpro-mobile/
├── app/                    # Expo Router pages
│   ├── (main)/            # Main app sections
│   ├── accounts/          # Account management
│   ├── send/              # Transaction sending
│   ├── history/           # Transaction history
│   └── settings/          # App settings
├── src/
│   ├── components/        # Reusable UI components
│   │   └── ui/           # HeroUI Native primitives
│   ├── config/           # Configuration files
│   ├── context/          # React contexts
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility libraries
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── assets/               # Static assets
└── docs/                 # Project documentation
```

### Component Creation Rules
1. **Always use TypeScript interfaces** for props
2. **Follow HeroUI Native patterns** for UI components
3. **Use NativeWind classes** for styling, never inline styles
4. **Create components in `src/components/`** for reusability
5. **Use PascalCase for component names**
6. **Export components as named exports**

```typescript
// ✅ Correct
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const CustomButton: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary' 
}) => {
  return (
    <Button 
      className="bg-primary text-primary-foreground"
      onPress={onPress}
    >
      <Text>{title}</Text>
    </Button>
  );
};
```

### Navigation Structure
1. **Use Expo Router** for all navigation
2. **File-based routing** in the `app/` directory
3. **Layout files** (_layout.tsx) define shared UI
4. **Modal presentations** use specific stack screen options
5. **Always use safe area insets** for mobile layouts

```typescript
// ✅ Correct modal setup
<Stack.Screen
  name="otp-modal"
  options={{
    presentation: Platform.OS === "ios" ? "formSheet" : "containedTransparentModal",
    animation: Platform.OS === "android" ? "slide_from_bottom" : "default",
  }}
/>
```

---

## 💻 Development Rules

### TypeScript Standards
1. **Strict TypeScript configuration** - no `any` types allowed
2. **Use Viem types** for blockchain-related types
3. **Create interfaces** for all complex data structures
4. **Use type guards** for runtime type checking
5. **Export types** from dedicated files in `src/types/`

```typescript
// ✅ Correct typing
import type { Address, Chain } from "viem";

export interface WalletAccount {
  id: string;
  name: string;
  address: Address;  // Use Viem Address type
  privateKey: string; // Encrypted in storage
  createdAt: number;
  lastUsed: number;
  accountType?: 'smart' | 'imported';
}
```

### Code Style Rules
1. **Use PNPM** as package manager
2. **Follow ESLint and Prettier** configurations
3. **Use functional components** with hooks
4. **Prefer named exports** over default exports
5. **Use const** for all declarations unless reassignment is needed
6. **Implement error boundaries** for all major screens

### Import Organization
```typescript
// ✅ Correct import order
1. React & React Native imports
2. Third-party library imports
3. Expo imports
4. Account Kit imports
5. Internal imports (src/*)
6. Relative imports
```

### Hook Usage Patterns
1. **Custom hooks go in `src/hooks/`**
2. **Use naming convention**: `use` + descriptive name
3. **Always return consistent shape** from custom hooks
4. **Handle loading and error states** in all async hooks

```typescript
// ✅ Correct hook pattern
export const useAccountBalance = (address: Address) => {
  const [balance, setBalance] = useState<bigint>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    // Implementation
  }, [address]);

  return { balance, isLoading, error };
};
```

---

## ⛓️ Blockchain Integration Rules

### Account Kit Integration
1. **Use AlchemyAuthSessionProvider** at app root
2. **Always use ModularAccountV2** account type
3. **Session expiration**: 24 hours default
4. **Policy ID** from environment variables for all chains

```typescript
// ✅ Correct Account Kit setup
const config = createConfig({
  chain: defaultAlchemyChain,
  sessionConfig: {
    expirationTimeMs: 1000 * 60 * 60 * 24, // 24 hours
  },
  transport: alchemy({
    apiKey: Constants.expoConfig?.extra?.EXPO_PUBLIC_ALCHEMY_API_KEY!,
  }),
});
```

### Multi-Chain Support
1. **Use chains from `@account-kit/infra`** for supported networks
2. **Default chain**: Sepolia for development
3. **Custom networks** stored in local storage
4. **Network status monitoring** for all chains
5. **Gas sponsorship** where available

```typescript
// ✅ Correct chain configuration
export const alchemyChains = [
  sepolia,     // Default
  mainnet,
  arbitrum,
  base,
  optimism,
  // ... other supported chains
];
```

### Transaction Management
1. **Always estimate gas** before sending transactions
2. **Use gas sponsorship** when available
3. **Implement proper error handling** for failed transactions
4. **Store transaction history** locally with chain info
5. **Refresh balances** after successful transactions

### Balance Tracking
1. **Use reactive balance version** for updates
2. **Fetch both native and token balances**
3. **Implement USD price conversion** where possible
4. **Cache balances** with TTL for performance

---

## 🎨 UI/UX Rules

### Theme System
1. **Use HSL color tokens** defined in Tailwind config
2. **Support system, light, and dark themes**
3. **Theme detection** via `useColorScheme` hook
4. **All components** must support theme switching

```typescript
// ✅ Correct theme usage
const { colorScheme, isDarkColorScheme } = useColorScheme();
const theme = isDarkColorScheme ? DARK_THEME : LIGHT_THEME;
```

### Component Library Rules
1. **Use HeroUI Native primitives** from `@rn-primitives/*`
2. **Follow established patterns** from existing components
3. **Never style HeroUI components** with conflicting styles
4. **Use semantic variants** (primary, secondary, destructive)

```typescript
// ✅ Correct component usage
import { Button } from '@src/components/ui/button';
import { Card, CardContent, CardHeader } from '@src/components/ui/card';

<Button variant="primary" size="lg">
  <Text>Send Transaction</Text>
</Button>
```

### Layout & Responsive Design
1. **Always use SafeAreaView** for mobile layouts
2. **Use flexbox layouts** with NativeWind classes
3. **Implement proper spacing** using Tailwind spacing scale
4. **Handle platform differences** with Platform.OS checks
5. **Use hairline borders** for subtle dividers

### Navigation Patterns
1. **Bottom navigation** for main sections
2. **Stack navigation** for detail screens
3. **Modal presentations** for overlays
4. **Consistent header patterns** across screens
5. **Deep linking support** via Expo Router

---

## 🗃️ State Management Rules

### Zustand Store Architecture
1. **Single UI store** for all application state
2. **Use subscribeWithSelector middleware** for optimization
3. **Organize state by domain** (network, accounts, theme, etc.)
4. **Create action functions** for all state updates
5. **Use selectors** for optimized re-renders

```typescript
// ✅ Correct store pattern
interface UIStore {
  // State
  selectedNetwork: Chain;
  activeAccount: WalletAccount | null;
  
  // Actions
  setSelectedNetwork: (chain: Chain) => void;
  setActiveAccount: (account: WalletAccount | null) => void;
}

// Selectors for optimization
export const useSelectedNetwork = () => useUIStore((state) => state.selectedNetwork);
```

### State Synchronization
1. **Use storage-sync middleware** for persistence
2. **Sync critical state** (accounts, settings, theme)
3. **Handle sync conflicts** gracefully
4. **Implement versioning** for store migrations

### Background Communication
1. **Use background bridge** for cross-process communication
2. **Message types** follow strict naming convention
3. **Handle all message types** in background bridge
4. **Acknowledge all messages** from background processes

---

## 🔒 Security Rules

### Private Key Management
1. **Never store private keys** in plain text
2. **Use encrypted storage** (react-native-mmkv)
3. **Implement wallet locking** mechanism
4. **Secure key derivation** for account creation
5. **Memory cleanup** after key operations

### Authentication & Session
1. **Session expiration** after 24 hours
2. **Secure session storage** in device storage
3. **Biometric authentication** where available
4. **Session invalidation** on app backgrounding

### Input Validation
1. **Validate all addresses** using Viem utilities
2. **Sanitize all user inputs** before processing
3. **Implement transaction signing** confirmations
4. **Validate chain IDs** before network switches

### Secure Storage
1. **Use react-native-mmkv** for encrypted storage
2. **Separate sensitive data** from general storage
3. **Implement storage cleanup** on logout
4. **Backup encryption keys** securely

---

## 🚀 Build & Deployment Rules

### Environment Configuration
1. **Use app.json extra section** for environment variables
2. **Never commit sensitive values** to version control
3. **Required variables**: `EXPO_PUBLIC_ALCHEMY_API_KEY`, `EXPO_PUBLIC_ALCHEMY_POLICY_ID`
4. **Platform-specific builds** via EAS Build

```json
// ✅ Correct environment setup
{
  "expo": {
    "extra": {
      "EXPO_PUBLIC_ALCHEMY_API_KEY": "your-key-here",
      "EXPO_PUBLIC_ALCHEMY_POLICY_ID": "your-policy-id-here"
    }
  }
}
```

### Build Requirements
1. **Expo SDK 52.0.47** - exact version required
2. **React Native 0.76.9** - exact version required
3. **Node.js 18+** for development
4. **PNPM 10.15.0+** as package manager

### Platform Considerations
1. **iOS**: Support iOS 13+ with proper Info.plist configuration
2. **Android**: Target API 33+ with proper permissions
3. **Universal builds** for both platforms
4. **App Store optimization** with proper metadata

### Version Management
1. **Semantic versioning** for releases
2. **Changelog maintenance** for all releases
3. **Branch protection** for main branch
4. **Automated builds** via GitHub Actions

---

## 🧪 Testing Rules

### Component Testing
1. **Test all components** with React Native Testing Library
2. **Mock external dependencies** (Account Kit, navigation)
3. **Test user interactions** and state changes
4. **Coverage requirement**: 80% minimum

### Integration Testing
1. **Test store interactions** with mock data
2. **Test navigation flows** between screens
3. **Test blockchain integrations** with testnet data
4. **Test error scenarios** and edge cases

### Test Organization
```
src/
├── components/
│   └── __tests__/       # Component tests
├── store/
│   └── __tests__/       # Store tests
├── utils/
│   └── __tests__/       # Utility tests
└── __mocks__/          # Mock definitions
```

### Mock Patterns
1. **Mock Account Kit** for wallet operations
2. **Mock Viem** for blockchain interactions
3. **Mock navigation** for routing tests
4. **Mock AsyncStorage** for storage tests

---

## ⚡ Performance Rules

### Component Optimization
1. **Use React.memo** for expensive components
2. **Implement virtual lists** for long lists
3. **Optimize re-renders** with proper selectors
4. **Use useCallback** and **useMemo** strategically

### Bundle Optimization
1. **Tree-shake unused imports**
2. **Lazy load heavy components**
3. **Optimize image assets** with proper sizing
4. **Use Hermes engine** for Android performance

### Memory Management
1. **Cleanup listeners** in useEffect return functions
2. **Avoid memory leaks** in long-lived components
3. **Implement proper cache invalidation**
4. **Monitor memory usage** in development

### Network Optimization
1. **Implement request caching** for API calls
2. **Use WebSocket connections** for real-time updates
3. **Batch multiple operations** where possible
4. **Implement offline support** with local storage

---

## 📝 Development Workflow Rules

### Git Workflow
1. **Feature branches** from main branch
2. **Descriptive commit messages** following conventional commits
3. **Pull request reviews** required for all changes
4. **Automated tests** must pass before merge

### Code Review Checklist
- [ ] TypeScript types are correct
- [ ] Components follow established patterns
- [ ] Security best practices are followed
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Performance implications considered

### Release Process
1. **Version bump** in package.json
2. **Update changelog** with new features
3. **Create release tag** in Git
4. **Deploy to staging** for final testing
5. **Deploy to production** after approval

---

## 🚨 Critical Rules (Must Follow)

### NEVER DO These:
1. **NEVER store private keys** in plain text
2. **NEVER commit API keys** to version control
3. **NEVER use `any` type** in TypeScript
4. **NEVER skip error handling** in async operations
5. **NEVER modify HeroUI components** directly
6. **NEVER use inline styles** instead of Tailwind classes
7. **NEVER skip type safety** for blockchain operations

### ALWAYS DO These:
1. **ALWAYS validate addresses** before transactions
2. **ALWAYS handle loading states** in async operations
3. **ALWAYS use selectors** for store subscriptions
4. **ALWAYS implement error boundaries** for major screens
5. **ALWAYS test on both platforms** before release
6. **ALWAYS follow the established patterns** in this guide
7. **ALWAYS update documentation** for API changes

---

## 🔍 Troubleshooting Guide

### Common Issues
1. **Build failures**: Check package versions match requirements
2. **Type errors**: Ensure proper Viem types are used
3. **Theme issues**: Verify theme tokens are properly applied
4. **Store issues**: Check selector usage and action calls
5. **Navigation issues**: Verify file-based routing structure

### Debug Patterns
1. **Use Flipper** for React Native debugging
2. **Enable React DevTools** for component inspection
3. **Use console logs** with proper context
4. **Test with different device sizes**
5. **Verify network connectivity** for blockchain operations

---

This document serves as the single source of truth for all development activities in the WalletPro Mobile project. All LLMs working on this project must follow these rules to maintain code quality, security, and consistency.

**Last Updated**: January 14, 2026
**Version**: 1.0.0
