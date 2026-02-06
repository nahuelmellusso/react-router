import { redirect } from "react-router";

export async function loader() {
  throw redirect("/en/auth/login");
}
export default function RootIndex() {
  return null;
}
