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
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import styles from './controls.module.scss'
import { animateIntegerTransition } from 'pages/editor/lib/animate-integer-transition'

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
const BLUR_RADIUS_MIN = 0
const BLUR_RADIUS_MAX = 50
const BLUR_ANIMATION_DURATION = 300

export const Controls = ({
  className,
  setFilters,
  separatedImage,
  selectedFilter,
  setSelectedFilter,
}: ControlsProps) => {
  const [radius, setRadius] = useState(BLUR_RADIUS_DEFAULT)
  const [sliderValue, setSliderValue] = useState(BLUR_RADIUS_DEFAULT)
  const targetRadiusRef = useRef(BLUR_RADIUS_DEFAULT)
  const [isTransitioningBlur, setIsTransitioningBlur] = useState(false)

  useEffect(() => {
    setFilters(
      getFilters(selectedFilter, radius, [
        separatedImage?.centerX || 0,
        separatedImage?.centerY || 0,
      ]),
    )
  }, [radius, selectedFilter, separatedImage, setFilters])

  const isRadiusControlAvailable = useMemo(
    () =>
      [
        BlurTypes.Vertical,
        BlurTypes.Horizontal,
        BlurTypes.Gaussian,
        BlurTypes.Zoom,
      ].includes(selectedFilter),
    [selectedFilter],
  )

  const handleSelectFilter: Exclude<SelectProps['onSelect'], undefined> =
    useCallback(
      (value) => {
        setIsTransitioningBlur(true)
        targetRadiusRef.current = radius
        animateIntegerTransition(
          radius,
          0,
          BLUR_ANIMATION_DURATION,
          setRadius,
        ).then(() => {
          setSelectedFilter(value)
          setIsTransitioningBlur(false)
        })
      },
      [radius, setSelectedFilter],
    )

  useEffect(() => {
    setIsTransitioningBlur(true)

    if (![BlurTypes.None].includes(selectedFilter)) {
      animateIntegerTransition(
        0,
        targetRadiusRef.current,
        BLUR_ANIMATION_DURATION,
        setRadius,
      ).then(() => {
        setIsTransitioningBlur(false)
      })
    }
  }, [selectedFilter])

  useEffect(() => {
    setRadius(sliderValue)
  }, [sliderValue])

  console.count(`render`)

  return (
    <div className={className}>
      <Typography.Title level={5} className={styles.title}>
        Радиус размытия
      </Typography.Title>
      <Slider
        disabled={!separatedImage || !isRadiusControlAvailable || isTransitioningBlur}
        min={BLUR_RADIUS_MIN}
        max={BLUR_RADIUS_MAX}
        value={sliderValue}
        onChange={setSliderValue}
      />
      <Typography.Title level={5} className={styles.title}>
        Размытие
      </Typography.Title>
      <Select
        disabled={!separatedImage}
        value={selectedFilter}
        onSelect={handleSelectFilter}
        className={styles.menu}
        options={menuItems}
      />
    </div>
  )
}
