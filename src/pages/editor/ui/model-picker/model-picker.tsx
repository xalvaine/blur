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
    label: <Segment label='Низкое' size='5 МБ' />,
    value: ModelType.U2netP,
    className: styles.segment,
  },
  {
    label: <Segment label='Среднее' size='42 МБ' />,
    value: ModelType.Quant,
    className: styles.segment,
  },
  {
    label: <Segment label='Высокое' size='84 МБ' />,
    value: ModelType.Isnet,
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
        Качество выделения фона
      </Typography.Title>
      <div className={styles.scrollWrapper}>
      <Segmented
        value={modelType}
        onChange={setModelType as (value: unknown) => void}
        className={styles.segmented}
        options={options}
      />
      </div>
    </div>
  )
}
