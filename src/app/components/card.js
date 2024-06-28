"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";

const inter = Inter({ subsets: ["latin"] });

const blackTextRoles = ['marketing', 'devrel', 'student'];

export default function Card({ role, name, avatar, onCard }) {
  const cardRef = useRef(null);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [roleLoaded, setRoleLoaded] = useState(false);
  const [card, setCard] = useState(null);

  useEffect(() => {
    const capture = async () => {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 1 });
      onCard(dataUrl);
      setCard(dataUrl);
    };
    if (roleLoaded && avatarLoaded && !card) {
      capture();
    }
  }, [cardRef, roleLoaded, avatarLoaded, onCard, card]);

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
            className="absolute"
            onLoad={() => setAvatarLoaded(true)}
            style={{ top: "220px", left: "50%", transform: "translateX(-50%)" }}
            priority={1}
          />
          <Image
            src={`/cards/${role}.png`}
            alt={role}
            width={1200}
            height={1800}
            onLoad={() => setRoleLoaded(true)}
            className="relative"
            priority={1}
          />
          <div
            className={`absolute text-left text-5xl font-normal`}
            style={{
              width: "760px",
              top: "130px",
              left: "150px",
              color: blackTextRoles.includes(role) ? "black" : "white",
            }}
          >
            {name}
          </div>
        </div>
      </div>
    </>
  );
}
