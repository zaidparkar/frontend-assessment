import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchUsers, setPageSize, setSearchTerm, setCurrentPage } from '../store/slices/usersSlice';
import DataTable from '../components/DataTable';

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, pageSize, currentPage, totalPages, searchTerm } = useSelector(
    (state: RootState) => state.users
  );

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const columns = [
    { key: 'firstName', label: 'First Name', filter: true },
    { key: 'lastName', label: 'Last Name', filter: true },
    { key: 'email', label: 'Email', filter: true },
    { key: 'age', label: 'Age', filter: true },
    { key: 'gender', label: 'Gender', filter: true },
    { key: 'username', label: 'Username' },
    { key: 'bloodGroup', label: 'Blood Group' },
    { key: 'eyeColor', label: 'Eye Color' }
  ];

  useEffect(() => {
    dispatch(fetchUsers({
      limit: pageSize,
      skip: (currentPage - 1) * pageSize,
      filters: activeFilters
    }));
  }, [dispatch, pageSize, currentPage, activeFilters]);

  const handleFilterChange = (key: string, value: string) => {
    if (value.trim()) {
      setActiveFilters({ [key]: value });
    } else {
      setActiveFilters({});
      dispatch(fetchUsers({
        limit: pageSize,
        skip: (currentPage - 1) * pageSize,
        filters: {}
      }));
    }
    dispatch(setCurrentPage(1));
  };

  const filteredData = searchTerm
    ? data.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    : data;

  return (
    <div className="p-6">
      <DataTable
        data={filteredData}
        columns={columns}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageSizeChange={(size) => dispatch(setPageSize(size))}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
        onSearch={(term) => dispatch(setSearchTerm(term))}
        onFilterChange={handleFilterChange}
        isLoading={loading}
        pageTitle="Users"
      />
    </div>
  );
};

export default Users; 