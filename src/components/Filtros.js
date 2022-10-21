import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';

export default function Filtros({ children, anchorEl, setAnchorEl }) {
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	return (
		<div>
			<IconButton
				sx={{ color: '#323232', borderColor: 'black' }}
				style={{ fontSize: '1rem' }}
				className="p-2 pl-3"
				aria-describedby={id}
				variant="outlined"
				onClick={handleClick}
			>
				<span className="p-2 pl-3">Filtros</span>
				<FilterListIcon fontSize="large" />
			</IconButton>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<div style={{ minWidth: '300px' }} className="p-3">
					{children}
				</div>
			</Popover>
		</div>
	);
}
