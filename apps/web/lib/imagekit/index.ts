import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";

/**
 * Retrieves ImageKit upload authentication parameters from the backend.
 */
const getUploadAuth = async () => {
  try {
    const response = await fetch("/api/upload-auth");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }
    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Authentication request failed");
  }
};

interface UploadProjectThumbnailParams {
  file: File;
  userName: string;
  abortSignal: AbortSignal;
  dir: string;
  mode?: {
    type: "edit" | "create";
    toReplace: string;
  };
  // type: "edit" | "create";
  /**
   * Called with the upload progress percentage (0-100).
   */
  onProgress?: (percent: number) => void;
}

export const imageKitFolders = {
  projects: {
    thumbnail: "projects/thumbnails",
  },
  awards: {
    thumbnail: "awards/thumbnails",
  },
};

/**
 * Uploads a project thumbnail to ImageKit.
 * Returns the URL of the uploaded image on success, otherwise null.
 */
export const uploadImageToImageKit = async ({
  file,
  userName,
  abortSignal,
  dir,
  mode,
  onProgress,
}: UploadProjectThumbnailParams): Promise<string | undefined | null> => {
  try {
    const { signature, expire, token, publicKey } = await getUploadAuth();
    const folderName = `/users/${userName.replace(" ", "_")}/${dir}/`;

    const uploadResponse = await upload({
      expire,
      token,
      signature,
      publicKey,
      folder: folderName,
      file,
      // If the file is a File object we can use its name, otherwise fallback to undefined.
      fileName: file.name,
      onProgress: (event) => {
        if (onProgress) {
          const percent = (event.loaded / event.total) * 100;
          onProgress(percent);
        }
      },
      abortSignal,
    });

    // Delete the recent mode.toReplace
    // if (mode?.type === "edit" && mode.toReplace) {
    //   const deleteResponse = await deleteFile(mode.toReplace);
    // }

    return uploadResponse.url;
  } catch (error) {
    // Show generic error handling; callers can show toast notifications.
    console.error("Upload error:", error);
    if (error instanceof ImageKitAbortError) {
      console.error("Upload aborted:", error.reason);
    } else if (error instanceof ImageKitInvalidRequestError) {
      console.error("Invalid request:", error.message);
    } else if (error instanceof ImageKitUploadNetworkError) {
      console.error("Network error:", error.message);
    } else if (error instanceof ImageKitServerError) {
      console.error("Server error:", error.message);
    }
    return null;
  }
};
