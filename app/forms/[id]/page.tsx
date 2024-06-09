import Form from "@/components/form";
import { getForm } from "@/services/formData";

const FormPage = async ({ params }: { params: { id: string } }) => {
  // API
  const formData = await getForm({ id: params.id });

  return (
    <div>
      <Form form={formData} />
    </div>
  );
};

export default FormPage;
