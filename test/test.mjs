// testCloudinary.js
import cloudinary from "../configs/cloudinary.mjs";

const test = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log(result); // should return { status: "ok" }
  } catch (err) {
    console.error(err);
  }
};

test();
