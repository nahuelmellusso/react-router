// app/routes/_index.tsx
import { redirect } from "react-router";

export async function loader() {
    // Podés detectar el idioma del navegador aquí si querés.
    throw redirect("/en/auth/login");
}
export default function RootIndex() { return null; }
