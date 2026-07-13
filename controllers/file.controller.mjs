import fs from "fs";
import path from "path";
import { execFile } from "child_process";

// const gsPath =
//   "C:\\Program Files (x86)\\gs\\gs10.07.1\\bin\\gswin32c.exe";

const gsPath =
process.platform === "win32"
  ? "C:\\Program Files (x86)\\gs\\gs10.07.1\\bin\\gswin32c.exe"
  : "gs";
  
console.log("GS PATH =", gsPath);

const compressPdfFile = (
  inputFile,
  outputFile,
  mode = "medium"
) => {

  return new Promise(
    (resolve, reject) => {

      const args = [

        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        "-dNOPAUSE",
        "-dBATCH",
        `-sOutputFile=${outputFile}`

      ];

      if (
        mode === "medium"
      ) {

        args.push(
          "-dPDFSETTINGS=/ebook"
        );

      }

      else if (
        mode === "mediumStrong"
      ) {

        args.push(

          "-dPDFSETTINGS=/screen",

          "-dColorImageResolution=72",
          "-dGrayImageResolution=72",
          "-dMonoImageResolution=72",

          "-dDownsampleColorImages=true",
          "-dDownsampleGrayImages=true",
          "-dDownsampleMonoImages=true"

        );

      }

      args.push(inputFile);

      execFile(
        gsPath,
        args,
        (error) => {

          if (error) {
            return reject(error);
          }

          resolve();

        }
      );

    }
  );

};


export const compressPdf = async (
  req,
  res
) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "No PDF uploaded"
      });

    }

    const TARGET_MIN =
      100 * 1024; // 100 KB

    const TARGET_MAX =
      250 * 1024; // 250 KB

    const originalFile =
      path.resolve(
        req.file.path
      );

    const originalSize =
      fs.statSync(
        originalFile
      ).size;

    const originalKB =
      (
        originalSize / 1024
      ).toFixed(2);

    console.log(
      "ORIGINAL SIZE =",
      originalKB,
      "KB"
    );

    // Already small enough
    if (
      originalSize <=
      TARGET_MAX
    ) {

      return res.json({

        success: true,

        originalSize:
          originalKB,

        compressedSize:
          originalKB,

        file: {

          path:
            req.file.path.replace(
              /\\/g,
              "/"
            ),

          name:
            req.file.originalname

        }

      });

    }

    // PASS 1
    let compressedFile =
      path.resolve(
        req.file.path.replace(
          ".pdf",
          "_compressed.pdf"
        )
      );

    await compressPdfFile(
      originalFile,
      compressedFile,
      "medium"
    );

    let compressedSize =
      fs.statSync(
        compressedFile
      ).size;

    console.log(
      "PASS 1 SIZE =",
      (
        compressedSize /
        1024
      ).toFixed(2),
      "KB"
    );

    // If compression made file larger
    if (
      compressedSize >=
      originalSize
    ) {

      console.log(
        "Compression increased size. Using original."
      );

      compressedFile =
        originalFile;

      compressedSize =
        originalSize;

    }

    // PASS 2
    else if (
      compressedSize >
      TARGET_MAX
    ) {

      console.log(
        "Still above target. Recompressing..."
      );

      const secondFile =
        compressedFile.replace(
          ".pdf",
          "_final.pdf"
        );

      await compressPdfFile(
        compressedFile,
        secondFile,
        "mediumStrong"
      );

      const secondSize =
        fs.statSync(
          secondFile
        ).size;

      console.log(
        "PASS 2 SIZE =",
        (
          secondSize /
          1024
        ).toFixed(2),
        "KB"
      );

      // Use pass 2 only if not too small
      if (

        secondSize <
          compressedSize &&

        secondSize >
          TARGET_MIN

      ) {

        compressedFile =
          secondFile;

        compressedSize =
          secondSize;

      }

      else {

        console.log(
          "PASS 2 rejected."
        );

      }

    }

    console.log(
      "FINAL SIZE =",
      (
        compressedSize /
        1024
      ).toFixed(2),
      "KB"
    );

    try {

  if (
    fs.existsSync(originalFile) &&
    compressedFile !== originalFile
  ) {

    fs.unlinkSync(originalFile);

  }

} catch (err) {

  console.log(
    "Delete original failed:",
    err.message
  );

}

    return res.json({

      success: true,

      originalSize:
        (
          originalSize /
          1024
        ).toFixed(2),

      compressedSize:
        (
          compressedSize /
          1024
        ).toFixed(2),

      file: {

        path:
          `uploads/temp/${path.basename(compressedFile)}`,

        name:
          req.file.originalname

      }

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,

      message:
        err.message

    });

  }

};