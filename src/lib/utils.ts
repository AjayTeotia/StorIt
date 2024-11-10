import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

type FileType = 'document' | 'image' | 'video' | 'audio' | 'other'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const parseStringify = (value: unknown) =>
  JSON.parse(JSON.stringify(value))

export const convertFileToUrl = (file: File) => URL.createObjectURL(file)

export const convertFileSize = (sizeInBytes: number, digits?: number) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + ' Bytes' // Less than 1 KB, show in Bytes
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024
    return sizeInKB.toFixed(digits || 1) + ' KB' // Less than 1 MB, show in KB
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024)
    return sizeInMB.toFixed(digits || 1) + ' MB' // Less than 1 GB, show in MB
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024)
    return sizeInGB.toFixed(digits || 1) + ' GB' // 1 GB or more, show in GB
  }
}

export const calculatePercentage = (sizeInBytes: number) => {
  const totalSizeInBytes = 2 * 1024 * 1024 * 1024 // 2GB in bytes
  const percentage = (sizeInBytes / totalSizeInBytes) * 100
  return Number(percentage.toFixed(2))
}

export const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (!extension) return { type: 'other', extension: '' }

  // Document file extensions (including design and eBook formats)
  const documentExtensions = [
    'pdf', // Portable Document Format
    'doc', // Microsoft Word 97-2003 Document
    'docx', // Microsoft Word Document (Open XML)
    'txt', // Plain Text File
    'xls', // Microsoft Excel 97-2003 Spreadsheet
    'xlsx', // Microsoft Excel Spreadsheet (Open XML)
    'csv', // Comma-Separated Values File
    'rtf', // Rich Text Format
    'ods', // OpenDocument Spreadsheet
    'ppt', // Microsoft PowerPoint 97-2003 Presentation
    'pptx', // Microsoft PowerPoint Presentation (Open XML)
    'odp', // OpenDocument Presentation
    'md', // Markdown File
    'html', // HyperText Markup Language
    'htm', // HyperText Markup Language
    'epub', // eBook Format
    'pages', // Apple Pages Document
    'fig', // Figma Design File
    'psd', // Adobe Photoshop Document
    'ai', // Adobe Illustrator Document
    'indd', // Adobe InDesign Document
    'xd', // Adobe XD Document
    'sketch', // Sketch Design File
    'afdesign', // Affinity Designer File
    'afphoto', // Affinity Photo File
    'xlsx', // Excel Spreadsheet (Open XML)
  ]

  // Image file extensions
  const imageExtensions = [
    'jpg', // JPEG Image
    'jpeg', // JPEG Image
    'png', // PNG Image
    'gif', // GIF Image
    'bmp', // Bitmap Image
    'svg', // Scalable Vector Graphics
    'webp', // WebP Image
    'tiff', // TIFF Image
    'ico', // Icon file
    'apng', // Animated PNG
    'heif', // High Efficiency Image Format
    'heic', // High Efficiency Image Coding (HEIC)
    'raw', // Raw Image Format (e.g., RAW for cameras)
    'jfif', // JPEG File Interchange Format (similar to JPG)
    'dds', // DirectDraw Surface (used in textures)
  ]

  // Video file extensions
  const videoExtensions = [
    'mp4', // MP4 Video
    'avi', // AVI Video
    'mov', // MOV Video
    'mkv', // MKV Video
    'webm', // WebM Video
    'flv', // Flash Video
    'wmv', // Windows Media Video
    '3gp', // 3GPP Video
    'mpeg', // MPEG Video
    'ogv', // Ogg Video
    'vob', // Video Object (DVD Video)
  ]

  // Audio file extensions
  const audioExtensions = [
    'mp3', // MP3 Audio
    'wav', // WAV Audio
    'ogg', // Ogg Audio
    'flac', // FLAC Audio
    'aac', // AAC Audio
    'wma', // Windows Media Audio
    'm4a', // M4A Audio
    'aiff', // AIFF Audio
    'alac', // Apple Lossless Audio
    'opus', // Opus Audio
  ]

  // Check if file extension belongs to document category
  if (documentExtensions.includes(extension)) {
    return { type: 'document', extension }
  }

  // Check if file extension belongs to image category
  if (imageExtensions.includes(extension)) {
    return { type: 'image', extension }
  }

  // Check if file extension belongs to video category
  if (videoExtensions.includes(extension)) {
    return { type: 'video', extension }
  }

  // Check if file extension belongs to audio category
  if (audioExtensions.includes(extension)) {
    return { type: 'audio', extension }
  }

  // Default return for any other file types
  return { type: 'other', extension }
}

export const formatDateTime = (isoString: string | null | undefined) => {
  if (!isoString) return '—'

  const date = new Date(isoString)

  // Get hours and adjust for 12-hour format
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? 'pm' : 'am'

  // Convert hours to 12-hour format
  hours = hours % 12 || 12

  // Format the time and date parts
  const time = `${hours}:${minutes.toString().padStart(2, '0')}${period}`
  const day = date.getDate()
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const month = monthNames[date.getMonth()]

  return `${time}, ${day} ${month}`
}

export const getFileIcon = (
  extension: string | undefined,
  type: FileType | string,
) => {
  switch (extension) {
    // Document
    case 'pdf':
      return '/assets/icons/file-pdf.svg'
    case 'doc':
      return '/assets/icons/file-doc.svg'
    case 'docx':
      return '/assets/icons/file-docx.svg'
    case 'csv':
      return '/assets/icons/file-csv.svg'
    case 'txt':
      return '/assets/icons/file-txt.svg'
    case 'xls':
    case 'xlsx':
      return '/assets/icons/file-document.svg'
    // Image
    case 'svg':
      return '/assets/icons/file-image.svg'
    // Video
    case 'mkv':
    case 'mov':
    case 'avi':
    case 'wmv':
    case 'mp4':
    case 'flv':
    case 'webm':
    case 'm4v':
    case '3gp':
      return '/assets/icons/file-video.svg'
    // Audio
    case 'mp3':
    case 'mpeg':
    case 'wav':
    case 'aac':
    case 'flac':
    case 'ogg':
    case 'wma':
    case 'm4a':
    case 'aiff':
    case 'alac':
      return '/assets/icons/file-audio.svg'

    default:
      switch (type) {
        case 'image':
          return '/assets/icons/file-image.svg'
        case 'document':
          return '/assets/icons/file-document.svg'
        case 'video':
          return '/assets/icons/file-video.svg'
        case 'audio':
          return '/assets/icons/file-audio.svg'
        default:
          return '/assets/icons/file-other.svg'
      }
  }
}

// APPWRITE URL UTILS
// Construct appwrite file URL - https://appwrite.io/docs/apis/rest#images
export const constructFileUrl = (bucketFileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
}

export const constructDownloadUrl = (bucketFileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
}

// DASHBOARD UTILS
export const getUsageSummary = (totalSpace: any) => {
  return [
    {
      title: 'Documents',
      size: totalSpace.document.size,
      latestDate: totalSpace.document.latestDate,
      icon: '/assets/icons/file-document-light.svg',
      url: '/documents',
    },
    {
      title: 'Images',
      size: totalSpace.image.size,
      latestDate: totalSpace.image.latestDate,
      icon: '/assets/icons/file-image-light.svg',
      url: '/images',
    },
    {
      title: 'Media',
      size: totalSpace.video.size + totalSpace.audio.size,
      latestDate:
        totalSpace.video.latestDate > totalSpace.audio.latestDate
          ? totalSpace.video.latestDate
          : totalSpace.audio.latestDate,
      icon: '/assets/icons/file-video-light.svg',
      url: '/media',
    },
    {
      title: 'Others',
      size: totalSpace.other.size,
      latestDate: totalSpace.other.latestDate,
      icon: '/assets/icons/file-other-light.svg',
      url: '/others',
    },
  ]
}

export const getFileTypesParams = (type: string) => {
  switch (type) {
    case 'documents':
      return ['document']
    case 'images':
      return ['image']
    case 'media':
      return ['video', 'audio']
    case 'others':
      return ['other']
    default:
      return ['document']
  }
}
