import { useState } from 'react';
import { View } from "react-native";
import { router } from 'expo-router';
import { PageBody, PageContainer, PageHeader, PageHeading } from "@src/components/PageSection";
import { Text } from "@src/components/ui/text";
import TransactionList from '@src/components/TransactionList';
import TransactionFilters from '@src/components/TransactionFilters';
import type { AlchemyTransfer, I_TransactionFilters } from '@src/types/account';
import {ALL_CATEGORIES} from "@src/config/constants";

export default function HistoryScreen() {
  const [filters, setFilters] = useState<I_TransactionFilters>({
    categories: ALL_CATEGORIES,
    searchQuery: '',
  });

  const handleTransactionPress = (transaction: AlchemyTransfer) => {
    // Navigate to transaction details
    router.push(`/history/${transaction.hash}`);
  };

  const handleClearFilters = () => {
    setFilters({ categories: [], searchQuery: '' });
  };

  return (
    <PageContainer>
      <PageHeader showBackButton>
        <PageHeading>Transaction History</PageHeading>
      </PageHeader>

      <PageBody>
        {/* Filters */}
        <TransactionFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Transaction List */}
        <TransactionList
          filters={filters}
          onTransactionPress={handleTransactionPress}
          onClearFilters={handleClearFilters}
        />
      </PageBody>
    </PageContainer>
  );
}
