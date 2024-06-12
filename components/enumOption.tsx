import { FormidableEnumOption } from "@/types/form";
import { Delete } from "@mui/icons-material";
import {
  Button,
  Collapse,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
} from "@mui/material";
import React from "react";

type EnumOptionProps = {
  enumOption: FormidableEnumOption;
  isEditing: boolean;
  onEnumOptionChange: (newEnumOption: FormidableEnumOption) => void;
  onRemove: () => void;
  onFinishEditing: () => void;
  onBeginEditing: () => void;
};

const EnumOption = ({
  enumOption,
  isEditing,
  onEnumOptionChange,
  onRemove,
  onFinishEditing,
  onBeginEditing,
}: EnumOptionProps) => {
  // STATE

  // HANDLERS
  const handleEditButtonClick = () => {
    if (isEditing) {
      onFinishEditing();
    } else {
      onBeginEditing();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center justify-start gap-1">
          <h3 className="text-black">{enumOption.label}</h3>
          <Button onClick={handleEditButtonClick}>
            {isEditing ? "Collapse" : "Edit"}
          </Button>
        </div>
        <IconButton onClick={onRemove}>
          <Delete />
        </IconButton>
      </div>
      <Collapse in={isEditing}>
        <div className="flex flex-col py-1 space-y-2">
          <TextField
            value={enumOption.label}
            onChange={(e) =>
              onEnumOptionChange({ ...enumOption, label: e.target.value })
            }
            label="Label"
          ></TextField>
          <TextField
            value={enumOption.placeholder}
            onChange={(e) =>
              onEnumOptionChange({ ...enumOption, placeholder: e.target.value })
            }
            label="Placeholder"
          ></TextField>
          <TextField
            value={enumOption.value}
            onChange={(e) =>
              onEnumOptionChange({ ...enumOption, value: e.target.value })
            }
            label="Value"
          ></TextField>
          <FormControlLabel
            control={
              <Switch
                checked={enumOption.textbox}
                onChange={(e) =>
                  onEnumOptionChange({
                    ...enumOption,
                    textbox: e.target.checked,
                  })
                }
              ></Switch>
            }
            label="Textbox"
            className="text-black"
          />
        </div>
      </Collapse>
    </div>
  );
};

export default EnumOption;
