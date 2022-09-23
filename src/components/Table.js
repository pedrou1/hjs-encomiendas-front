import DataTable from 'react-data-table-component';
import { Paper, TableContainer, Box, Skeleton, CircularProgress } from '@mui/material';
import SortIcon from '@mui/icons-material/ArrowDownward';
import { useState, useEffect } from 'react';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import { defaultStyles } from '../utils/defaultStyles';

const Table = ({ title, data, columns, totalRows, onPageChange, onRowClicked }) => {
	const [pageSize, setPageSize] = useState(10);
	const [pageIndex, setPageIndex] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (data.length) setLoading(false);
		else {
			setTimeout(() => {
				setLoading(false);
			}, 600);
		}
	}, [data]);

	const handlePageChange = async (page) => {
		const paginationData = { PageIndex: (page - 1) * pageSize, PageSize: pageSize };
		setPageIndex((page - 1) * pageSize);
		setLoading(true);
		await onPageChange(paginationData);
	};

	const handlePerRowsChange = async (newPageSize, page) => {
		// cambio de cantidad de paginacion
		console.log(newPageSize, page);
		const paginationData = { PageIndex: (page - 1) * pageSize, PageSize: newPageSize };
		setPageSize(newPageSize);
		setLoading(true);
		await onPageChange(paginationData);
	};

	return (
		<TableContainer component={Paper} className="mb-4 mt-2" sx={data && !data.length && !loading ? styles.tableEmpty : { ...defaultStyles.boxShadow }}>
			<DataTable
				title={<div className="mt-4">{title}</div>}
				columns={columns}
				data={data}
				pagination
				sortIcon={<SortIcon />}
				progressPending={loading || false}
				paginationServer
				highlightOnHover
				paginationPerPage={pageSize}
				paginationTotalRows={totalRows}
				paginationDefaultPage={1}
				onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
					handlePerRowsChange(currentRowsPerPage, currentPage);
				}}
				onChangePage={(page, totalRows) => {
					handlePageChange(page, totalRows);
				}}
				pointerOnHover
				onRowClicked={onRowClicked}
				noDataComponent={
					<div className="text-muted" style={styles.emptyText}>
						<FolderOffIcon />
						<span className="ml-3">No hay datos</span>
					</div>
				}
				paginationComponentOptions={{ rowsPerPageText: 'Filas por página:', rangeSeparatorText: 'de', selectAllRowsItemText: 'Todos' }}
				progressComponent={
					<Box sx={{ width: '95%' }}>
						<Skeleton variant="text" sx={{ my: 0, mx: 1, p: 2 }} />
						{[...Array(8)].map((e, i) => (
							<Skeleton key={i} variant="text" sx={{ my: 3, mx: 1, p: 1 }} />
						))}
					</Box>
				}
			/>
		</TableContainer>
	);
};

export default Table;

const styles = {
	buttonActive: {
		color: '#0a58ca',
		backgroundColor: 'rgba(0, 0, 0, 0.04)',
	},
	tableEmpty: {
		paddingBottom: 40,
	},
	emptyText: {
		paddingTop: '20%',
	},
};
