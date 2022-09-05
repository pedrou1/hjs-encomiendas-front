import { InputLabel, FormHelperText } from '@mui/material';
import { AsyncPaginate } from 'react-select-async-paginate';

function SelectPaginate({ label, value, loadOptions, setOnChange, errorLabel, styleInputLabel = {} }) {
	return (
		<>
			<InputLabel sx={styleInputLabel}>{label}</InputLabel>
			<AsyncPaginate
				value={value}
				loadOptions={loadOptions}
				onChange={(c) => {
					setOnChange(c);
				}}
				menuPortalTarget={document.querySelector('body')}
			/>
			<FormHelperText
				error={Boolean(true)}
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					padding: '0 10px',
				}}
			>
				{!value.value && <span>{errorLabel}</span>}
			</FormHelperText>
		</>
	);
}

export default SelectPaginate;
