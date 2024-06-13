"use client";

import { useSearchParams } from "next/navigation";
import Card from "../components/card";

export default function Page() {
  const searchParams = useSearchParams();

  const role = searchParams.get("role");
  const name = searchParams.get("name");
  const avatar = searchParams.get("avatar");

  return (
    <>
      {!role || !name || !avatar ? (
        <>
          <h1>Missing query parameters</h1>
          <p>
            Make sure to include the role, name, and avatar query parameters
          </p>
        </>
      ) : (
        <>
          <Card
            role={role}
            name={name}
            avatar={avatar}
            onCard={(dataUrl) => {
              console.log(dataUrl);
            }}
          />
        </>
      )}
    </>
  );
}
