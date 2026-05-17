/**
 * User management page configuration.
 */
import {
  Mail,
  User,
  Shield,
  Activity,
  UserPlus,
  UserPen,
  UserSearch,
} from "lucide-react";

export const userManagementConfig = {
  pageTitleKey: "user.pageTitle",
  descriptionKey: "user.description",
  label: "user",
  filterDescriptionKey: "user.filterDescription",
  searchPlaceholderKey: "user.searchPlaceholder",
  avatarIcon: User,
  viewFields: [
    {
      labelKey: "user.fields.userId",
      value: "userId",
      icon: User,
    },
    {
      labelKey: "user.fields.name",
      value: "name",
      icon: User,
    },
    {
      labelKey: "user.fields.email",
      value: "email",
      icon: Mail,
    },
    {
      labelKey: "user.fields.role",
      value: "role",
      icon: Shield,
    },
    {
      labelKey: "user.fields.status",
      value: "status",
      icon: Activity,
      isStatus: true,
    },
  ],
  dialog: {
    add: {
      icon: UserPlus,
      titleKey: "user.add.title",
      descriptionKey: "user.add.description",
    },
    edit: {
      icon: UserPen,
      titleKey: "user.edit.title",
      descriptionKey: "user.edit.description",
    },
    view: {
      icon: UserSearch,
      titleKey: "user.view.title",
      descriptionKey: "user.view.description",
    },
  },
  delete: {
    titleKey: "user.delete.title",
    descriptionKey: "user.delete.description",
    confirmButtonKey: "user.delete.confirmButton",
  },
  pagination: {
    showingKey: "user.pagination.showing",
    rowsKey: "user.pagination.rows",
  },
  form: {
    userId: {
      labelKey: "user.form.userId.label",
      placeholderKey: "user.form.userId.placeholder",
    },
    name: {
      labelKey: "user.form.name.label",
      placeholderKey: "user.form.name.placeholder",
    },
    email: {
      labelKey: "user.form.email.label",
      placeholderKey: "user.form.email.placeholder",
    },
    password: {
      labelKey: "user.form.password.label",
      placeholderKey: "user.form.password.placeholder",
      hintNewKey: "user.form.password.hintNew",
      hintEditKey: "user.form.password.hintEdit",
    },
    role: {
      labelKey: "user.form.role.label",
      placeholderKey: "user.form.role.placeholder",
    },
    status: {
      labelKey: "user.form.status.label",
      placeholderKey: "user.form.status.placeholder",
    },
    resetButton: "user.form.resetButton",
    saveButton: "user.form.saveButton",
    savingText: "user.form.savingText",
  },
  table: {
    no: "user.table.no",
    userId: "user.table.userId",
    name: "user.table.name",
    email: "user.table.email",
    role: "user.table.role",
    status: "user.table.status",
    createdAt: "user.table.createdAt",
    actions: "user.table.actions",
    noResults: "user.table.noResults",
  },
};
