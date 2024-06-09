"use client";

import { FormidableForm, FormidablePage } from "@/types/form";
import { OnDragEndResponder } from "@hello-pangea/dnd";
import FormPage from "./page";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { putForm } from "@/services/formData";
import { toast } from "react-hot-toast";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button } from "@mui/material";
import { v4 } from "uuid";
import List, { reorder } from "./list";
import ListItem from "./listItem";

type FormProps = {
  form: FormidableForm;
};

const Form = ({ form }: FormProps) => {
  // STATE
  const [formData, setFormData] = useState<FormidableForm>(form);
  const [isEditingByPage, setIsEditingByPage] = useState<
    Record<string, boolean>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  // CALCULATED
  const shouldAllowDrag = Object.values(isEditingByPage).every((val) => !val);

  // HANDLERS
  const handlePageDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      return;
    }

    const newPages = reorder<FormidablePage>(
      form.pages,
      result.source.index,
      result.destination.index
    );
    setFormData((prev) => {
      return { ...prev, pages: newPages };
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await putForm(formData);
      setIsSaving(false);
    } catch (e: unknown) {
      toast((e as Error).message, { icon: <CancelIcon color="error" /> });
      setIsSaving(false);
    }
  };

  const handleAddPage = () => {
    setFormData((prev) => {
      return {
        ...prev,
        pages: [
          ...prev.pages,
          {
            header: "New Page",
            name: "New Page",
            internal_fields: [],
            uuid: v4(),
          },
        ],
      };
    });
  };

  return (
    <div className="space-y-2">
      <h1>{formData.name}</h1>
      <div className="flex items-center justify-start gap-2">
        <h2>Pages</h2>
        <Button onClick={handleAddPage}>Add new</Button>
      </div>
      <List
        draggable={shouldAllowDrag}
        id="droppablePage"
        onDragEnd={handlePageDragEnd}
      >
        {formData.pages.map((page, index) => {
          const id = `${page.id ?? page.uuid ?? page.name}`;
          return (
            <ListItem
              draggable={shouldAllowDrag}
              index={index}
              key={id}
              id={id}
            >
              <FormPage
                page={page}
                onPageChange={(newPage) => {
                  setFormData((prev) => {
                    const newPages = formData.pages;
                    newPages.splice(index, 1, newPage);
                    return { ...prev, pages: newPages };
                  });
                }}
                onRemove={() => {
                  setFormData((prev) => {
                    const newPages = formData.pages;
                    newPages.splice(index, 1);
                    return { ...prev, pages: newPages };
                  });
                }}
                isEditing={isEditingByPage[id] || false}
                onBeginEditing={() => {
                  setIsEditingByPage((prev) => {
                    return { ...prev, [id]: true };
                  });
                }}
                onFinishEditing={() => {
                  setIsEditingByPage((prev) => {
                    return { ...prev, [id]: false };
                  });
                }}
              />
            </ListItem>
          );
        })}
      </List>
      <LoadingButton
        variant="contained"
        loading={isSaving}
        onClick={handleSave}
      >
        Save All
      </LoadingButton>
    </div>
  );
};

export default Form;
