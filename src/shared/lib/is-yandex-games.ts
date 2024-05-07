export const isYandexGames = () => {
  return (
    typeof process.env.REACT_APP_IS_YANDEX_GAMES === `string` &&
    !!parseInt(process.env.REACT_APP_IS_YANDEX_GAMES)
  )
}
