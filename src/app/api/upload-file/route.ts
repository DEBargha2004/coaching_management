import { storageDB } from "@/lib/firebase";
import { ref, uploadBytes, uploadString } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const fileId = formData.get("fileId");
    const pathPrefix = formData.get("pathPrefix");

    console.log(file, fileId, pathPrefix);
    if (!file) {
      return NextResponse.json(
        { error: "File not found", success: false },
        { status: 400 }
      );
    }
    await uploadBytes(ref(storageDB, `${pathPrefix}/${fileId}`), file as Blob);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}
