import { Menu, MenuProps, Typography } from 'antd'
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
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react'

import styles from './controls.module.scss'

export enum BlurTypes {
  None = `none`,
  Gaussian = `gaussian`,
  Vertical = `vertical`,
  Horizontal = `horizontal`,
  Zoom = `zoom`,
}

const menuItems: MenuProps['items'] = [
  { key: BlurTypes.None, icon: <BorderOutlined />, label: `Без размытия` },
  { key: BlurTypes.Gaussian, icon: <BorderInnerOutlined />, label: `Обычное` },
  {
    key: BlurTypes.Vertical,
    icon: <BorderHorizontalOutlined />,
    label: `Вертикальное`,
  },
  {
    key: BlurTypes.Horizontal,
    icon: <BorderVerticleOutlined />,
    label: `Горизонтальное`,
  },
  { key: BlurTypes.Zoom, icon: <StarTwoTone />, label: `Zoom` },
]

interface ControlsProps {
  className?: string
  setFilters: Dispatch<SetStateAction<Filter[]>>
  separatedImage: Components.Schemas.Segmentation | undefined
  selectedFilter: BlurTypes
  setSelectedFilter: Dispatch<SetStateAction<BlurTypes>>
}

export const Controls = ({
  className,
  setFilters,
  separatedImage,
  selectedFilter,
  setSelectedFilter,
}: ControlsProps) => {
  const keyToFilters = useMemo(() => {
    const radius = 16

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
          center: [separatedImage?.centerX || 0, separatedImage?.centerY || 0],
        }),
      ],
    }
  }, [separatedImage?.centerX, separatedImage?.centerY])

  const handleSelectItem = useCallback<
    Exclude<MenuProps['onSelect'], undefined>
  >(
    (event) => {
      setSelectedFilter(event.key as BlurTypes)
    },
    [setSelectedFilter],
  )

  useEffect(() => {
    const filters = keyToFilters[selectedFilter]
    setFilters(filters)
  }, [keyToFilters, selectedFilter, setFilters])

  useEffect(() => {
    if (!separatedImage) {
      setSelectedFilter(BlurTypes.None)
    }
  }, [separatedImage, setSelectedFilter])

  return (
    <div className={className}>
      <Typography.Title level={5} className={styles.title}>
        Размытие
      </Typography.Title>
      <Menu
        disabled={!separatedImage}
        selectedKeys={[selectedFilter]}
        onSelect={handleSelectItem}
        className={styles.menu}
        mode='vertical'
        items={menuItems}
      />
    </div>
  )
}
