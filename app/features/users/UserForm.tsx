import { useEffect, useMemo } from "react";
import { z } from "zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarPicker, FormField, Input, Select, Checkbox } from "~/components";
import { useI18n } from "~/hooks/useI18n";
import { getDefaultValues } from "./userForm.defaults";
import type { User } from "./types/types";

type UserFormProps = {
  id: string;
  user?: User | null;
  onSubmit: (values: UserFormValues) => void | Promise<void>;
  isPending?: boolean;
};

const createUserSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    primaryPosition: z.string(),
    secondaryPosition: z.string(),
    password: z.string().optional().or(z.literal("")),
    passwordConfirm: z.string().optional().or(z.literal("")),
    phone: z.string().min(1, "Phone is required"),
    avatar: z.instanceof(File).nullable().optional(),
    generatePassword: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (!data.generatePassword) {
      if (!data.password || data.password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 6 characters",
          path: ["password"],
        });
      }

      if (!data.passwordConfirm || data.passwordConfirm.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password confirmation must be at least 6 characters",
          path: ["passwordConfirm"],
        });
      }
    }

    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["passwordConfirm"],
      });
    }
  });

const updateUserSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    primaryPosition: z.string(),
    secondaryPosition: z.string(),
    password: z.string().optional().or(z.literal("")),
    passwordConfirm: z.string().optional().or(z.literal("")),
    phone: z.string().min(1, "Phone is required"),
    avatar: z.instanceof(File).nullable().optional(),
  })
  .refine(
    (data) => (!data.password && !data.passwordConfirm) || data.password === data.passwordConfirm,
    {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    },
  );

export type UserFormValues = z.infer<typeof createUserSchema> | z.infer<typeof updateUserSchema>;

const UserForm = ({ id, user, onSubmit }: UserFormProps) => {
  const { t } = useI18n();
  const isEditMode = !!user;
  const schema = isEditMode ? updateUserSchema : createUserSchema;

  const roleOptions = useMemo(
    () => [
      { value: "GK", label: t("user.roles.gk") },
      { value: "DF", label: t("user.roles.df") },
      { value: "MD", label: t("user.roles.md") },
      { value: "FW", label: t("user.roles.fw") },
    ],
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(user),
  });

  useEffect(() => {
    reset(getDefaultValues(user));
  }, [user, reset]);

  const primaryPosition = useWatch({ control, name: "primaryPosition" });
  const secondaryPosition = useWatch({ control, name: "secondaryPosition" });
  const generatePassword = useWatch({
    control,
    name: isEditMode ? undefined : "generatePassword",
  });
  const secondaryPositionOptions = useMemo(() => {
    if (!primaryPosition) return roleOptions;
    return roleOptions.filter((o) => o.value !== primaryPosition);
  }, [primaryPosition, roleOptions]);

  useEffect(() => {
    if (!primaryPosition) return;
    if (secondaryPosition && secondaryPosition === primaryPosition) {
      setValue("secondaryPosition", "");
    }
  }, [primaryPosition, secondaryPosition, setValue]);

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-2">
        <FormField
          label={t("user.profileImage")}
          htmlFor="name"
          required
          error={errors.avatarFilemame?.message}
        >
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <AvatarPicker
                valueUrl={user?.avatarFilename ?? null}
                valueFile={field.value}
                onChange={field.onChange}
                fallbackInitials="NM"
              />
            )}
          />
        </FormField>
      </div>
      <div className="mt-2">
        <FormField label={t("user.name")} htmlFor="name" required error={errors.name?.message}>
          <Input id="name" type="text" {...register("name")} />
        </FormField>
      </div>
      <div className="mt-4">
        <FormField
          label={t("auth.email.label")}
          htmlFor="email"
          required
          error={errors.email?.message}
        >
          <Input id="email" type="email" {...register("email")}></Input>
        </FormField>
        {/*<FormError error={errors.email} />*/}
      </div>
      <div className="mt-4">
        <FormField label={t("user.phone")} htmlFor="phone" required error={errors.phone?.message}>
          <Input id="phone" type="tel" {...register("phone")} />
        </FormField>

        {/*<FormError error={errors.phone} />*/}
      </div>
      <div className="mt-4">
        <FormField
          label={t("user.primaryPosition")}
          htmlFor="primaryRole"
          required
          error={errors.primaryPosition?.message}
        >
          <Controller
            name="primaryPosition"
            control={control}
            rules={{ required: "Role is required" }}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Select
                  options={roleOptions}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Select a position…"
                />
                {fieldState.error && (
                  <p className="text-sm text-red-600">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </FormField>

        {/*<FormError error={errors.phone} />*/}
      </div>
      <div className="mt-4">
        <FormField
          label={t("user.secondaryPosition")}
          htmlFor="secondaryPosition"
          required
          error={errors.secondaryPosition?.message}
        >
          <Controller
            name="secondaryPosition"
            control={control}
            rules={{ required: "Role is required" }}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Select
                  options={secondaryPositionOptions}
                  disabled={!primaryPosition}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Select a position…"
                />
                {fieldState.error && (
                  <p className="text-sm text-red-600">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </FormField>
        {!isEditMode && (
          <div className="mt-4">
            <FormField htmlFor="generatePassword" error={errors.generatePassword?.message}>
              <Controller
                name="generatePassword"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    name={field.name}
                    label={t("user.generatePassword")}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            </FormField>
          </div>
        )}
        {!isEditMode && !generatePassword && (
          <>
            <div className="mt-4">
              <FormField
                label={t("auth.password.label")}
                htmlFor="password"
                required
                error={errors.password?.message}
              >
                <Input id="password" type="password" {...register("password")} />
              </FormField>
            </div>

            <div className="mt-4">
              <FormField
                label={t("auth.passwordConfirm")}
                htmlFor="passwordConfirm"
                required
                error={errors.passwordConfirm?.message}
              >
                <Input id="passwordConfirm" type="password" {...register("passwordConfirm")} />
              </FormField>
            </div>
          </>
        )}
      </div>
    </form>
  );
};
// @ts-expect-error
export default UserForm;
