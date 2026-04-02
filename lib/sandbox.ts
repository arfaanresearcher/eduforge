import { db } from "./db";
import { SandboxStatus } from "@prisma/client";

const IMAGES: Record<string, string> = {
  node: "node:20-alpine",
  python: "python:3.11-slim",
  go: "golang:1.21-alpine",
};

function getImage(techStack: string[]): string {
  const lower = techStack.map((t) => t.toLowerCase());
  if (lower.some((t) => t.includes("python"))) return IMAGES.python;
  if (lower.some((t) => t.includes("go"))) return IMAGES.go;
  return IMAGES.node;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getDocker(): Promise<any | null> {
  if (process.env.VERCEL || process.env.NEXT_RUNTIME === "edge") return null;
  try {
    const Docker = (await import("dockerode")).default;
    const docker = new Docker();
    await docker.ping();
    return docker;
  } catch {
    return null;
  }
}

export async function createSandbox(
  userId: string,
  prototypeId: string,
  techStack: string[],
): Promise<{ sandboxId: string; containerId: string }> {
  const image = getImage(techStack);
  const docker = await getDocker();

  if (!docker) {
    const sandbox = await db.sandbox.create({
      data: {
        prototypeId,
        containerId: `mock-${Date.now()}`,
        status: SandboxStatus.RUNNING,
        image,
        port: 3100,
      },
    });
    return { sandboxId: sandbox.id, containerId: sandbox.containerId! };
  }

  const container = await docker.createContainer({
    Image: image,
    Cmd: ["sleep", "infinity"],
    HostConfig: {
      Memory: 512 * 1024 * 1024,
      NanoCpus: 500000000,
      NetworkMode: "none",
    },
    Labels: {
      "eduforge.userId": userId,
      "eduforge.prototypeId": prototypeId,
    },
  });

  await container.start();

  const sandbox = await db.sandbox.create({
    data: {
      prototypeId,
      containerId: container.id,
      status: SandboxStatus.RUNNING,
      image,
    },
  });

  return { sandboxId: sandbox.id, containerId: container.id };
}

export async function executeCode(
  sandboxId: string,
  code: string,
  language: string,
  timeoutMs = 30000,
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const sandbox = await db.sandbox.findUniqueOrThrow({
    where: { id: sandboxId },
  });

  const docker = await getDocker();

  if (!docker || sandbox.containerId?.startsWith("mock-")) {
    return {
      stdout: `[Mock] Executed ${language} code (${code.length} chars)\nOutput: Hello from EduForge sandbox`,
      stderr: "",
      exitCode: 0,
    };
  }

  const container = docker.getContainer(sandbox.containerId!);

  let cmd: string[];
  switch (language.toLowerCase()) {
    case "python":
      cmd = ["python", "-c", code];
      break;
    case "go":
      cmd = ["sh", "-c", `echo '${code.replace(/'/g, "'\\''")}' > /tmp/main.go && go run /tmp/main.go`];
      break;
    default:
      cmd = ["node", "-e", code];
  }

  const exec = await container.exec({
    Cmd: cmd,
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ stdout: "", stderr: "Execution timed out", exitCode: 124 });
    }, timeoutMs);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exec.start({ Tty: false }, (err: any, stream: any) => {
      if (err || !stream) {
        clearTimeout(timeout);
        resolve({ stdout: "", stderr: err?.message ?? "Failed to start exec", exitCode: 1 });
        return;
      }

      let stdout = "";
      let stderr = "";

      stream.on("data", (chunk: Buffer) => {
        const header = chunk.readUInt8(0);
        const payload = chunk.subarray(8).toString();
        if (header === 1) stdout += payload;
        else stderr += payload;
      });

      stream.on("end", () => {
        clearTimeout(timeout);
        exec.inspect().then((info: { ExitCode?: number }) => {
          resolve({ stdout, stderr, exitCode: info.ExitCode ?? 0 });
        }).catch(() => {
          resolve({ stdout, stderr, exitCode: 0 });
        });
      });
    });
  });
}

export async function destroySandbox(sandboxId: string): Promise<void> {
  const sandbox = await db.sandbox.findUniqueOrThrow({
    where: { id: sandboxId },
  });

  const docker = await getDocker();

  if (docker && sandbox.containerId && !sandbox.containerId.startsWith("mock-")) {
    try {
      const container = docker.getContainer(sandbox.containerId);
      await container.stop().catch(() => {});
      await container.remove();
    } catch (error) {
      console.error("Failed to destroy container:", error);
    }
  }

  await db.sandbox.update({
    where: { id: sandboxId },
    data: { status: SandboxStatus.STOPPED },
  });
}

export async function getSandboxStatus(
  sandboxId: string,
): Promise<{ status: SandboxStatus; containerId: string | null }> {
  const sandbox = await db.sandbox.findUniqueOrThrow({
    where: { id: sandboxId },
  });

  const docker = await getDocker();

  if (!docker || sandbox.containerId?.startsWith("mock-")) {
    return { status: sandbox.status, containerId: sandbox.containerId };
  }

  try {
    const container = docker.getContainer(sandbox.containerId!);
    const info = await container.inspect();
    const running = info.State.Running;
    const status = running ? SandboxStatus.RUNNING : SandboxStatus.STOPPED;

    if (status !== sandbox.status) {
      await db.sandbox.update({
        where: { id: sandboxId },
        data: { status },
      });
    }

    return { status, containerId: sandbox.containerId };
  } catch {
    return { status: SandboxStatus.ERROR, containerId: sandbox.containerId };
  }
}
