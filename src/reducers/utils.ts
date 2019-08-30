// Put some common functions used by reducers.

import a from 'axios'
import { PanelWithPosition } from '../type'
import { api } from '../config/config.json'

// Set default timeout.
const axios = a.create({ timeout: api.timeout })

// API fetch.
const API_PANELS = process.env.API_PANELS || api.panels

/**
 * Get stored panels from backend server.
 * @param sortable
 */
export async function getPanels(
  sortable: boolean
): Promise<PanelWithPosition[]> {
  // Do nothing if api does not exist.
  if (!API_PANELS) return []

  // ----------- SAVE TO SERVER START -----------

  // try {
  //   const res = await axios.get(API_PANELS, {
  //     params: { sortable },
  //   })
  //   return res.data as PanelWithPosition[]
  // } catch (error) {
  //   console.log(error)
  // }
  // return []

  // ----------- SAVE TO SERVER END -----------

  return JSON.parse(localStorage.getItem(API_PANELS) || '[]')
}

/**
 * Save current panels to backend server.
 * @param panels
 * @param sortable
 */
export async function setPanels(
  panels: PanelWithPosition[],
  sortable: boolean
): Promise<boolean> {
  // Do nothing if api does not exist.
  if (!API_PANELS) return true

  // ----------- SAVE TO SERVER START -----------

  // try {
  //   const res = await axios.post(API_PANELS, {
  //     panels,
  //     sortable,
  //   })
  //   return res.status === 200
  // } catch (error) {
  //   console.log(error)
  //   return false
  // }

  // ----------- SAVE TO SERVER END -----------

  localStorage.setItem(API_PANELS, JSON.stringify(panels))
  return true
}

export function getUserInformation(userId: string) {
  return axios.get(api.userInformation + userId)
}

export function getReplyInputInformation(userId: string) {
  return axios.get(api.replyInputInformation + userId)
}

export function getReplyAutoInformation(userId: string) {
  return axios.get(api.replyAutoInformation + userId)
}

/**
 * Set cookie.
 * @param key
 * @param value
 */
export function setCookie(key: string, value: string) {
  document.cookie = `${key}=${value};`
}

/**
 * Get cookie.
 * @param key
 */
export function getCookie(key: string) {
  const cookies = document.cookie
  let coo: { [k: string]: string } = {}
  cookies.split(';').forEach(p => {
    if (p) {
      const pair = p.split('=')
      coo[pair[0].trim()] = pair[1].trim()
    }
  })
  return coo[key]
}

/**
 * Calculate for columns.
 * @param p
 * @param tabs
 */
export function getAvailableColumns(
  p: PanelWithPosition[],
  tabs: { [k: string]: boolean }
): number {
  return (
    p
      .filter(
        p =>
          !Object.keys(tabs)
            .filter(k => tabs[k])
            .includes(p.key)
      )
      .map(p => (p.largest ? 2 : 1) as number)
      .reduce((a, b) => a + b) / 2
  )
}
