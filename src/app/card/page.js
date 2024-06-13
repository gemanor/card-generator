"use client";

import { useSearchParams } from "next/navigation";
import Card from "../components/card";
import { Suspense, useState } from "react";
import { TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import Image from "next/image";

export default function Page() {
  const searchParams = useSearchParams();
  const [card, setCard] = useState(null);

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
          {/* {card && ( */}
          <div className="flex justify-center">
            <TwitterShareButton url="http://www.google.com">
                <TwitterIcon />
            </TwitterShareButton>
            <WhatsappShareButton url={card}>
                <WhatsappIcon />
            </WhatsappShareButton>
          </div>
          {/* )} */}
          <Card
            role={role}
            name={name}
            avatar={avatar}
            onCard={(dataUrl) => {
              setCard(dataUrl);
            }}
          />
        </>
      )}
    </>
  );
}
