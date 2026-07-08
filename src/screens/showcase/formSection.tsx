import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { z } from "zod";

import { Button } from "@/components/button";
import {
  CheckboxField,
  DateField,
  MultiSelectField,
  PasswordField,
  RadioGroupField,
  SelectField,
  SwitchField,
  TextField,
  TextareaField,
  useZodForm,
} from "@/components/form";
import { toast } from "@/lib/toast";

import { ShowcaseSection } from "./showcaseSection";

const ROLE_OPTIONS = [
  { label: "Desenvolvedor", value: "dev" },
  { label: "Designer", value: "design" },
  { label: "Produto", value: "product" },
];

const CITY_OPTIONS = [
  { label: "São Paulo", value: "sp" },
  { label: "Rio de Janeiro", value: "rj" },
  { label: "Belo Horizonte", value: "bh" },
  { label: "Curitiba", value: "cwb" },
  { label: "Porto Alegre", value: "poa" },
  { label: "Recife", value: "rec" },
];

const CONTACT_OPTIONS = [
  { label: "E-mail", value: "email" },
  { label: "Telefone", value: "phone" },
  { label: "WhatsApp", value: "whatsapp" },
];

const SKILL_OPTIONS = [
  { label: "React Native", value: "rn" },
  { label: "TypeScript", value: "ts" },
  { label: "UI/UX", value: "uiux" },
  { label: "Node.js", value: "node" },
  { label: "Testes", value: "tests" },
];

const formSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(8, "Mínimo de 8 caracteres."),
  bio: z.string().max(160, "Máximo de 160 caracteres.").optional(),
  role: z.string().min(1, "Selecione um cargo."),
  city: z.string().min(1, "Selecione uma cidade."),
  skills: z.array(z.string()).min(1, "Selecione ao menos uma habilidade."),
  contact: z.string().min(1, "Escolha uma forma de contato."),
  birthDate: z
    .date()
    .nullable()
    .refine((value) => value !== null, "Selecione a data."),
  notifications: z.boolean(),
  terms: z
    .boolean()
    .refine((value) => value, "Você precisa aceitar os termos."),
});

type FormValues = z.input<typeof formSchema>;

const defaultValues: FormValues = {
  name: "",
  email: "",
  password: "",
  bio: "",
  role: "",
  city: "",
  skills: [],
  contact: "",
  birthDate: null,
  notifications: true,
  terms: false,
};

export function FormSection() {
  const form = useZodForm(formSchema, { defaultValues });

  const handleSubmit = form.handleSubmit(() => {
    toast.success("Formulário enviado.");
  });

  return (
    <ShowcaseSection
      title="Formulário"
      description="useZodForm + campos ligados por control/name, validação com Zod."
    >
      <View style={styles.form}>
        <TextField
          control={form.control}
          name="name"
          label="Nome"
          placeholder="Seu nome"
        />
        <TextField
          control={form.control}
          name="email"
          label="E-mail"
          placeholder="voce@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <PasswordField
          control={form.control}
          name="password"
          label="Senha"
          placeholder="Mínimo de 8 caracteres"
        />
        <TextareaField
          control={form.control}
          name="bio"
          label="Bio"
          description="Opcional, até 160 caracteres."
          placeholder="Fale um pouco sobre você"
        />
        <SelectField
          control={form.control}
          name="role"
          label="Cargo"
          title="Selecione o cargo"
          placeholder="Selecione"
          options={ROLE_OPTIONS}
        />
        <SelectField
          control={form.control}
          name="city"
          label="Cidade"
          title="Selecione a cidade"
          placeholder="Selecione"
          searchable
          options={CITY_OPTIONS}
        />
        <MultiSelectField
          control={form.control}
          name="skills"
          label="Habilidades"
          title="Selecione as habilidades"
          placeholder="Selecione"
          searchable
          options={SKILL_OPTIONS}
        />
        <RadioGroupField
          control={form.control}
          name="contact"
          label="Forma de contato preferida"
          options={CONTACT_OPTIONS}
        />
        <DateField
          control={form.control}
          name="birthDate"
          label="Data de nascimento"
          mode="date"
          placeholder="Selecionar data"
        />
        <SwitchField
          control={form.control}
          name="notifications"
          label="Notificações"
          description="Receber avisos por push."
        />
        <CheckboxField
          control={form.control}
          name="terms"
          label="Li e aceito os termos de uso."
        />
        <Button onPress={handleSubmit} loading={form.formState.isSubmitting}>
          Enviar
        </Button>
      </View>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create((theme) => ({
  form: {
    gap: theme.gap(2),
  },
}));
