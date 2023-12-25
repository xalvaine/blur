import { Select, SelectProps, Slider, Typography } from 'antd'
import {
  BorderHorizontalOutlined,
  BorderInnerOutlined,
  BorderOutlined,
  BorderVerticleOutlined,
  StarTwoTone,
} from '@ant-design/icons'
import { Filter } from 'pixi.js'
import {
  HorizontalBlurFilter,
  VerticalBlurFilter,
  ZoomBlurFilter,
} from '@xalvaine/pixi-filters'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'

import styles from './controls.module.scss'

export enum BlurTypes {
  None = `none`,
  Gaussian = `gaussian`,
  Vertical = `vertical`,
  Horizontal = `horizontal`,
  Zoom = `zoom`,
}

interface OptionProps {
  icon: ReactNode
  label: string
}

const Option = ({ icon, label }: OptionProps) => {
  return (
    <div className={styles.option}>
      {icon}
      {label}
    </div>
  )
}

const menuItems: SelectProps['options'] = [
  {
    value: BlurTypes.None,
    label: <Option icon={<BorderOutlined />} label='Без размытия' />,
  },
  {
    value: BlurTypes.Gaussian,
    label: <Option icon={<BorderInnerOutlined />} label='Обычное' />,
  },
  {
    value: BlurTypes.Vertical,
    label: <Option icon={<BorderHorizontalOutlined />} label='Вертикальное' />,
  },
  {
    value: BlurTypes.Horizontal,
    label: <Option icon={<BorderVerticleOutlined />} label='Горизонтальное' />,
  },
  {
    value: BlurTypes.Zoom,
    label: <Option icon={<StarTwoTone />} label='Zoom' />,
  },
]

interface ControlsProps {
  className?: string
  setFilters: Dispatch<SetStateAction<Filter[]>>
  separatedImage: Components.Schemas.Segmentation | undefined
  selectedFilter: BlurTypes
  setSelectedFilter: Dispatch<SetStateAction<BlurTypes>>
}

const getFilters = (
  blurTypes: BlurTypes,
  radius: number,
  center: [number, number],
) => {
  return {
    [BlurTypes.None]: [],
    [BlurTypes.Gaussian]: [
      new VerticalBlurFilter({ radius }),
      new HorizontalBlurFilter({ radius }),
    ],
    [BlurTypes.Vertical]: [new VerticalBlurFilter({ radius })],
    [BlurTypes.Horizontal]: [new HorizontalBlurFilter({ radius })],
    [BlurTypes.Zoom]: [
      new ZoomBlurFilter({
        radius,
        center,
      }),
    ],
  }[blurTypes]
}

const BLUR_RADIUS_DEFAULT = 16
const BLUR_RADIUS_MIN = 1
const BLUR_RADIUS_MAX = 50

export const Controls = ({
  className,
  setFilters,
  separatedImage,
  selectedFilter,
  setSelectedFilter,
}: ControlsProps) => {
  const [radius, setRadius] = useState(BLUR_RADIUS_DEFAULT)

  useEffect(() => {
    setFilters(
      getFilters(selectedFilter, radius, [
        separatedImage?.centerX || 0,
        separatedImage?.centerY || 0,
      ]),
    )
  }, [radius, selectedFilter, separatedImage, setFilters])

  const showRadiusControl = useMemo(
    () =>
      [
        BlurTypes.Vertical,
        BlurTypes.Horizontal,
        BlurTypes.Gaussian,
        BlurTypes.Zoom,
      ].includes(selectedFilter),
    [selectedFilter],
  )

  return (
    <div className={className}>
      <Typography.Title level={5} className={styles.title}>
        Размытие
      </Typography.Title>
      <Select
        disabled={!separatedImage}
        value={selectedFilter}
        onSelect={setSelectedFilter}
        className={styles.menu}
        options={menuItems}
      />
      {showRadiusControl && (
        <>
          <Typography.Title level={5} className={styles.title}>
            Радиус размытия
          </Typography.Title>
          <Slider
            disabled={!separatedImage}
            min={BLUR_RADIUS_MIN}
            max={BLUR_RADIUS_MAX}
            value={radius}
            onChange={setRadius}
          />
        </>
      )}
    </div>
  )
}
