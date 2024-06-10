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
import styled from "styled-components";
import WizardBar from "./WizardBar";
import Webcam from "react-webcam";
import { call } from "file-loader";
import Card from "../components/card";
import Image from "next/image";
import CameraBar from "./ProgressBar";

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

const Main = styled.div`
  background: ${({ theme }) => theme.desktopBackground};
`;

const Wrapper = styled.div`
  width: 1280px;
  height: 1024px;
  padding-top: 54px;
`;

export default function Wizard() {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState(null);
  const [role, setRole] = useState("fullstack");
  const [avatar, setAvatar] = useState("");
  const [step, setStep] = useState(0);
  const [card, setCard] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [devices, setDevices] = useState([]);
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
    return name.length > 0;
  }, [name]);

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
    const nextStep = step + 1;
    if (steps[step].callback) {
      await steps[step].callback();
    }
    if (steps[step].validator && !steps[step].validator()) {
      return;
    }
    setStep(nextStep);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  return (
    <Main className="flex min-h-screen flex-col items-center justify-between">
      <WizardBar />
      <Wrapper className="flex items-center justify-center">
        <Window style={{ width: "640px" }}>
          <WindowHeader>Card Creator Wizard!</WindowHeader>
          <WindowContent>
            {step === 0 && (
              <>
                <p className="py-2">
                  This wizard will help you to create your own card for the
                  Ultimate Check game.
                </p>
                <p className="py-2">To begin, please enter your name below.</p>
                <div className="py-2">
                  <TextInput
                    placeholder="Enter your name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                        className="absolute z-30 opacity-85 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
                    <p className="py-2">
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
                    <div className="flex justify-center items-center h-full">
                      {!card && <Hourglass />}
                      {card && (
                        <Image src={card} alt="card" height={600} width={400} />
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
                {!avatar && <Hourglass />}
              </>
            )}
            {/* <Separator className="mx-3" /> */}
            <div className="py-2 flex flex-row items-end justify-end gap-2">
              {step > 0 && (
                <Button onClick={handlePreviousStep}>Previous</Button>
              )}
              {step < 4 ? (
                <Button onClick={handleNextStep}>Next</Button>
              ) : (
                <Button disabled={!title || !picture}>Finish</Button>
              )}
            </div>
          </WindowContent>
        </Window>
      </Wrapper>
    </Main>
  );
}
