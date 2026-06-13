import fs from "fs";
import path from "path";

export const cleanupTemp = () => {

  const tempDir =
    path.join(
      process.cwd(),
      "uploads",
      "temp"
    );

  if (
    !fs.existsSync(tempDir)
  ) return;

  const files =
    fs.readdirSync(tempDir);

  const now =
    Date.now();

  files.forEach(file => {

    const filePath =
      path.join(
        tempDir,
        file
      );

    const stats =
      fs.statSync(
        filePath
      );

    const age =
      now -
      stats.mtimeMs;

    // 24 hours
    if (
      age >
      24 *
        60 *
        60 *
        1000
    ) {

      fs.unlinkSync(
        filePath
      );

      console.log(
        "Deleted:",
        file
      );

    }

  });

};