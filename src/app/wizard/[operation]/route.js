export const maxDuration = 40; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

import fetch from "node-fetch";
import path from "path";
import getConfig from "next/config";
import fs from "fs";
import FormData from "form-data";
import { Readable } from "stream";
import { NextResponse } from "next/server";

const serverPath = (staticFilePath) => {
  return path.join(
    getConfig().serverRuntimeConfig.PROJECT_ROOT,
    staticFilePath
  );
};

const imageToStream = (base64Image) => {
  const buffer = Buffer.from(base64Image.split(",")[1], "base64");
  return new Readable({
    read() {
      this.push(buffer);
      this.push(null); // Signal the end of the stream
    },
  });
};

const swap = async (role, face) => {
  const avatar = fs.createReadStream(`${process.cwd()}/public/avatars/${role}/${Math.floor(Math.random() * 4) + 1}.png`);
  const form = new FormData();
  form.append("target_image", avatar);
  form.append("swap_image", Buffer.from(face.split(",")[1], "base64"), {
    filename: "face.jpg",
    contentType: "image/jpeg",
  });
  const startJob = await fetch(
    "https://developer.remaker.ai/api/remaker/v1/face-swap/create-job",
    {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        Authorization: process.env.REMAKER_API_KEY,
        ...form.getHeaders(),
      },
      body: form,
    }
  );
  const json = await startJob.json();

  const {
    result: { job_id },
  } = json;

  if (!job_id) {
    throw new Error("Failed to start job");
  }

  const counter = 0;

  const checkJob = async () => {
    const job = await fetch(
      `https://developer.remaker.ai/api/remaker/v1/face-swap/${job_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.REMAKER_API_KEY,
        },
      }
    );
    const response = await job.json();
    const { code } = response;
    if (code !== 300102 || counter > 10) {
      return response;
    }
    return checkJob();
  };
  const job = await checkJob();
  
  return job;
};

export async function POST(request, context) {
  const { operation } = context.params;
  if (operation === "swap") {
    const { face, role } = await request.json();
    const result = await swap(role, face);
    return NextResponse.json(result);
  }
}
