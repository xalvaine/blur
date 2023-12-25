import { Select, SelectProps, Typography } from 'antd'
import { Dispatch, SetStateAction, useMemo } from 'react'

import { ModelType } from 'features/background-removal/lib'
import { isIOS } from 'shared/lib'

import styles from './model-picker.module.scss'

interface SegmentProps {
  label: string
  additionalLabel?: string
  size: string
}
const Segment = ({ label, size, additionalLabel }: SegmentProps) => {
  return (
    <div className={styles.modelOption}>
      <Typography.Text className={styles.modelName}>
        {label}
        {additionalLabel && (
          <span className={styles.additionalLabel}> - {additionalLabel}</span>
        )}
      </Typography.Text>
      <Typography.Text className={styles.modelSize} type='secondary'>
        {size}
      </Typography.Text>
    </div>
  )
}

interface ModelPickerProps {
  disabled?: boolean
  modelType: ModelType
  setModelType: Dispatch<SetStateAction<ModelType>>
}

export const ModelPicker = ({
  modelType,
  setModelType,
  disabled,
}: ModelPickerProps) => {
  const options = useMemo(() => {
    const options: SelectProps['options'] = [
      {
        label: <Segment label='Низкое' size='5 МБ' additionalLabel='быстрее' />,
        value: ModelType.U2netP,
        className: styles.segment,
      },
      {
        label: <Segment label='Среднее' size='42 МБ' />,
        value: ModelType.Quant,
        className: styles.segment,
      },
    ]

    if (!isIOS()) {
      options.push({
        label: (
          <Segment label='Высокое' size='84 МБ' additionalLabel='медленнее' />
        ),
        value: ModelType.Isnet,
        className: styles.segment,
      })
    }

    return options
  }, [])

  return (
    <div>
      <Typography.Title level={5} className={styles.title}>
        Качество выделения фона
      </Typography.Title>
      <Select
        disabled={disabled}
        className={styles.select}
        value={modelType}
        onChange={setModelType as (value: unknown) => void}
        options={options}
      />
    </div>
  )
}
