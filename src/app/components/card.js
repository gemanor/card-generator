"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";

const inter = Inter({ subsets: ["latin"] });

const blackTextRoles = ['marketing', 'devrel'];

export default function Card({ role, name, avatar, onCard }) {
  const cardRef = useRef(null);
  const [loaded, setLoaded] = useState(0);
  const [card, setCard] = useState(null);

  useEffect(() => {
    const capture = async () => {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 1 });
      onCard(dataUrl);
      setCard(dataUrl);
    };
    if (loaded == 2 && !card) {
      capture();
    }
  }, [cardRef, loaded, onCard, card]);

  return (
    <>
      <div
        className={`flex flex-col items-center justify-between ${inter.className}`}
      >
        <div
          className="relative"
          style={{ height: "1800px", width: "1200px" }}
          ref={cardRef}
        >
          <Image
            src={avatar}
            width={970}
            height={1600}
            alt="background"
            onLoad={(e) => {
              setLoaded(loaded + 1);
            }}
            className="absolute"
            style={{ top: "220px", left: "50%", transform: "translateX(-50%)" }}
          />
          <Image
            src={`/cards/${role}.png`}
            alt={role}
            width={1200}
            onLoad={(e) => {
              setLoaded(loaded + 1);
            }}
            height={1800}
            className="relative"
          />
          <div
            className={`absolute text-left text-${blackTextRoles.includes(role) ? 'black' : 'white'} text-5xl font-normal`}
            style={{
              width: "760px",
              top: "130px",
              left: "150px",
            }}
          >
            {name}
          </div>
        </div>
      </div>
    </>
  );
}
