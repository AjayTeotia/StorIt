import { Card } from '@/components/Card'
import { Sort } from '@/components/Sort'
import { getFiles } from '@/lib/actions/file.action'
import { getFileTypesParams } from '@/lib/utils'
import { Models } from 'node-appwrite'

interface SegmentParams {
  [key: string]: string | number | boolean
}

interface SearchParamProps {
  params?: Promise<SegmentParams>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

declare type FileType = 'document' | 'image' | 'video' | 'audio' | 'other'

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || ''
  const searchText = ((await searchParams)?.query as string) || ''
  const sort = ((await searchParams)?.sort as string) || ''

  const types = getFileTypesParams(type) as FileType[]

  const files = await getFiles({ types, searchText, sort })

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">0 MB</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden text-light-100 sm:block">
              <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>

              <Sort />
            </p>
          </div>
        </div>
      </section>

      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  )
}

export default Page
