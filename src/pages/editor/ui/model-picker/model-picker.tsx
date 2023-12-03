import { Segmented, SegmentedProps, Typography } from 'antd'
import { Dispatch, SetStateAction } from 'react'

import { ModelType } from 'features/background-removal/lib'

import styles from './model-picker.module.scss'

interface SegmentProps {
  label: string
  size: string
}
const Segment = ({ label, size }: SegmentProps) => {
  return (
    <div className={styles.modelSegment}>
      <Typography.Text className={styles.modelName}>{label}</Typography.Text>
      <Typography.Text className={styles.modelSize} type='secondary'>
        {size}
      </Typography.Text>
    </div>
  )
}

const options: SegmentedProps['options'] = [
  {
    label: <Segment label='Быстрое' size='42 МБ' />,
    value: ModelType.Small,
    className: styles.segment,
  },
  {
    label: <Segment label='Среднее' size='84 МБ' />,
    value: ModelType.Medium,
    className: styles.segment,
  },
  {
    label: <Segment label='Качественное' size='168 МБ' />,
    value: ModelType.Large,
    className: styles.segment,
  },
]

interface ModelPickerProps {
  modelType: ModelType
  setModelType: Dispatch<SetStateAction<ModelType>>
}

export const ModelPicker = ({ modelType, setModelType }: ModelPickerProps) => {
  return (
    <div>
      <Typography.Title level={5} className={styles.title}>
        Выделение фона
      </Typography.Title>
      <Segmented
        value={modelType}
        onChange={setModelType as (value: unknown) => void}
        className={styles.segmented}
        options={options}
      />
    </div>
  )
}
