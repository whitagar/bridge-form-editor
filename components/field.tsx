"use client";

import {
  FormidableEnumOption,
  FormidableField,
  FormidableFieldType,
} from "@/types/form";
import { OnDragEndResponder } from "@hello-pangea/dnd";
import { Delete } from "@mui/icons-material";
import {
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import List, { reorder } from "./list";
import ListItem from "./listItem";
import { useState } from "react";
import { v4 } from "uuid";
import EnumOption from "./enumOption";

type FieldProps = {
  field: FormidableField;
  isEditing: boolean;
  onFieldChange: (newField: FormidableField) => void;
  onRemove: () => void;
  onBeginEditing: () => void;
  onFinishEditing: () => void;
};

const Field = ({
  field,
  isEditing,
  onFieldChange,
  onRemove,
  onBeginEditing,
  onFinishEditing,
}: FieldProps) => {
  // STATE
  const [isEditingByField, setIsEditingByField] = useState<
    Record<string, boolean>
  >({});
  const [isEditingByEnumOption, setIsEditingByEnumOption] = useState<
    Record<string, boolean>
  >({});

  // CALCULATED
  const shouldAllowFieldDrag = Object.values(isEditingByField).every(
    (val) => !val
  );
  const shouldAllowEnumOptionDrag = Object.values(isEditingByEnumOption).every(
    (val) => !val
  );

  // HANDLERS

  const handleEditButtonClick = () => {
    if (isEditing) {
      onFinishEditing();
    } else {
      onBeginEditing();
    }
  };

  const handleEnumOptionDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination || !field.enum?.enum_options) {
      return;
    }

    const newOptions = reorder<FormidableEnumOption>(
      field.enum.enum_options,
      result.source.index,
      result.destination.index
    );

    onFieldChange({
      ...field,
      enum: { ...field.enum, enum_options: newOptions },
    });
  };

  const handleFieldDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination || !field.internal_fields) {
      return;
    }

    const newFields = reorder<FormidableField>(
      field.internal_fields,
      result.source.index,
      result.destination.index
    );

    onFieldChange({ ...field, internal_fields: newFields });
  };

  const handleAddField = () => {
    const newFields = [
      ...(field.internal_fields || []),
      {
        uuid: v4(),
        name: "New field",
        label: "New field",
        type: FormidableFieldType.Text,
        required: false,
        readonly: false,
        disabled: false,
        hidden: false,
        help_text: null,
        hint: null,
        placeholder: null,
        max_length: null,
        min_length: null,
        max: null,
        min: null,
        add_more: false,
      },
    ];
    onFieldChange({
      ...field,
      internal_fields: newFields,
    });
  };

  const handleAddEnumOption = () => {
    const newEnumOptions: FormidableEnumOption[] = [
      ...(field.enum?.enum_options || []),
      {
        uuid: v4(),
        label: "New enum option",
        placeholder: "",
        value: "",
        textbox: false,
      },
    ];
    onFieldChange({
      ...field,
      enum: {
        ...field.enum,
        enum_options: newEnumOptions,
      },
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center justify-start gap-1">
          <h3 className="text-black">{field.name}</h3>
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
            value={field.name}
            onChange={(e) => onFieldChange({ ...field, name: e.target.value })}
            label="Name"
          ></TextField>
          <TextField
            value={field.label}
            onChange={(e) => onFieldChange({ ...field, label: e.target.value })}
            label="Label"
          ></TextField>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              id={`field-${field.name}-type-select`}
              value={field.type}
              onChange={(e) =>
                onFieldChange({ ...field, type: e.target.value })
              }
              variant="outlined"
            >
              {Object.entries(FormidableFieldType).map(([label, t], idx) => {
                return (
                  <MenuItem
                    key={`field-${
                      field.id ?? field.uuid ?? field.name
                    }-item-${idx}`}
                    value={t}
                    color="secondary"
                  >
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {field.enum && (
            <>
              <div className="flex items-center justify-start">
                <h3 className="text-black">Enum Options</h3>
                <Button onClick={handleAddEnumOption}>
                  Add new enum option
                </Button>
              </div>
              <List
                id={`enum-${field.enum.id ?? field.enum.uuid}`}
                onDragEnd={handleEnumOptionDragEnd}
                draggable={shouldAllowEnumOptionDrag}
              >
                {field.enum.enum_options.map((option, optionIndex) => {
                  const id = option.id ?? option.uuid ?? option.label;

                  return (
                    <ListItem
                      id={id.toString()}
                      key={id}
                      index={optionIndex}
                      draggable={shouldAllowEnumOptionDrag}
                    >
                      <EnumOption
                        enumOption={option}
                        isEditing={isEditingByEnumOption[id]}
                        onEnumOptionChange={(newEnumOption) => {
                          const newEnumOptions = field.enum?.enum_options || [];
                          newEnumOptions.splice(optionIndex, 1, newEnumOption);
                          onFieldChange({
                            ...field,
                            enum: {
                              ...field.enum,
                              enum_options: newEnumOptions,
                            },
                          });
                        }}
                        onRemove={() => {
                          const newEnumOptions = field.enum?.enum_options || [];
                          newEnumOptions.splice(optionIndex, 1);
                          onFieldChange({
                            ...field,
                            enum: {
                              ...field.enum,
                              enum_options: newEnumOptions,
                            },
                          });
                        }}
                        onFinishEditing={() => {
                          setIsEditingByEnumOption((prev) => {
                            return { ...prev, [id]: false };
                          });
                        }}
                        onBeginEditing={() => {
                          setIsEditingByEnumOption((prev) => {
                            return { ...prev, [id]: true };
                          });
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </>
          )}
          <TextField
            value={field.hint}
            onChange={(e) =>
              onFieldChange({
                ...field,
                hint: e.target.value || null,
              })
            }
            label="Hint"
          ></TextField>
          <TextField
            value={field.help_text}
            onChange={(e) =>
              onFieldChange({
                ...field,
                help_text: e.target.value || null,
              })
            }
            label="Help text"
          ></TextField>
          <TextField
            value={field.placeholder}
            onChange={(e) =>
              onFieldChange({
                ...field,
                placeholder: e.target.value || null,
              })
            }
            label="Placeholder"
          ></TextField>
          <div className="flex items-center justify-start flex-wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={field.required}
                  onChange={(e) =>
                    onFieldChange({ ...field, required: e.target.checked })
                  }
                ></Switch>
              }
              label="Required"
              className="text-black"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={field.readonly}
                  onChange={(e) =>
                    onFieldChange({ ...field, readonly: e.target.checked })
                  }
                ></Switch>
              }
              label="Read only"
              className="text-black"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={field.disabled}
                  onChange={(e) =>
                    onFieldChange({ ...field, disabled: e.target.checked })
                  }
                ></Switch>
              }
              label="Disabled"
              className="text-black"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={field.hidden}
                  onChange={(e) =>
                    onFieldChange({ ...field, hidden: e.target.checked })
                  }
                ></Switch>
              }
              label="Hidden"
              className="text-black"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={field.add_more}
                  onChange={(e) =>
                    onFieldChange({ ...field, add_more: e.target.checked })
                  }
                ></Switch>
              }
              label="Add more"
              className="text-black"
            />
          </div>

          <div className="flex items-center justify-start flex-wrap">
            <TextField
              value={field.max_length}
              type="number"
              onChange={(e) =>
                onFieldChange({
                  ...field,
                  max_length: parseInt(e.target.value),
                })
              }
              label="Max length"
            ></TextField>
            <TextField
              value={field.min_length}
              type="number"
              onChange={(e) =>
                onFieldChange({
                  ...field,
                  min_length: parseInt(e.target.value),
                })
              }
              label="Min length"
            ></TextField>
            <TextField
              value={field.max}
              type="number"
              onChange={(e) =>
                onFieldChange({
                  ...field,
                  max: parseInt(e.target.value),
                })
              }
              label="Max (#)"
            ></TextField>
            <TextField
              value={field.min}
              type="number"
              onChange={(e) =>
                onFieldChange({
                  ...field,
                  min: parseInt(e.target.value),
                })
              }
              label="Min (#)"
            ></TextField>
          </div>

          {field.type === "complex" && (
            <>
              <div className="flex items-center justify-start">
                <h3 className="text-black">Stacked Fields</h3>
                <Button onClick={handleAddField}>Add new field</Button>
              </div>
              <List
                id={`droppableFieldList${field.id ?? field.uuid ?? field.name}`}
                onDragEnd={handleFieldDragEnd}
                draggable={shouldAllowFieldDrag}
              >
                {(field.internal_fields || []).map(
                  (internalField, internalIndex) => {
                    const id = `${
                      internalField.id ??
                      internalField.uuid ??
                      internalField.name
                    }`;
                    return (
                      <ListItem
                        draggable={shouldAllowFieldDrag}
                        key={id}
                        id={id}
                        index={internalIndex}
                      >
                        <Field
                          onFieldChange={(newField) => {
                            const newFields = field.internal_fields || [];
                            newFields.splice(internalIndex, 1, newField);
                            onFieldChange({
                              ...field,
                              internal_fields: newFields,
                            });
                          }}
                          onRemove={() => {
                            const newFields = field.internal_fields || [];
                            newFields.splice(internalIndex, 1);
                            onFieldChange({
                              ...field,
                              internal_fields: newFields,
                            });
                          }}
                          onBeginEditing={() => {
                            setIsEditingByField((prev) => {
                              return { ...prev, [id]: true };
                            });
                          }}
                          onFinishEditing={() => {
                            setIsEditingByField((prev) => {
                              return { ...prev, [id]: false };
                            });
                          }}
                          isEditing={isEditingByField[id] || false}
                          field={internalField}
                        />
                      </ListItem>
                    );
                  }
                )}
              </List>
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default Field;
