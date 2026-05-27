import { Suspense } from "react";
import LoginForm from "@/app/src/features/auth/components/login/login-form";

export default function Login() {
  return (
    <Suspense fallback={<div />}>
      <LoginForm />
    </Suspense>
  );
}
