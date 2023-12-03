import { Menu, MenuProps, Typography } from 'antd'
import {
  BorderHorizontalOutlined,
  BorderInnerOutlined,
  BorderOutlined,
  BorderVerticleOutlined,
  StarTwoTone,
} from '@ant-design/icons'
import { BlurFilter, Filter } from 'pixi.js'
import { MotionBlurFilter, ZoomBlurFilter } from 'pixi-filters'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import classNames from 'classnames'

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
  const keyToFilter = useMemo(() => {
    return {
      [BlurTypes.None]: undefined,
      [BlurTypes.Gaussian]: new BlurFilter(12, 10),
      [BlurTypes.Vertical]: new MotionBlurFilter([0, 30], 25),
      [BlurTypes.Horizontal]: new MotionBlurFilter([30, 0], 25),
      [BlurTypes.Zoom]: new ZoomBlurFilter({
        center: [separatedImage?.centerX || 0, separatedImage?.centerY || 0],
        strength: 0.1,
      }),
    }
  }, [separatedImage])

  const handleSelectItem = useCallback<
    Exclude<MenuProps['onSelect'], undefined>
  >(
    (event) => {
      setSelectedFilter(event.key as BlurTypes)
    },
    [setSelectedFilter],
  )

  useEffect(() => {
    const filter = keyToFilter[selectedFilter]
    setFilters(filter ? [filter] : [])
  }, [keyToFilter, selectedFilter, setFilters])

  useEffect(() => {
    if (!separatedImage) {
      setSelectedFilter(BlurTypes.None)
    }
  }, [separatedImage, setSelectedFilter])

  return (
    <div>
      <Typography.Title level={5} className={styles.title}>
        Размытие
      </Typography.Title>
      <Menu
        disabled={!separatedImage}
        selectedKeys={[selectedFilter]}
        onSelect={handleSelectItem}
        className={classNames(className, styles.menu)}
        mode='vertical'
        items={menuItems}
      />
    </div>
  )
}
