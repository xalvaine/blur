import { Button, Spinner, Text, useToast } from '@chakra-ui/react'
import { FileUploadOutlined } from '@mui/icons-material'
import React, { useCallback, useEffect, useRef } from 'react'
import { AxiosProgressEvent } from 'axios'
import { useTranslation } from 'react-i18next'

import { UPLOAD_NAMESPACE } from './upload.18n'
import styles from './upload.module.scss'

interface UploadProps {
  onUpload: (imageSource: File) => void
  isModelLoading: boolean
  isImageProcessing: boolean
  separateImageError: boolean
  loadingProgress: AxiosProgressEvent | undefined
}

export const Upload = ({
  onUpload,
  isModelLoading,
  isImageProcessing,
  separateImageError,
  loadingProgress,
}: UploadProps) => {
  const { t } = useTranslation(UPLOAD_NAMESPACE)
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const handleButtonClick = useCallback(() => {
    if (!inputRef.current) {
      return
    }
    inputRef.current.click()
  }, [])

  const handleUpload = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    async (event) => {
      const file = event.target.files?.[0]
      if (!file) {
        return
      }

      onUpload(file)
    },
    [onUpload],
  )

  useEffect(() => {
    if (separateImageError) {
      toast({
        title: `Ошибка!`,
        description: `Не удалось выделить фон`,
        status: `error`,
      })
    }
  }, [separateImageError, toast])

  return (
    <div className={styles.wrapper}>
      {isModelLoading || isImageProcessing ? (
        <div className={styles.spinnerContainer}>
          <Spinner size='sm' />
          <Text>
            {isModelLoading
              ? t('modelLoading', {
                  percentage: loadingProgress?.progress
                    ? Math.trunc(loadingProgress.progress * 100)
                    : 0,
                })
              : t('backgroundAndForegroundSeparation')}
          </Text>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type='file'
            className={styles.input}
            onChange={handleUpload}
            accept='image/png,image/jpeg'
          />
          <Button
            height='100%'
            variant='ghost'
            onClick={handleButtonClick}
            leftIcon={<FileUploadOutlined />}
          >
            {t(`selectImage`)}
          </Button>
        </>
      )}
    </div>
  )
}
