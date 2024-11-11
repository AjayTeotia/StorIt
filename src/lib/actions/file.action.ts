'use server'

import { createAdminClient } from '@/lib/appwrite'
import { appwriteConfig } from '@/lib/appwrite/config'
import { constructFileUrl, getFileType, parseStringify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { ID, Models, Query } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'
import { getCurrentUser } from './user.action'

declare type FileType = 'document' | 'image' | 'video' | 'audio' | 'other'

const handleError = (error: unknown, message: string) => {
  console.log(error, message)
  throw error
}

interface UploadFileProps {
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

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number,
) => {
  const queries = [
    Query.or([
      Query.equal('owner', [currentUser.$id]),
      Query.contains('users', [currentUser.email]),
    ]),
  ]

  if (types.length > 0) queries.push(Query.equal('type', types))
  if (searchText) queries.push(Query.contains('name', searchText))
  if (limit) queries.push(Query.limit(limit))

  if (sort) {
    const [sortBy, orderBy] = sort.split('-')

    queries.push(
      orderBy === 'asc' ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
    )
  }

  return queries
}

interface GetFilesProps {
  types: FileType[]
  searchText?: string
  sort?: string
  limit?: number
}

export const getFiles = async ({
  types = [],
  searchText = '',
  sort = '$createdAt-desc',
  limit,
}: GetFilesProps) => {
  const { databases } = await createAdminClient()

  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) throw new Error('User not found')

    const queries = createQueries(currentUser, types, searchText, sort, limit)

    console.log({ currentUser, queries })

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries,
    )

    console.log({ files })

    return parseStringify(files)
  } catch (error) {
    handleError(error, 'Failed to get files')
  }
}

interface RenameFileProps {
  fileId: string
  name: string
  extension: string
  path: string
}

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient()

  try {
    const newName = `${name}.${extension}`

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      },
    )

    revalidatePath(path)
    return parseStringify(updatedFile)
  } catch (error) {
    handleError(error, 'Failed to rename file')
  }
}

interface UpdateFileUserProps {
  fileId: string
  emails: string[]
  path: string
}

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUserProps) => {
  const { databases } = await createAdminClient()

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: emails,
      },
    )

    revalidatePath(path)
    return parseStringify(updatedFile)
  } catch (error) {
    handleError(error, 'Failed to update file users')
  }
}

interface DeleteFileProps {
  fileId: string
  bucketFileId: string
  path: string
}

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient()

  try {
    const deleteFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
    )

    if (deleteFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId)
    }

    revalidatePath(path)
    return parseStringify({ status: 'success' })
  } catch (error) {
    handleError(error, 'Failed to delete file')
  }
}
