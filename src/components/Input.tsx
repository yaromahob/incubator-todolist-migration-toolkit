import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button} from "@mui/material";
import TextField from '@mui/material/TextField';

type InputPropsType = {
	callback: (title: string) => void
}

export const Input = (props: InputPropsType) => {
	let [title, setTitle] = useState("")
	let [error, setError] = useState<string | null>(null)

	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.currentTarget.value)
	}

	const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		setError(null);
		if (e.charCode === 13) {
			addTask();
		}
	}

	const addTask = () => {
		let newTitle = title.trim();
		if (newTitle !== "") {
			props.callback(newTitle);
			setTitle("");
		} else {
			setError("Title is required");
		}
	}

	return (
		<div>
			<TextField id="outlined-basic"
								 label={error ? 'Title is required' : 'type out here...'}
								 variant="outlined"
								 size={"small"}
								 value={title}
								 onChange={onChangeHandler}
								 onKeyPress={onKeyPressHandler}
								 error={!!error}
			/>
			<Button variant="contained"
							size={"small"}
							style={{maxWidth: "40px", maxHeight: '40px', minWidth: '38px', minHeight: '38px'}}
							onClick={addTask}>
				+
			</Button>
		</div>
	);
};

