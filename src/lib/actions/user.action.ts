'use server'

import { ID, Query } from 'node-appwrite'
import { createAdminClient } from '../appwrite'
import { appwriteConfig } from '../appwrite/config'
import { parseStringify } from '@/lib/utils'
import { avatarPlaceholderUrl } from '@/constants'

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient()

  const res = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('email', email)],
  )

  return res.total > 0 ? res.documents[0] : null
}

const handleError = (error: unknown, message: string) => {
  console.log(error, message)
  throw error
}

const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient()

  try {
    const session = await account.createEmailToken(ID.unique(), email)

    return session.userId
  } catch (error) {
    handleError(error, 'Failed to send email OTP')
  }
}

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string
  email: string
}) => {
  const existingUser = await getUserByEmail(email)

  const accountId = await sendEmailOTP({ email })
  if (!accountId) throw new Error('Failed to send email OTP')

  if (!existingUser) {
    const { databases } = await createAdminClient()

    try {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
          fullName,
          email,
          avatar: avatarPlaceholderUrl,
          accountId,
        },
      )
    } catch (error) {
      handleError(error, 'Failed to create user')
    }
  }

  return parseStringify({ accountId })
}

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      await sendEmailOTP({ email })
      return parseStringify({ accountId: existingUser.accountId })
    }

    return parseStringify({ accountId: null, error: 'User not found' })
  } catch (error) {
    handleError(error, 'Failed to sign in user')
  }
}
