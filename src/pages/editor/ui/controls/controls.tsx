import { CONTROLS_NAMESPACE } from './controls.18n'
import React, { Dispatch, SetStateAction, useMemo } from 'react'
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
  BlurOnOutlined,
  BlurLinearOutlined,
  FilterTiltShiftOutlined,
} from '@mui/icons-material'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import { useBackgroundRemoval } from 'features/background-removal/lib'

import { BlurType } from '../scene'

import styles from './controls.module.scss'

interface ControlsProps {
  className?: string
  segmentation: ReturnType<typeof useBackgroundRemoval>['segmentation']
  blurType: typeof BlurType[keyof typeof BlurType]
  setBlurType: Dispatch<SetStateAction<typeof BlurType[keyof typeof BlurType]>>
  radius: number
  setRadius: Dispatch<SetStateAction<number>>
}

const BLUR_RADIUS_MIN = 1
const BLUR_RADIUS_MAX = 50

export const Controls = ({
  className,
  segmentation,
  blurType,
  setBlurType,
  radius,
  setRadius,
}: ControlsProps) => {
  const { t } = useTranslation(CONTROLS_NAMESPACE)

  const isRadiusControlAvailable = useMemo(
    () =>
      [
        BlurType.Vertical,
        BlurType.Horizontal,
        BlurType.Gaussian,
        BlurType.Zoom,
      ].includes(blurType),
    [blurType],
  )

  const menuItems = useMemo(
    () => [
      {
        blurType: BlurType.Gaussian,
        icon: BlurOnOutlined,
        label: t('default'),
      },
      {
        blurType: BlurType.Vertical,
        icon: BlurLinearOutlined,
        label: t('vertical'),
        className: styles.iconRotated,
      },
      {
        blurType: BlurType.Horizontal,
        icon: BlurLinearOutlined,
        label: t('horizontal'),
      },
      {
        blurType: BlurType.Zoom,
        icon: FilterTiltShiftOutlined,
        label: t('zoomBlur'),
      },
    ],
    [t],
  )

  const selectedMenuItem =
    menuItems.find((menuItem) => menuItem.blurType === blurType) || menuItems[0]

  const handleSetBlurType = (blurType: typeof BlurType[keyof typeof BlurType]) => {
    ym(96030221, `reachGoal`, blurType)
    setBlurType(blurType)
  }

  return (
    <div className={className}>
      <Heading fontWeight={600} as='h6' size='sm' className={styles.title}>
        {t('blurRadius')}
      </Heading>
      <Slider
        isDisabled={!segmentation || !isRadiusControlAvailable}
        min={BLUR_RADIUS_MIN}
        max={BLUR_RADIUS_MAX}
        value={radius}
        onChange={setRadius}
      >
        <SliderTrack>
          <SliderFilledTrack
            className={
              !segmentation || !isRadiusControlAvailable
                ? styles.disabledSlider
                : undefined
            }
          />
        </SliderTrack>
        <SliderThumb boxSize={5} />
      </Slider>
      <Heading fontWeight={600} as='h6' size='sm' className={styles.title}>
        {t('blurType')}
      </Heading>
      <Menu
        gutter={4}
        matchWidth
        strategy='fixed'
        placement='bottom'
        variant='outline'
      >
        <MenuButton
          isDisabled={!segmentation}
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
                menuItem.blurType === blurType && styles.menuItemActive,
              )}
              icon={
                <menuItem.icon
                  className={classNames(styles.icon, menuItem.className)}
                />
              }
              onClick={() => handleSetBlurType(menuItem.blurType)}
            >
              {menuItem.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  )
}
