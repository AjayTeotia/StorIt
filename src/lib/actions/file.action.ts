'use server'

import { createAdminClient } from '@/lib/appwrite'
import { appwriteConfig } from '@/lib/appwrite/config'
import { constructFileUrl, getFileType, parseStringify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { ID } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'

const handleError = (error: unknown, message: string) => {
  console.log(error, message)
  throw error
}

type UploadFileProps = {
  file: File
  ownerId: string
  accountId: string
  path: string
}

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient()

  try {
    const inputFile = InputFile.fromBuffer(file, file.name)

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
    )

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    }

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument,
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id)
        handleError(error, 'Failed to create file document')
      })

    revalidatePath(path)
    return parseStringify(newFile)
  } catch (error) {
    handleError(error, 'Failed to upload file')
  }
}
