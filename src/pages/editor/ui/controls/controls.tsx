import { Filter } from 'pixi.js'
import {
  HorizontalBlurFilter,
  VerticalBlurFilter,
  ZoomBlurFilter,
} from '@xalvaine/pixi-filters'
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'

import styles from './controls.module.scss'
import {
  Menu,
  MenuButton,
  MenuItem,
  Button,
  MenuList,
  Heading,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react'
import {
  ExpandMoreOutlined,
  BlurOffOutlined,
  BlurOnOutlined,
  BlurLinearOutlined,
  FilterTiltShiftOutlined,
} from '@mui/icons-material'
import classNames from 'classnames'

export enum BlurTypes {
  None = `none`,
  Gaussian = `gaussian`,
  Vertical = `vertical`,
  Horizontal = `horizontal`,
  Zoom = `zoom`,
}

const menuItems = [
  {
    blurType: BlurTypes.None,
    icon: BlurOffOutlined,
    label: `Без размытия`,
  },
  {
    blurType: BlurTypes.Gaussian,
    icon: BlurOnOutlined,
    label: `Обычное`,
  },
  {
    blurType: BlurTypes.Vertical,
    icon: BlurLinearOutlined,
    label: `Вертикальное`,
    className: styles.iconRotated,
  },
  {
    blurType: BlurTypes.Horizontal,
    icon: BlurLinearOutlined,
    label: `Горизонтальное`,
  },
  {
    blurType: BlurTypes.Zoom,
    icon: FilterTiltShiftOutlined,
    label: `Zoom`,
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
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)

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

  useEffect(() => {
    if (!isTooltipVisible) {
      return
    }
    const hideTooltip = () => setIsTooltipVisible(false)
    window.addEventListener(`mouseup`, hideTooltip)
    window.addEventListener(`touchend`, hideTooltip)

    return () => {
      window.removeEventListener(`mouseup`, hideTooltip)
      window.removeEventListener(`touchend`, hideTooltip)
    }
  }, [isTooltipVisible])

  const selectedMenuItem =
    menuItems.find((menuItem) => menuItem.blurType === selectedFilter) ||
    menuItems[0]

  return (
    <div className={className}>
      <Heading fontWeight={600} as='h6' size='sm' className={styles.title}>
        Радиус размытия
      </Heading>
      <Slider
        isDisabled={!separatedImage || !isRadiusControlAvailable}
        min={BLUR_RADIUS_MIN}
        max={BLUR_RADIUS_MAX}
        value={radius}
        onChange={setRadius}
        onTouchStart={() => setIsTooltipVisible(true)}
        onMouseDown={() => setIsTooltipVisible(true)}
      >
        <SliderTrack>
          <SliderFilledTrack
            className={
              !separatedImage || !isRadiusControlAvailable
                ? styles.disabledSlider
                : undefined
            }
          />
        </SliderTrack>
        <SliderThumb boxSize={5} />
      </Slider>
      <Heading fontWeight={600} as='h6' size='sm' className={styles.title}>
        Размытие
      </Heading>
      <Menu
        gutter={4}
        matchWidth
        strategy='fixed'
        placement='bottom'
        variant='outline'
      >
        <MenuButton
          isDisabled={!separatedImage}
          textAlign='left'
          as={Button}
          leftIcon={
            <selectedMenuItem.icon
              className={classNames(styles.icon, selectedMenuItem.className)}
            />
          }
          rightIcon={<ExpandMoreOutlined />}
          width='100%'
          variant='outline'
          paddingInline={4}
          iconSpacing={3}
        >
          {selectedMenuItem.label}
        </MenuButton>
        <MenuList>
          {menuItems.map((menuItem) => (
            <MenuItem
              key={menuItem.blurType}
              iconSpacing={3}
              className={classNames(
                styles.menuItem,
                menuItem.blurType === selectedFilter && styles.menuItemActive,
              )}
              icon={
                <menuItem.icon
                  className={classNames(styles.icon, menuItem.className)}
                />
              }
              onClick={() => setSelectedFilter(menuItem.blurType)}
            >
              {menuItem.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  )
}
