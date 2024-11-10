import { cn, formatDateTime } from '@/lib/utils'

interface FormattedDateTimeProps {
  date: string
  className?: string
}

export const FormattedDateTime = ({
  date,
  className,
}: FormattedDateTimeProps) => {
  return (
    <p className={cn('body-1 text-light-200', className)}>
      {formatDateTime(date)}
    </p>
  )
}
