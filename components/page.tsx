"use client";

import {
  FormidableField,
  FormidableFieldType,
  FormidablePage,
} from "@/types/form";
import { Button, Collapse, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { OnDragEndResponder } from "@hello-pangea/dnd";
import List, { reorder } from "./list";
import ListItem from "./listItem";
import Field from "./field";
import { useState } from "react";
import { v4 } from "uuid";

type FormPageProps = {
  page: FormidablePage;
  isEditing: boolean;
  onPageChange: (newPage: FormidablePage) => void;
  onRemove: () => void;
  onBeginEditing: () => void;
  onFinishEditing: () => void;
};

const FormPage = ({
  page,
  isEditing,
  onPageChange,
  onRemove,
  onBeginEditing,
  onFinishEditing,
}: FormPageProps) => {
  // STATE
  const [isEditingByField, setIsEditingByField] = useState<
    Record<string, boolean>
  >({});

  // CALCULATED
  const shouldAllowFieldDrag = Object.values(isEditingByField).every(
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

  const handleFieldDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      return;
    }

    const newFields = reorder<FormidableField>(
      page.internal_fields,
      result.source.index,
      result.destination.index
    );
    onPageChange({ ...page, internal_fields: newFields });
  };

  const handleAddField = () => {
    onPageChange({
      ...page,
      internal_fields: [
        ...(page.internal_fields || []),
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
      ],
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center justify-start gap-1">
          <h3 className="text-black">{page.name}</h3>
          <Button onClick={handleEditButtonClick}>
            {isEditing ? "Collapse" : "Edit"}
          </Button>
        </div>
        <IconButton onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
      </div>
      <Collapse in={isEditing}>
        <div className="flex flex-col py-1 space-y-2">
          <TextField
            value={page.name}
            onChange={(e) => onPageChange({ ...page, name: e.target.value })}
            label="Name"
          ></TextField>
          <TextField
            value={page.header}
            onChange={(e) => onPageChange({ ...page, header: e.target.value })}
            label="Header"
          ></TextField>
          <div className="flex items-center justify-start">
            <h3 className="text-black">Form Fields</h3>
            <Button onClick={handleAddField}>Add new field</Button>
          </div>
          <List
            id={`droppableFieldPage${page.id ?? page.uuid ?? page.name}`}
            onDragEnd={handleFieldDragEnd}
            draggable={shouldAllowFieldDrag}
          >
            {page.internal_fields.map((field, index) => {
              const id = `${field.id ?? field.uuid ?? field.name}`;
              return (
                <ListItem
                  draggable={shouldAllowFieldDrag}
                  key={id}
                  id={id}
                  index={index}
                >
                  <Field
                    onFieldChange={(newField) => {
                      const newFields = page.internal_fields;
                      newFields.splice(index, 1, newField);
                      onPageChange({ ...page, internal_fields: newFields });
                    }}
                    onRemove={() => {
                      const newFields = page.internal_fields;
                      newFields.splice(index, 1);
                      onPageChange({ ...page, internal_fields: newFields });
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
                    field={field}
                  />
                </ListItem>
              );
            })}
          </List>
        </div>
      </Collapse>
    </div>
  );
};

export default FormPage;
