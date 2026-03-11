import { redirect } from "next/navigation";
import { ROUTES } from "@/config/constants";

export default function Home() {
  // If the user visits the root URL, we redirect them to the dashboard overview.
  // The AuthGuard will intercept this and redirect to /login if they aren't authenticated.
  redirect(ROUTES.DASHBOARD.OVERVIEW);
}
