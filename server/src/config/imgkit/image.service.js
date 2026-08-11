import ImageKit from "@imagekit/nodejs"
import config from '../config.js';

const imageKit = new ImageKit({
  privateKey: "private_Wm86PuUn+9XsNAPAKeF2KX8vCJY=",
});

export const uploadToImageKit = async (fileBuffer, fileName) => {
    try {
        console.log(`⚡ Initiating ImageKit cloud transfer for: ${fileName}`);

        // Base64 conversion
        const base64File = fileBuffer.toString("base64");

        const response = await imageKit.files.upload({
            file: base64File,
            fileName: fileName, // ✅ Fixed syntax typo
            folder: "/discord_products"
        });

        // 🔴 CRITICAL FIX: Response me se URL return karna bohot zaroori hai!
        console.log("✅ Cloud transfer successful! URL:", response.url);
        return response.url; 

    } catch (error) {
        console.log("Image kit Upload error:", error.message);
        throw new Error(error.message || "Failed to upload image to cloud storage");
    }
};

