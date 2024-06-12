import Form from "@/components/form";
import PasswordProtection from "@/components/passwordProtection";
import { getForm } from "@/services/formData";

const FormPage = async ({ params }: { params: { id: string } }) => {
  // API
  const formData = await getForm({ id: params.id });

  return (
    <PasswordProtection>
      <Form form={formData} />
    </PasswordProtection>
  );
};

export default FormPage;
