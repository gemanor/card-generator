"use client";

import {
  AppBar,
  Button,
  Frame,
  GroupBox,
  Hourglass,
  Select,
  Separator,
  TextInput,
  Toolbar,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import React, { useCallback, useEffect, useRef, useState } from "react";
import WizardBar from "./WizardBar";
import Webcam from "react-webcam";
import Card from "../components/card";
import Image from "next/image";
import CameraBar from "./ProgressBar";
import QRCode from "react-qr-code";

const roles = [
  {
    value: "backend",
    label: "Backend Developer",
  },
  {
    value: "designer",
    label: "Designer / Illustrator / Animator / Creative",
  },
  {
    value: "devrel",
    label: "Developer Relations",
  },
  {
    value: "founder",
    label: "CEO / Founder",
  },
  {
    value: "frontend",
    label: "Frontend Developer",
  },
  {
    value: "fullstack",
    label: "Fullstack Developer",
  },
  {
    value: "hr",
    label: "HR / Legal",
  },
  {
    value: "marketing",
    label: "Marketing / Sales",
  },
  {
    value: "qa",
    label: "Support Engineer / QA",
  },
  {
    value: "product",
    label: "Product / Project Manager",
  },
  {
    value: "security",
    label: "Security Engineer",
  },
];

export default function Wizard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState(null);
  const [role, setRole] = useState("fullstack");
  const [avatar, setAvatar] = useState("");
  const [step, setStep] = useState(0);
  const [card, setCard] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [devices, setDevices] = useState([]);
  const [active, setActive] = useState(false);
  const webcamRef = useRef(null);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPicture(imageSrc);
    const swap = await fetch("/wizard/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        face: imageSrc,
      }),
    });
    const json = await swap.json();
    if (json?.result?.output_image_url?.length > 0) {
      setAvatar(json?.result?.output_image_url[0]);
    }
  }, [webcamRef, role]);

  const handleDevices = useCallback(
    (mediaDevices) =>
      setDevices(
        mediaDevices
          .filter(({ kind }) => kind === "videoinput")
          .map(({ deviceId, label }) => ({ value: deviceId, label }))
      ),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const nameValidator = useCallback(() => {
    const validName = name.length > 0 && name.length < 25;
    const validEmail =
      email.length > 0 &&
      email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
    return validName && validEmail;
  }, [name, email]);

  const roleValidator = useCallback(() => {
    return role.length > 0;
  }, [role]);

  const steps = [
    {
      validator: nameValidator,
    },
    {
      validator: roleValidator,
    },
    {
      callback: capture,
    },
    {},
  ];

  const handleNextStep = async () => {
    setActive(true);
    const nextStep = step + 1;
    if (steps[step].callback) {
      await steps[step].callback();
    }
    if (steps[step].validator && !steps[step].validator()) {
      setActive(false);
      return;
    }
    setActive(false);
    setStep(nextStep);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-[#008080]">
      <WizardBar />
      <div
        className="flex items-center justify-center flex-col gap-6"
        style={{ width: "1280px", height: "1024px", paddingTop: "54px" }}
      >
        {step === 0 && (
          <p className="p-10 text-6xl">Get a Custom Ultimate Check Card</p>
        )}
        <Window style={{ width: "640px" }}>
          <WindowHeader>Card Creator Wizard!</WindowHeader>
          <WindowContent>
            {step === 0 && (
              <>
                <p className="py-2">
                  This wizard will help you to create your own card for the
                  Ultimate Check game.
                </p>
                <p className="py-2">
                  To begin, please enter your name and email below.
                </p>
                <div className="py-2">
                  <TextInput
                    placeholder="Enter your name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="before:box-content"
                  />
                </div>
                <div className="py-2">
                  <TextInput
                    placeholder="Enter your email (so we can send you some updates)..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="before:box-content"
                  />
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <p className="py-2">Nice to meet you, {name}!</p>
                <p className="py-2">Now, we want to know you even better!</p>
                <p className="py-2">
                  Please choose the role that best describes you best from the
                  list below.
                </p>
                <GroupBox label="Roles">
                  <Select
                    className="before:box-content"
                    options={roles}
                    onChange={(value) => setRole(value.value)}
                    defaultValue={0}
                    value={role}
                    width="100%"
                  />
                </GroupBox>
              </>
            )}
            {step === 2 && (
              <>
                {picture && (
                  <>
                    <p className="py-2">
                      We are calling APIs from the future to generate your card.
                    </p>
                    <p className="py-2">
                      As you can imagine, we have no idea how long it will take.
                      The numbers are just random memory allocations.
                    </p>
                    <CameraBar />
                  </>
                )}
                {!picture && (
                  <>
                    <p className="py-2">
                      At some point in the future, {name} - {role} will look
                      spectacular on the biggest humble brag project humanity
                      has ever known - LinkedIn.
                    </p>
                    <p className="py-2">
                      For now, we can make you look spectecular on your Ultimate
                      Check card.
                    </p>
                    <p className="py-2">Let&apos;s take a picture of you!</p>
                    <div className="py-2 relative" style={{ height: "480px" }}>
                      <div className="absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center">
                        <Hourglass />
                      </div>
                      <Image
                        src="/face_recognition.svg"
                        alt="Face recognition"
                        width={480}
                        height={480}
                        className="absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      />
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="relative z-20"
                        mirrored={true}
                        videoConstraints={{
                          width: { min: 640 },
                          height: { min: 480 },
                          deviceId: deviceId,
                        }}
                      />
                    </div>
                    <p className="py-2 hidden">
                      <GroupBox label="Camera">
                        <Select
                          options={devices}
                          onChange={(value) => setDeviceId(value.value)}
                          value={deviceId}
                          width="100%"
                        />
                      </GroupBox>
                    </p>
                  </>
                )}
              </>
            )}
            {step === 3 && (
              <>
                {avatar && (
                  <div className="overflow-hidden" style={{ height: "600px" }}>
                    <div
                      className={`flex justify-center items-${
                        !card ? "center" : "start"
                      } h-full gap-4`}
                    >
                      {!card && <Hourglass />}
                      {card && (
                        <>
                          <Image
                            src={card}
                            alt="card"
                            height={600}
                            width={400}
                          />
                          <div className="flex flex-col items-start justify-center">
                            <p className="p-2">
                              Looking for a future-proof digital copy of this
                              card? Scan this code!
                            </p>
                            <Frame variant="inside" className="p-4">
                              <QRCode
                                size={140}
                                bgColor="#c6c6c6"
                                value={`https://ultimate-check.vercel.app/card?name=${name}&role=${role}&avatar=${avatar}`}
                              />
                            </Frame>
                            <Separator className="!my-4" />
                            <p className="py-2">Prefer the old school way?</p>
                            <Button
                              onClick={() => {
                                const a = document.createElement("a");
                                a.href = card;
                                a.download = `${email}.png`;
                                a.click();
                              }}
                              fullWidth
                              size="lg"
                            >
                              🖨️ Print this Card!
                            </Button>
                            <Separator className="!my-4" />
                            <p className="py-2">Unhappy with the result?</p>
                            <Button
                              onClick={() => {
                                window.location.reload();
                              }}
                              size="lg"
                              fullWidth
                            >
                              Retry!
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                    <Card
                      role={role}
                      name={name}
                      avatar={avatar}
                      onCard={(v) => {
                        setCard(v);
                      }}
                    />
                  </div>
                )}
                {!avatar && (
                  <>
                    <p className="py-2 text-center">
                      Something bad happen somewhere and the AI of the future
                      failed to create your card.
                    </p>
                    <div className="py-2 flex flex-row items-center justify-center gap-2">
                      <Button
                        onClick={() => {
                          window.location.reload();
                        }}
                      >
                        Try again!
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
            {/* <Separator className="mx-3" /> */}
            <div className="py-2 flex flex-row items-end justify-end gap-2">
              {step > 0 && step < 3 && (
                <Button disabled={active} onClick={handlePreviousStep}>
                  Previous
                </Button>
              )}
              {step < 3 && (
                <Button disabled={active} onClick={handleNextStep}>
                  Next
                </Button>
              )}
            </div>
          </WindowContent>
        </Window>
      </div>
    </div>
  );
}
