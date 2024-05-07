import React, { Dispatch, SetStateAction, useMemo } from 'react'
import {
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import { ExpandMoreOutlined } from '@mui/icons-material'

import { ModelType } from 'features/background-removal/lib'
import { isIOS, isYandexGames } from 'shared/lib'

import styles from './model-picker.module.scss'
import classNames from 'classnames'

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
  const menuItems = useMemo(() => {
    const menuItems = [
      {
        label: `Низкое`,
        size: `5 МБ`,
        additionalLabel: `быстрее`,
        modelType: ModelType.U2netP,
      },
      {
        label: `Среднее`,
        size: `42 МБ`,
        modelType: ModelType.Quant,
      },
    ]

    if (!isIOS() && !isYandexGames()) {
      menuItems.push({
        label: `Высокое`,
        size: `84 МБ`,
        additionalLabel: `медленнее`,
        modelType: ModelType.Isnet,
      })
    }

    return menuItems
  }, [])

  const selectedMenuItem =
    menuItems.find((menuItem) => menuItem.modelType === modelType) ||
    menuItems[0]

  return (
    <div>
      <Heading fontWeight={600} size='sm' as='h6' className={styles.title}>
        Качество выделения фона
      </Heading>
      <Menu
        gutter={4}
        matchWidth
        strategy='fixed'
        placement='bottom'
        variant='outline'
      >
        <MenuButton
          isDisabled={disabled}
          textAlign='left'
          as={Button}
          rightIcon={<ExpandMoreOutlined />}
          width='100%'
          variant='outline'
          paddingInline={4}
        >
          {selectedMenuItem.label}
        </MenuButton>
        <MenuList>
          {menuItems.map((menuItem) => (
            <MenuItem
              key={menuItem.modelType}
              command={menuItem.size}
              className={classNames(
                styles.menuItem,
                menuItem.modelType === modelType && styles.menuItemActive,
              )}
              onClick={() => setModelType(menuItem.modelType)}
            >
              {menuItem.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  )
}
