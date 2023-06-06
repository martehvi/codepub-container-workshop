import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Ingredients from "../files/Ingredients.json";
import { Paper } from "@mui/material";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface SearchBoxProps {
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
}

function SearchBox(props: SearchBoxProps) {
  return (
    <Autocomplete
      multiple
      id="tags-outlined"
      options={Ingredients}
      getOptionLabel={(option) => option}
      filterSelectedOptions
      disableCloseOnSelect
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      onChange={(event: any, newValue: string[]) => {
        props.setIngredients(newValue);
      }}
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            variant="filled"
            sx={{
              backgroundColor: "#94b0d1",
              borderColor: "#232323",
              color: "#232323",
            }}
            label={option}
            {...getTagProps({ index })}
          />
        ))
      }
      PaperComponent={({ children }) => (
        <Paper sx={{ backgroundColor: "#f3f3f3", opacity: 0.9 }}>
          {children}
        </Paper>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Ingredients" variant="outlined" />
      )}
      sx={{
        width: "75%",
        backgroundColor: "#f3f3f3",
        opacity: 0.9,
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "1px solid #232323",
        },
        "& label.Mui-focused": {
          color: "#232323",
        },
      }}
    />
  );
}

export default SearchBox;
