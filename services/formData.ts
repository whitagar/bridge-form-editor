import { FormidableForm } from "@/types/form";

type GetFormInput = {
  id: string;
};

export const getForm = async ({ id }: GetFormInput) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/form/${id}/`,
    { cache: "no-cache" }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const form = await res.json();

  return form as FormidableForm;
};

export const putForm = async (form: FormidableForm) => {
  const url = `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/form/${form.id}/`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    throw new Error("Failed to PUT data");
  }
};
