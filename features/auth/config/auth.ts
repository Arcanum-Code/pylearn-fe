import { User } from "lucide-react";

export const authConfig = {
  pageTitleKey: "auth.pageTitle",
  systemNameKey: "auth.systemName",
  systemDescriptionKey: "auth.systemDescription",
  avatarIcon: User,
  form: {
    welcomeTitleKey: "auth.form.welcomeTitle",
    welcomeDescriptionKey: "auth.form.welcomeDescription",
    userId: {
      labelKey: "auth.form.userId.label",
      placeholderKey: "auth.form.userId.placeholder",
    },
    password: {
      labelKey: "auth.form.password.label",
      placeholderKey: "auth.form.password.placeholder",
      showKey: "auth.form.password.show",
      hideKey: "auth.form.password.hide",
    },
    submit: {
      loginKey: "auth.form.submit.login",
      loggingInKey: "auth.form.submit.loggingIn",
    },
  },
  messages: {
    loginSuccessKey: "auth.messages.loginSuccess",
    loginErrorKey: "auth.messages.loginError",
    logoutSuccessKey: "auth.messages.logoutSuccess",
    logoutErrorKey: "auth.messages.logoutError",
    fetchUserErrorKey: "auth.messages.fetchUserError",
    refreshSessionErrorKey: "auth.messages.refreshSessionError",
    networkErrorKey: "auth.messages.networkError",
    unauthorizedKey: "auth.messages.unauthorized",
  },
};
