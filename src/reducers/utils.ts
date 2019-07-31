// Put some common functions used by reducers.

import axios from 'axios'
import { PanelWithPosition } from '../type'
import { api } from '../config/config.json'

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

  try {
    const res = await axios.get(API_PANELS, {
      params: { sortable },
    })
    return res.data as PanelWithPosition[]
  } catch (error) {
    console.log(error)
  }
  return []
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

  try {
    const res = await axios.post(API_PANELS, {
      panels,
      sortable,
    })
    return res.status === 200
  } catch (error) {
    console.log(error)
    return false
  }
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
