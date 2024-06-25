export const orderNumberPrefix = 'BT'
export const siteName = 'Boomtingz'
export const category = ['Drinks', 'Candy', 'Snacks', 'Gum', 'Mints', 'Tobacco', 'Beauty', 'Others']
export const api = 'http://boomtingz-api.vercel.app/api/'
export const EXPRATE = (level) => {
    return 0.04 + (0.04 * (level / 100))
}
