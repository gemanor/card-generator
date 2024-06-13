"use client";

import { useSearchParams } from "next/navigation";
import Card from "../components/card";
import { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { Button, Window } from "react95";
import { shareOnMobile } from "react-mobile-share";

const Main = styled.div`
  background: ${({ theme }) => theme.desktopBackground};
`;

export default function Page() {
  const searchParams = useSearchParams();
  const [card, setCard] = useState(null);

  const role = searchParams.get("role");
  const name = searchParams.get("name");
  const avatar = searchParams.get("avatar");

  return (
    <Main className="flex flex-col items-center justify-center p-2 min-h-screen">
      {!role || !name || !avatar ? (
        <>
          <h1>Missing query parameters</h1>
          <p>
            Make sure to include the role, name, and avatar query parameters
          </p>
        </>
      ) : (
        <>
          <div className="flex justify-center py-2 gap-2">
            <Button
              onClick={() => {
                const a = document.createElement("a");
                a.href = card;
                a.download = "card.png";
                a.click();
              }}
              disabled={!card}
            >
              Download
            </Button>
            {window.navigator.share && (
              <Button
                onClick={async () => {
                  shareOnMobile({
                    title: "Share your card",
                    text: "#RenderATL @permit_io",
                    images: [card],
                  });
                }}
              >
                Twitter
              </Button>
            )}
            {window.navigator.share && (
              <Button
                onClick={async () => {
                  shareOnMobile({
                    title: "Share your card",
                    text: "Check out my #UltimateCheck card from Permit.io #RenderATL",
                    images: [card],
                  });
                }}
              >
                LinkedIn
              </Button>
            )}
          </div>
          <Window>
            {card && <Image src={card} height={600} width={400} alt="card" />}
            <div
              className="absolute"
              style={{ top: "-10000px", left: "-10000px" }}
            >
              <Card
                role={role}
                name={name}
                avatar={avatar}
                onCard={(dataUrl) => {
                  setCard(dataUrl);
                }}
              />
            </div>
          </Window>
        </>
      )}
    </Main>
  );
}
