import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchUsers, setPageSize, setSearchTerm, setCurrentPage } from '../store/slices/usersSlice';
import DataTable from '../components/DataTable';

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, pageSize, currentPage, totalPages, searchTerm } = useSelector(
    (state: RootState) => state.users
  );

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    // Add more columns as needed
  ];

  useEffect(() => {
    dispatch(fetchUsers({ limit: pageSize, skip: (currentPage - 1) * pageSize }));
  }, [dispatch, pageSize, currentPage]);

  const filteredData = searchTerm
    ? data.filter((user) =>
        Object.values(user).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-neutra mb-6">Users</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          data={filteredData}
          columns={columns}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageSizeChange={(size) => dispatch(setPageSize(size))}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
          onSearch={(term) => dispatch(setSearchTerm(term))}
        />
      )}
    </div>
  );
};

export default Users; 