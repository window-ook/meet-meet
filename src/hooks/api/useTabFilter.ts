import { useState } from 'react';
import { Category, DallaemfitType } from '@/types/tabFilters';


export function useTabFilter() {
  const [filter, setFilter] = useState<{
    category: Category;
    type: DallaemfitType;
  }>({
    category: Category.DALLAEMFIT,
    type: DallaemfitType.ALL,
  });

  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleCategoryChange = (category: Category) => {
    setFilter({ category, type: DallaemfitType.ALL });
  };

  const handleTypeChange = (type: DallaemfitType) => {
    setFilter((prev) => ({ ...prev, type }));
  };

  return {
    filter,
    selectedLocation,
    selectedDate,
    sortBy,
    setLocation: setSelectedLocation,
    setDate: setSelectedDate,
    setSort: setSortBy,
    handleCategoryChange,
    handleTypeChange,
  };
}
