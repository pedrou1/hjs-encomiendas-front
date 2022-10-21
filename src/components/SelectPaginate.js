import { InputLabel, FormHelperText } from '@mui/material';
import { AsyncPaginate } from 'react-select-async-paginate';

function SelectPaginate({ label, value, loadOptions, setOnChange, errorLabel, styleInputLabel = {}, menuPortalTargetName = 'body', stylesCustm }) {
	return (
		<>
			<InputLabel sx={styleInputLabel}>{label}</InputLabel>
			<AsyncPaginate
				value={value}
				loadOptions={loadOptions}
				onChange={(c) => {
					setOnChange(c);
				}}
				menuPortalTarget={document.querySelector(menuPortalTargetName)}
				loadingMessage={() => 'Cargando...'}
				noOptionsMessage={() => 'No se ha encontrado datos'}
				styles={stylesCustm}
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
