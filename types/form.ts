// EnumOption type
export interface FormidableEnumOption {
  id?: number;
  uuid?: string;
  label: string;
  value: string;
  placeholder: string;
  textbox: boolean;
}

// Enum type
export interface FormidableEnum {
  id?: number;
  uuid?: string;
  enum_options: FormidableEnumOption[];
}

export enum FormidableFieldType {
  Address = "address",
  Checkbox = "checkbox",
  Complex = "complex",
  Date = "date",
  DateTime = "datetime",
  DateRange = "date_range",
  Decimal = "decimal",
  DisplayOnly = "display_only",
  Dropdown = "dropdown",
  EIN = "ein",
  Email = "email",
  File = "file",
  Hex = "hex",
  Hidden = "hidden",
  Integer = "integer",
  IP = "ip",
  IPV4 = "ipv4",
  IPV6 = "ipv6",
  Likert = "likert",
  LongText = "long_text",
  MultipleFiles = "multiple_files",
  PhoneNumber = "phone_number",
  PositiveInteger = "positive_integer",
  Radio = "radio",
  SearchableDropdown = "searchable_dropdown",
  Slider = "slider",
  SocialSecurity = "social_security",
  Text = "text",
  Time = "time",
  TrueFalse = "true_false",
  URL = "url",
  States = "usa_states_dropdown",
  UUID = "uuid",
  YesNo = "yes_no",
  ZIP = "zip",
}

export const TYPES_WITH_ENUM = [
  FormidableFieldType.Checkbox,
  FormidableFieldType.Dropdown,
  FormidableFieldType.Likert,
  FormidableFieldType.Radio,
  FormidableFieldType.SearchableDropdown,
];

// Field type
export interface FormidableField {
  id?: number;
  uuid?: string;
  name: string;
  label: string;
  type: FormidableFieldType | string;
  required: boolean;
  readonly: boolean;
  disabled: boolean;
  hidden: boolean;
  hint: string | null;
  help_text: string | null;
  placeholder: string | null;
  max_length: number | null;
  min_length: number | null;
  max: number | null;
  min: number | null;
  add_more: boolean;
  internal_fields?: FormidableField[] | null; // Change
  enum?: FormidableEnum | null; // Change
  parent?: string | null; // Change
  order?: number; // Change
  page?: string; // Change
}

// Page type
export interface FormidablePage {
  id?: number;
  uuid?: string;
  name: string;
  header: string;
  internal_fields: FormidableField[];
}

// Form type
export interface FormidableForm {
  id: number;
  name: string;
  slug: string;
  review: boolean;
  definition: FormidableFormDefinition;
  schema: Record<string, any>;
  pages: FormidablePage[];
}

export interface FormidableFormDefinition {
  // Change
  id: number;
  name: string;
  pages: FormidablePage[];
  review: boolean;
}
