import { Button, notification, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import React, { useCallback, useEffect, useRef } from 'react'

import styles from './upload.module.scss'

interface UploadProps {
  onUpload: (imageSource: File) => void
  isLoading: boolean
  separateImageError: boolean
}

export const Upload = ({
  onUpload,
  isLoading,
  separateImageError,
}: UploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

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
      notification.error({
        message: `Ошибка!`,
        description: `Не удалось выделить фон`,
      })
    }
  }, [separateImageError])

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Spin tip='Подготовка изображения'>
          <div />
        </Spin>
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
            block
            type='dashed'
            onClick={handleButtonClick}
            className={styles.button}
            icon={<UploadOutlined />}
          >
            Выбрать изображение
          </Button>
        </>
      )}
    </div>
  )
}
